/**
 * Security Express
 * @function SecurityExpress
 * @modules compression helmet cors
 * @envs []
 * @param {object} the express app
 * @param {object} {
 *   corsOptions,   // see: https://www.npmjs.com/package/cors#configuring-cors 
 *   helmetOptions, // see: https://www.npmjs.com/package/helmet
 * }
 * @return {object} express app.next()
 * @example SecurityExpress(app, { corsOptions, helmetOptions } = {});
 */

export function SecurityExpress(app, { corsOptions, helmetOptions } = {}) {

  (async function () {
    const { default: compression } = await import('compression');
    const { default: helmet } = await import('helmet');
    const { default: cors } = await import('cors');

    app.use(compression());
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
  }())

  return (req, res, next) => next();

};