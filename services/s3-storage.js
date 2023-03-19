/**
 * S3 Storage singleton.
 * @function S3Storage
 * @modules @aws-sdk/client-s3@^3
 * @envs S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY
 * @param {object} { S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/@aws-sdk/client-s3
 * @example const data = await (await S3Storage()).send(command);
 */

let $instance;

export async function S3Storage({ S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY } = {}) {

  if ($instance) {
    return $instance;
  }
  
  // imports
  const { S3Client } = await import('@aws-sdk/client-s3').catch(err => {
    throw Error(`\x1b[31m (S3Storage) missing modules:\x1b[36m @aws-sdk/client-s3`);
  });
  
  // envs
  S3_BUCKET     ??= process.env.S3_BUCKET;
  S3_REGION     ??= process.env.S3_REGION;
  S3_ACCESS_KEY ??= process.env.S3_ACCESS_KEY;
  S3_SECRET_KEY ??= process.env.S3_SECRET_KEY;
   
  if (!REDIS_URI) {
    throw Error(`\x1b[31m (S3Storage) missing envs:\x1b[36m S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY`)
  }
  
  // instance
  $instance = new S3Client({
    bucketName: S3_BUCKET ,
    region: S3_REGION ,
    accessKeyId: S3_ACCESS_KEY ,
    secretAccessKey: S3_SECRET_KEY ,
  });

  return $instance;

};
