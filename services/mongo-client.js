/**
 * Mongo Client singleton.
 * @function MongoClient
 * @modules mongodb@^4
 * @envs MONGO_URI
 * @param {object} { MONGO_URI }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/mongodb
 * @example const data = await (await MongoClient()).db('...');
 */

let $instance;

export async function MongoClient({ MONGO_URI } = {}) {

  if ($instance) {
    return $instance;
  }

  // imports
  const { MongoClient } = await import('mongodb').catch(err => {
    throw Error(`\x1b[31m (MongoClient) missing modules:\x1b[36m mongodb`);
  });

  // envs
  MONGO_URI ??= process.env.MONGO_URI;
   
  if (!MONGO_URI) {
    throw Error(`\x1b[31m (MongoClient) missing envs:\x1b[36m MONGO_URI`)
  }

  // instance 
  $instance = new MongoClient(MONGO_URI);
  await $instance.connect();

  return $instance;

};
