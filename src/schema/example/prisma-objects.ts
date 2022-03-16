import { builder } from '../../builder';
import { db } from '../../db';

builder.prismaObject('User', {
  findUnique: ({ id }) => ({ id }),
  select: {
    id: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    fullName: t.string({
      select: {
        firstName: true,
        lastName: true,
      },
      resolve: (user) => `${user.firstName} ${user.lastName}`,
    }),
    email: t.string({
      select: {
        profile: true,
      },
      nullable: true,
      resolve: (user) => user.profile.email,
    }),
    bio: t.string({
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      resolve: (user) => user.profile.bio,
    }),
    posts: t.relation('posts', {
      args: {
        oldestFirst: t.arg.boolean(),
      },
      query: (args) => ({
        orderBy: {
          createdAt: args.oldestFirst ? 'asc' : 'desc',
        },
      }),
    }),
  }),
});

builder.prismaObject('Post', {
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    author: t.relation('author'),
  }),
});

builder.queryFields((t) => ({
  viewer: t.prismaField({
    type: 'User',
    resolve: (query) =>
      db.user.findUnique({
        ...query,
        where: { id: 2 },
        rejectOnNotFound: true,
      }),
  }),
  recentPosts: t.prismaField({
    type: ['Post'],
    resolve: (query) =>
      db.post.findMany({
        ...query,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
  }),
}));
