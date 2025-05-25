import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: { type: new GraphQLNonNull(MemberType) },
  }),
});
