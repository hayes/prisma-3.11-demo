import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { printSchema } from 'graphql';
import { builder } from '../builder';

// import './example/simple-types';

// builder.prismaObject('User', {
//   findUnique: ({ id }) => ({ id }),
//   fields: (t) => ({
//     firstName: t.exposeString('firstName'),
//   }),
// });

// builder.prismaObject('Post', {
//   findUnique: ({ id }) => ({ id }),
//   fields: (t) => ({
//     title: t.exposeString('title'),
//     content: t.exposeString('content'),
//   }),
// });

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string({}),
      },
      resolve: (source, args) => `Hello, ${args.name ?? 'World!'}`,
    }),
  }),
});

export const schema = builder.toSchema({});

writeFileSync(resolve(__dirname, '../schema.graphql'), printSchema(schema));
