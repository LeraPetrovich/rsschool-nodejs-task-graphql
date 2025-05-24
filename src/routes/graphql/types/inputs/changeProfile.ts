import { GraphQLInputObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { MemberTypeIdEnum } from '../member.js';

export const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});
