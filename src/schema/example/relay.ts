import { builder } from '../../builder';
import { db } from '../../db';

builder.prismaNode('User', {
  findUnique: (id) => ({ id: Number.parseInt(id, 10) }),
  id: { resolve: (user) => user.id },
  fields: (t) => ({
    firstName: t.exposeString('firstName'),
    fullName: t.string({
      resolve: (user) => `${user.firstName} ${user.lastName}`,
    }),
    posts: t.relatedConnection('posts', {
      cursor: 'id',
    }),
  }),
});

builder.prismaNode('Post', {
  findUnique: (id) => ({ id: Number.parseInt(id, 10) }),
  id: { resolve: (post) => post.id },
  fields: (t) => ({
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    author: t.relation('author'),
    comments: t.relatedConnection('comments', {
      totalCount: true,
      query: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      cursor: 'id',
    }),
  }),
});

builder.prismaNode('Comment', {
  findUnique: (id) => ({ id: Number.parseInt(id, 10) }),
  id: { resolve: (comment) => comment.id },
  fields: (t) => ({
    comment: t.exposeString('comment'),
    author: t.relation('author'),
    post: t.relation('post'),
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
  posts: t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query) =>
      db.post.findMany({
        orderBy: { createdAt: 'desc' },
        ...query,
      }),
  }),
}));
