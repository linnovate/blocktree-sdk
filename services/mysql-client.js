/**
 * MySql Client singleton.
 * @function MySqlClient
 * @modules mysql2@^2
 * @envs MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB
 * @param {object} { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/mysql2
 * @example const data = await (await MySqlClient()).query('...', () => {});
 */

let $instance;

export async function MySqlClient({ MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = {}) {

  if ($instance) {
    return $instance;
  }
  
  // imports
  const Mysql = await import('mysql2').catch(err => {
    throw Error(`\x1b[31m (MySqlClient) missing modules:\x1b[36m mysql2`);
  });

  // envs
  MYSQL_HOST ??= process.env.MYSQL_HOST;
  MYSQL_USER ??= process.env.MYSQL_USER;
  MYSQL_PASS ??= process.env.MYSQL_PASS;
  MYSQL_DB   ??= process.env.MYSQL_DB;
   
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASS || !MYSQL_DB) {
    throw Error(`\x1b[31m (MySqlClient) missing envs:\x1b[36m MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB`)
  }
  
  // instance
  $instance = Mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB
  });

  return $instance;

};
