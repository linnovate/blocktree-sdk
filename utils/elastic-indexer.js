import { ElasticClient } from '../services/elastic-client.js';
import { Logger } from './logger.js';

/**
 * Elastic Indexer.
 * @function ElasticIndexer
 * @modules []
 * @envs []
 * @param {object} { ELASTICSEARCH_URL, index, mappings, settings }
 * @param {function} async batchCallback(offset, config)
 * @param {function} async testCallback(config)
 * @return {bool} is done
 * @example const isDone = await ElasticIndexer(config, async (offset, config) => [], async (config) => true);
 */
export async function ElasticIndexer(config, batchCallback, testCallback) {

  const logger = await Logger();

  try {

    /*
     * Get elastic instance
     */
    const client = await ElasticClient({ ELASTICSEARCH_URL: config.ELASTICSEARCH_URL });

    /*
     * Create index 
     */
    // create name
    const indexName = `${config.index}-${new Date().toLocaleString('he').replace(/[\/ ,:]/g, '-').toLowerCase()}`;

    // create index
    await client.indices.create({
      index: indexName,
      mappings: config.mappings,
      settings: config.settings,
    });

    logger.info('ElasticIndexer - create index', { alias: config.index, index: indexName });

    /*
     * Create docs 
     */
    let offset = 0;
    // create data (using batches)
    async function setData() {

      // load docs
      const docs = await batchCallback(offset, config)
        .catch((error) => {
          logger.error('ElasticIndexer - Batch loading failed', { alias: config.index, index: indexName, offset, error });
        });

      // logger
      logger.info('ElasticIndexer - Batch loading succeeded', { alias: config.index, index: indexName, offset, count: docs?.length });

      if (docs?.length) {
        // inject index name
        const operations = docs.flatMap(doc => [{ index: { _index: indexName } }, doc]);
        // create docs
        const response = await client.bulk({ operations, refresh: true });
        // logger
        if (response.errors) {
          const errors = response.items.map(i => i.index.error.reason)
          logger.error('ElasticIndexer - Batch bulk failed', { alias: config.index, index: indexName, offset, count: docs?.length });
        } else {
          logger.info('ElasticIndexer - Batch bulk succeeded', { alias: config.index, index: indexName, offset, count: docs?.length });
        }
        // update offset
        offset += docs.length;
        // run next batch
        await setData();
      }
    }
    await setData();

    logger.info('ElasticIndexer - Inserting items is finished', { alias: config.index, index: indexName, count: offset });

    /*
     * Test callback
     */
    if (testCallback) {
      if (testCallback(config)) {
        // logger
        logger.info('ElasticIndexer - Test succeeded', { alias: config.index, index: indexName });
      } else {
        // logger
        logger.error('ElasticIndexer - Test failed', { alias: config.index, index: indexName });
        // skip update alias
        return false;
      }
    }

    /*
     * Update alias
     */

    // load indices of the alias
    const aliases = await client.indices.getAlias({ name: config.index })
      .catch(data => ({}));;

    // create actions - update alias
    const actions = [{ add: { index: indexName, alias: config.index } }];

    // create actions - remove old indices
    if (Object.keys(aliases).length) {
      actions.push({ remove_index: { indices: Object.keys(aliases) } });
    }

    // update aliases
    await client.indices.updateAliases({ body: { actions } });

    // logger
    logger.info('ElasticIndexer - Update aliases', { alias: config.index, index: indexName, remove_index: Object.keys(aliases) });

    return true;


  } catch (error) {
    logger.error('ElasticIndexer - General error', { alias: config.index, error });
  }

};
