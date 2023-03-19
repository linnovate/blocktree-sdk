/**
 * Google Storage singleton.
 * @function GoogleStorage
 * @modules @google-cloud/storage@^6
 * @envs GOOGLE_STORAGE_CLIENT_EMAIL, GOOGLE_STORAGE_PRIVATE_KEY
 * @param {object} { GOOGLE_STORAGE_CLIENT_EMAIL, GOOGLE_STORAGE_PRIVATE_KEY }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/@google-cloud/storage
 * @example const data = await (await GoogleStorage()).bucket({ ... });
 */

let $instance;

export async function GoogleStorage({ GOOGLE_STORAGE_CLIENT_EMAIL, GOOGLE_STORAGE_PRIVATE_KEY } = {}) {

  if ($instance) {
    return $instance;
  }

  // imports
  const { Storage } = await import('@google-cloud/storage').catch(err => {
    throw Error(`\x1b[31m (GoogleStorage) missing modules:\x1b[36m @google-cloud/storage`);
  });
  
  // envs
  GOOGLE_STORAGE_CLIENT_EMAIL ??= process.env.GOOGLE_STORAGE_CLIENT_EMAIL;
  GOOGLE_STORAGE_PRIVATE_KEY ??= process.env.GOOGLE_STORAGE_PRIVATE_KEY;
   
  if (!GOOGLE_STORAGE_CLIENT_EMAIL || !GOOGLE_STORAGE_PRIVATE_KEY) {
    throw Error(`\x1b[31m (GoogleStorage) missing envs:\x1b[36m GOOGLE_STORAGE_CLIENT_EMAIL, GOOGLE_STORAGE_PRIVATE_KEY`)
  }
  
  // decode base64
  let key = GOOGLE_STORAGE_PRIVATE_KEY;
  if ((Buffer.from(key, 'base64').toString('base64') === key)) {
    key = Buffer.from(key, 'base64').toString('utf8')
  }

  // instance
  $instance = new Storage({
    credentials: {
      private_key: key,
      client_email: GOOGLE_STORAGE_CLIENT_EMAIL,
    }
  });

  return $instance;

}
