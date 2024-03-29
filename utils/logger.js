/**
 * Logger.
 * @function Logger
 * @modules winston@^3
 * @envs LOG_SERVICE_NAME
 * @param {object} { LOG_SERVICE_NAME }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/winston
 * @example (await Logger()).log('...', '...');
 * @example Logger().then(logger => logger.log('...', '...'));
 * @example const logger = await Logger(); logger.log('...', '...');
 */

let $instance;

export async function Logger({ LOG_SERVICE_NAME } = {}) {

  if ($instance) {
    return $instance;
  }
  
  // imports
  const winston = await import('winston').catch(err => {
    throw Error(`\x1b[31m (Logger) missing modules:\x1b[36m winston`);
  });

  // envs
  LOG_SERVICE_NAME ??= process.env.LOG_SERVICE_NAME;
   
  if (!LOG_SERVICE_NAME) {
    throw Error(`\x1b[31m (Logger) missing envs:\x1b[36m LOG_SERVICE_NAME`)
  }
  
  // instance
  $instance = winston.createLogger({
    defaultMeta: { service: LOG_SERVICE_NAME },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });

  return $instance;

};
