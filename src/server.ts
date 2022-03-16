import { createServer } from '@graphql-yoga/node';
import { db } from './db';
import { schema } from './schema';

const server = createServer({
  schema,
  logging: {
    prettyLog: true,
  },
});

// Print out prisma queries to demonstrate how queries are resolved
db.$use((params, next) => {
  console.log(JSON.stringify(params, null, 2));

  return next(params);
});

// db.$on('query', (e) => {
//   console.log(`Query: ${e.query}`);
//   console.log(`Duration: ${e.duration}ms`);
// });

server.start();
