import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { parse, validate, execute } from 'graphql';
import { createSchema } from './schema.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const schema = createSchema(prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const document = parse(query);
      const errors = validate(schema, document, [depthLimit(5)]);
      if (errors.length > 0) {
        return { errors };
      }
      const result = await execute({
        schema,
        document,
        variableValues: variables,
        contextValue: {
          prisma: fastify.prisma,
        },
      });

      return result;
    },
  });
};

export default plugin;
