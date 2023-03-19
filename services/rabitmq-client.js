/**
 * Rabitmq Client singleton.
 * @function RabitmqClient
 * @modules amqplib@^0.10
 * @envs REBITMQ_URI
 * @param {object} { REBITMQ_URI }
 * @return {promise} the singleton instance
 * @docs https://github.com/amqp-node/amqplib
 * @example const data = await (await RabitmqClient()).createChannel();
 */

let $instance;

export async function RabitmqClient({ REBITMQ_URI } = {}) {

  if ($instance) {
    return $instance;
  }
  
  // imports
  const amqplib = await import('amqplib').catch(err => {
    throw Error(`\x1b[31m (RabitmqClient) missing modules:\x1b[36m amqplib`);
  });

  // envs
  REBITMQ_URI ??= process.env.REBITMQ_URI;
   
  if (!REBITMQ_URI) {
    throw Error(`\x1b[31m (RabitmqClient) missing envs:\x1b[36m REBITMQ_URI`)
  }
  
  // instance
  $instance = await amqplib.connect(REBITMQ_URI);

  return $instance;

};
