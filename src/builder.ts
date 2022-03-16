import SchemaBuilder from '@pothos/core';
import PothosRelayPlugin from '@pothos/plugin-relay';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { db } from './db';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PothosRelayPlugin, PrismaPlugin],
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
  prisma: {
    client: db,
  },
});
