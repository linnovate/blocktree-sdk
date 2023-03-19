/**
 * Redis Client singleton.
 * @function RedisClient
 * @modules redis@^4
 * @envs REDIS_URI
 * @param {object} { REDIS_URI }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/redis
 * @example const data = await (await RedisClient()).set('key', 'value');
 */

let $instance;

export async function RedisClient({ REDIS_URI } = {}) {

  if ($instance) {
    return $instance;
  }
  
  // imports
  const { createClient } = await import('redis').catch(err => {
    throw Error(`\x1b[31m (RedisClient) missing modules:\x1b[36m redis`);
  });
  
  // envs
  REDIS_URI ??= process.env.REDIS_URI;
   
  if (!REDIS_URI) {
    throw Error(`\x1b[31m (RabitmqClient) missing envs:\x1b[36m REDIS_URI`)
  }
  
  // instance
  $instance = createClient({ url: REDIS_URI });

  await $instance.connect();

  return $instance;

};
