# Blocktree core
Tools for building infrastructure, Blocktree on the server

---

## Install module
#### add the gitlab.linnovate.net registry (only for npm):
```bash
echo @blocktree:registry=https://gitlab.linnovate.net/api/v4/packages/npm/ >> .npmrc
echo //gitlab.linnovate.net/api/v4/packages/npm/:_authToken=\${AUTH_TOKEN} >> .npmrc
```
#### add gitlab token: https://gitlab.linnovate.net/groups/blocktree/-/settings/access_tokens
```bash
export AUTH_TOKEN=[your_token]
npm install @blocktree/core
```

---

## API

> [Basic server](#server)

> [Core](#core)
 - [Security Express](#security-express)
 - [Graphql Express](#graphql-express)

> [Utils](#utils)
 - [Logger](#logger)
 - [JWT Parser](#jwt-parser)
 - [Elastic Indexer](#elastic-indexer)
 - [AutoLoad](#autoLoad)

> [Services](#services)
 - [Elastic Client](#elastic-client)
 - [Google Storage](#google-storage)
 - [Mailer Client](#mailer-client)
 - [Mongo Client](#mongo-client)
 - [MySql Client](#mysql-client)
 - [Rabitmq Client](#rabitmq-client)
 - [Redis Client](#redis-client)
 - [S3 Storage](#s3-storage)

### Basic server
```js
import express from 'express';
const app = express();
const server = app.listen(5000, () => console.log(`Example app listening on port 5000!`));
```

### Core

#### Security Express
```js
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
 * @return {object} the express router
 */
SecurityExpress(app, { corsOptions, helmetOptions } = {});
```

#### Graphql Express
```js
/**
 * Graphql Express
 * @function GraphqlExpress
 * @modules graphql graphql-yoga ws graphql-ws
 * @envs []
 * @param {object} the express app
 * @param {array} [{
 *   directives: [{
 *     typeDefs: String,      // see: https://spec.graphql.org/draft/#sec-Type-System.Directives
 *     transformer: Function, // see: https://the-guild.dev/graphql/tools/docs/schema-directives#implementing-schema-directives
 *   }]
 *   typeDefs,    // see: https://graphql.org/learn/schema
 *   resolvers,   // see: https://graphql.org/learn/execution
 * }]
 * @param {object} the options {
 *   serverWS,    // the express server
 *   yogaOptions, // see: https://the-guild.dev/graphql/yoga-server/docs
 * }
 * @return {object} express app.next()
 *
 * @example setup Graphql:
   ---------------
   import express from 'express';
   const app = express();
   const server = app.listen(5000);
   GraphqlExpress(app, [{ typeDefs: '', resolvers: {} }], { serverWS: server, yogaOptions: {} });
 *	 
 * @example server WebSocket:
   ---------------------------
   const { createPubSub } = await import('graphql-yoga');
   const pubSub = createPubSub();
   export default {
     Mutation: {
       test: () => pubSub.publish("MY_TEST", { test: true }),
     },
     Subscription: {
       test: {
         subscribe: () => pubsub.subscribe("MY_TEST"),
       }
     }
   }
 *
 * @example client WebSocket:
   ---------------------------
   import { createClient } from 'graphql-ws';
   const client = createClient({ url: 'ws://localhost:5000/graphql' });

   const unsubscribe = client.subscribe({
     query: 'subscription { test }',
   },{
     next: (data) => console.log("next:", data),
     error: (data) => console.log("error:", data),
     complete: (data) => console.log("complete:", data),
   });
*/
GraphqlExpress(app, [{ typeDefs: '', resolvers: {} }], { serverWS: server, yogaOptions: {} });
```

### Utils

#### Logger
```js
/**
 * Logger.
 * @function Logger
 * @modules winston@^3
 * @envs LOG_SERVICE_NAME
 * @param {object} { LOG_SERVICE_NAME }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/winston
 */
(await Logger()).log('...', '...');
Logger().then(logger => logger.log('...', '...'));
const logger = await Logger(); logger.log('...', '...');
```

#### JWT Parser
```js
/**
 * JWT Parser
 * @function JWTParser
 * @modules jsonwebtoken@^8.*
 * @envs JWT_SECRET_KEY
 * @param {string} token
 * @param {array} algorithms (default: ['RS256'])
 * @param {string} JWT_SECRET_KEY
 * @return {promise} the jwt parsing
 * @docs https://www.npmjs.com/package/jsonwebtoken
 */
const data = await JWTParser(token);
```

#### Elastic Indexer
```js
/**
 * Elastic Indexer.
 * @function ElasticIndexer
 * @modules []
 * @envs []
 * @param {object} { ELASTICSEARCH_URL, index, mappings, settings }
 * @param {function} batchCallback(offset, config)
 * @param {function} testCallback(config)
 * @return {bool} is done
 */
const isDone = await ElasticIndexer({ index: "my_name", mappings: {}, settings: {} }, (offset, config) => [], (config) => true);
```

#### AutoLoad
```js
/**
 * AutoLoad es6 modules from a dirs list
 * @function AutoLoad
 * @modules []
 * @envs []
 * @param {array} dirs - ["typeDefs", "directives", "resolvers"]
 * @param {string} baseUrl - "src"
 * @return {object} the modules
 * @example const { typeDefs, directives, resolvers } = await AutoLoad(["typeDefs", "directives", "resolvers"]);
 */
const { typeDefs, directives, resolvers } = await AutoLoad(["typeDefs", "directives", "resolvers"]);
```

### Services

#### Elastic Client
```js
/**
 * Elastic Client singleton.
 * @function ElasticClient
 * @modules @elastic/elasticsearch@^8
 * @envs ELASTICSEARCH_URL
 * @param {object} { ELASTICSEARCH_URL }
 * @return {promise} the singleton instance
 * @docs https://www.elastic.co/guide/en/elasticsearch/reference/8.5/elasticsearch-intro.html
 */
const data = await (await ElasticClient()).search({ ... });
```

#### Google Storage
```js
/**
 * Google Storage singleton.
 * @function GoogleStorage
 * @modules @google-cloud/storage@^6
 * @envs GOOGLE_STORAGE_CLIENT_EMAIL, GOOGLE_STORAGE_PRIVATE_KEY
 * @param {object} { GOOGLE_STORAGE_CLIENT_EMAIL, GOOGLE_STORAGE_PRIVATE_KEY }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/@google-cloud/storage
 */
const data = await (await GoogleStorage()).bucket({ ... });
```

#### Mailer Client
```js
/**
 * Mailer Client singleton.
 * @function MailerClient
 * @modules nodemailer@^6
 * @envs MAILER_HOST, MAILER_USER, MAILER_PESS
 * @param {object} { MAILER_HOST, MAILER_USER, MAILER_PESS }
 * @return {promise} the singleton instance
 * @docs https://nodemailer.com/about;
 */
const data = await (await MailerClient()).sendMail({ ... });
```

#### Mongo Client
```js
/**
 * Mongo Client singleton.
 * @function MongoClient
 * @modules mongodb@^4
 * @envs MONGO_URI
 * @param {object} { MONGO_URI }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/mongodb
 */
const data = await (await MongoClient()).db('...');
```

#### MySql Client
```js
/**
 * MySql Client singleton.
 * @function MySqlClient
 * @modules mysql2@^2
 * @envs MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB
 * @param {object} { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/mysql2
 */
const data = await (await MySqlClient()).query('...', () => {});
```

#### Rabitmq Client
```js
/**
 * Rabitmq Client singleton.
 * @function RabitmqClient
 * @modules amqplib@^0.10
 * @envs REBITMQ_URI
 * @param {object} { REBITMQ_URI }
 * @return {promise} the singleton instance
 * @docs https://github.com/amqp-node/amqplib
 */
const data = await (await RabitmqClient()).createChannel();
```

#### Redis Client
```js
/**
 * Redis Client singleton.
 * @function RedisClient
 * @modules redis@^4
 * @envs REDIS_URI
 * @param {object} { REDIS_URI }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/redis
 */
const data = await (await RedisClient()).set('key', 'value');
```

#### S3 Storage
```js
/**
 * S3 Storage singleton.
 * @function S3Storage
 * @modules @aws-sdk/client-s3@^3
 * @envs S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY
 * @param {object} { S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY }
 * @return {promise} the singleton instance
 * @docs https://www.npmjs.com/package/@aws-sdk/client-s3
 */
const data = await (await S3Storage()).send(command);
```

#### JsonApi Client
/**
 * JsonApiClient
 * @function JsonApiClient
 * @modules []
 * @envs []
 * @param {string} url     // see: https://jsonapi.org
 * @param {object} filters // see: https://jsonapi.org/format/#query-parameters-families
 * @param {array} includes // see: https://jsonapi.org/format/#fetching-includes
 * @return {object} the data
 */
const data = await JsonApiClient("[host]/jsonapi/node/article", { title: "my title" }, ["field_image"]);
 