import { ApolloServer } from 'apollo-server-micro';
import { getValidSessionByToken } from '../../util/database';
import { createUserWithHash } from '../../util/resolverFunctions';
import { typeDefs } from '../../util/typeDefs';

const resolvers = {
  Mutation: {
    async createUser(parent, args, context) {
      if ('session' in context) {
        return { error: 'Already logged in' };
      }
      const [error, serializedCookie, user] = await createUserWithHash(
        args.username,
        args.email,
        args.password,
      );
      if (error) {
        return { error };
      }
      context.res.setHeader('Set-Cookie', serializedCookie);
      return user;
    },
  },
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    // get the token from the headers
    const token = (await req.cookies.sessionToken) || '';
    // if there is no token, error
    if (!token) {
      const error = 'Please log in';
      return { error, res };
    }
    // use the token to get the user's id. if there is none, error
    const session = await getValidSessionByToken(token);
    if (!session) {
      const error = 'Please log in';
      return { error, res };
    }
    // if the token finds a user, return the session
    return { session };
  },
});

const startServer = apolloServer.start();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD',
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}
