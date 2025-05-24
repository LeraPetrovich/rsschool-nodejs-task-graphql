import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';

import { MemberType, MemberTypeIdEnum } from './types/member.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { getUserType } from './types/user.js';

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
    fields: {},
  }),
});
