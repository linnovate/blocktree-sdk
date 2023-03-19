/**
 * JWT Parser
 * @function JWTParser
 * @modules jsonwebtoken@^8.*
 * @envsJWT_SECRET_KEY
 * @param {string} token
 * @param {array} algorithms (default: ['RS256'])
 * @param {string} JWT_SECRET_KEY
 * @return {promise} the jwt parsing
 * @docs https://www.npmjs.com/package/jsonwebtoken
 * @example const data = await JWTParser(token);
 */

export async function JWTParser(token, algorithms = ['RS256'], JWT_SECRET_KEY) {
  
  // imports
  const { default: jwt } = await import('jsonwebtoken').catch(err => {
    throw Error(`\x1b[31m (JWTParser) missing modules:\x1b[36m jsonwebtoken`);
  });

  // envs
  JWT_SECRET_KEY ??= process.env.JWT_SECRET_KEY;
   
  if (!JWT_SECRET_KEY) {
    throw Error(`\x1b[31m (JWTParser) missing envs:\x1b[36m JWT_SECRET_KEY`)
  }

  // decode base64
  let key = JWT_SECRET_KEY;
  if ((Buffer.from(key, 'base64').toString('base64') === key)) {
    key = Buffer.from(key, 'base64').toString('utf8')
  }

  try {
    return jwt.verify(token, key, { algorithms });
  } catch (error) {
    throw Error(`(JWTParser) ${error}`)
  }

};
