import { User, Post } from '@prisma/client';
import { builder } from '../../builder';
import { db } from '../../db';

const UserObject = builder.objectRef<User>('User');
const PostObject = builder.objectRef<Post>('Post');

UserObject.implement({
  fields: (t) => ({
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    fullName: t.string({
      resolve: (user) => `${user.firstName} ${user.lastName}`,
    }),
  }),
});

PostObject.implement({
  fields: (t) => ({
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    author: t.field({
      type: UserObject,
      resolve: async (post) =>
        db.user.findUnique({
          where: { id: post.authorId },
          rejectOnNotFound: true,
        }),
    }),
  }),
});

builder.queryField('recentPosts', (t) =>
  t.field({
    type: [PostObject],
    resolve: () =>
      db.post.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
  }),
);
