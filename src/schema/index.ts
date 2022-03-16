import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { printSchema } from 'graphql';
import { builder } from '../builder';

// import './example/prisma-objects';
// import './example/simple-types';
// import './example/relay';

// builder.prismaObject('User', {
//   findUnique: ({ id }) => ({ id }),
//   fields: (t) => ({
//     id: t.exposeID('id'),
//     title: t.exposeString('firstName'),
//   }),
// });

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (source, args) => `Hello, ${args.name ?? 'World!'}`,
    }),
  }),
});

export const schema = builder.toSchema({});

writeFileSync(resolve(__dirname, '../schema.graphql'), printSchema(schema));
