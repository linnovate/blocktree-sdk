/**
 * Elastic Client singleton.
 * @function ElasticClient
 * @modules @elastic/elasticsearch@^8
 * @envs ELASTICSEARCH_URL
 * @param {object} { ELASTICSEARCH_URL }
 * @return {promise} the singleton instance
 * @docs https://www.elastic.co/guide/en/elasticsearch/reference/8.5/elasticsearch-intro.html
 * @example const data = await (await ElasticClient()).search({ ... });
 */

let $instance;

export async function ElasticClient({ ELASTICSEARCH_URL } = {}) {

  if ($instance) {
    return $instance;
  }

  // imports
  const { Client } = await import('@elastic/elasticsearch').catch(err => {
    throw Error(`\x1b[31m (ElasticClient) missing modules:\x1b[36m @elastic/elasticsearch`);
  });

  // envs
  ELASTICSEARCH_URL ??= process.env.ELASTICSEARCH_URL;

  if (!ELASTICSEARCH_URL) {
    throw Error(`\x1b[31m (ElasticClient) missing envs:\x1b[36m ELASTICSEARCH_URL`)
  }

  // instance
  $instance = new Client({
    node: ELASTICSEARCH_URL,
  });

  return $instance;

}
