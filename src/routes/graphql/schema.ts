import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import { MemberType, MemberTypeIdEnum } from './types/member.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { getUserType } from './types/user.js';

//inputs
import { CreateUserInput } from './types/inputs/createUser.js';
import { createProfileInput } from './types/inputs/createProfile.js';
import { createPostInput } from './types/inputs/createPost.js';
import { ChangeUserInput } from './types/inputs/changeUserInput.js';
import { changeProfileInput } from './types/inputs/changeProfile.js';
import { changePostInput } from './types/inputs/changePost.js';

const UserType = getUserType();

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async (_source, _args, context) => {
          return context.prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: async (_source, args, context) => {
          return context.prisma.memberType.findUnique({ where: { id: args.id } });
        },
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async (_source, _args, context) => {
          return context.prisma.user.findMany();
        },
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, args, context) => {
          return context.prisma.user.findUnique({ where: { id: args.id } });
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
        resolve: async (_source, _args, context) => {
          return context.prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, args, context) => {
          return context.prisma.post.findUnique({ where: { id: args.id } });
        },
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
        resolve: async (_source, _args, context) => {
          return context.prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, args, context) => {
          return context.prisma.profile.findUnique({ where: { id: args.id } });
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      createUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },
        resolve: async (_source, args, context) => {
          const { name, balance } = args.dto;
          return context.prisma.user.create({
            data: { balance, name },
          });
        },
      },
      createProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
          dto: { type: new GraphQLNonNull(createProfileInput) },
        },
        resolve: async (_source, args, context) => {
          const { isMale, yearOfBirth, userId, memberTypeId } = args.dto;
          return context.prisma.profile.create({
            data: { isMale, yearOfBirth, userId, memberTypeId },
          });
        },
      },
      createPost: {
        type: new GraphQLNonNull(PostType),
        args: {
          dto: { type: new GraphQLNonNull(createPostInput) },
        },
        resolve: async (_source, args, context) => {
          const { title, content, authorId } = args.dto;
          return context.prisma.post.create({
            data: { title, content, authorId },
          });
        },
      },
      changeUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id, dto }, context) => {
          return context.prisma.user.update({
            where: { id },
            data: dto,
          });
        },
      },
      changeProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
          dto: { type: new GraphQLNonNull(changeProfileInput) },
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id, dto }, context) => {
          return context.prisma.profile.update({
            where: { id },
            data: dto,
          });
        },
      },
      changePost: {
        type: new GraphQLNonNull(PostType),
        args: {
          dto: { type: new GraphQLNonNull(changePostInput) },
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id, dto }, context) => {
          return context.prisma.post.update({
            where: { id },
            data: dto,
          });
        },
      },
      deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }, context) => {
          const user = await context.prisma.user.findUnique({ where: { id } });
          if (!user) {
            throw new Error('User not found');
          }

          await context.prisma.user.delete({ where: { id } });
          return `User ${id} deleted successfully`;
        },
      },

      deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }, context) => {
          const post = await context.prisma.post.findUnique({ where: { id } });
          if (!post) {
            throw new Error('Post not found');
          }

          await context.prisma.post.delete({ where: { id } });
          return `Post ${id} deleted successfully`;
        },
      },

      deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }, context) => {
          const profile = await context.prisma.profile.findUnique({ where: { id } });
          if (!profile) {
            throw new Error('Profile not found');
          }

          await context.prisma.profile.delete({ where: { id } });
          return `Profile ${id} deleted successfully`;
        },
      },
      subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { userId, authorId }, context) => {
          if (userId === authorId) {
            throw new Error('Cannot subscribe to yourself');
          }

          const existing = await context.prisma.subscription.findUnique({
            where: {
              userId_authorId: { userId, authorId },
            },
          });

          if (existing) {
            return `Already subscribed to ${authorId}`;
          }

          await context.prisma.subscription.create({
            data: {
              userId,
              authorId,
            },
          });

          return `Subscribed to ${authorId}`;
        },
      },
      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { userId, authorId }, context) => {
          const subscription = await context.prisma.subscription.findUnique({
            where: {
              userId_authorId: { userId, authorId },
            },
          });

          if (!subscription) {
            return `Not subscribed to ${authorId}`;
          }

          await context.prisma.subscription.delete({
            where: {
              userId_authorId: { userId, authorId },
            },
          });

          return `Unsubscribed from ${authorId}`;
        },
      },
    },
  }),
});
