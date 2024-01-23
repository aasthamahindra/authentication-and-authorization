const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./schema');
const { verifyToken } = require('./default');

const app = express();

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
          if (req.headers && req.headers.authorization) {
            const auth = req.headers.authorization;
            const split = auth.split(" ");
            const bearer = split[0];
            const token = split[1];
            if (bearer == "Bearer") {
                const user = verifyToken(token);
                if (user.error) {
                    return { error: user.error, message: user.msg }
                } else {
                    return { user }
                }
            } else {
                return { error: 'Authentication must use Bearer.' }
            }
          } else {
            return { error: 'User must be authenticated.' }
          }
        },
        playground: true,
    });
    
    await server.start();

    // applyMiddleware() apply to be a middleware in Express to setup route
    server.applyMiddleware({ app });
    
    const httpServer = createServer(app);
    httpServer.listen(5000, '0.0.0.0', () => {
        try {
            console.log('Server started at port 5000');
        } catch (error) {
            console.error(`Failed to start server: ${error}`);
        }
    });
}

startServer();