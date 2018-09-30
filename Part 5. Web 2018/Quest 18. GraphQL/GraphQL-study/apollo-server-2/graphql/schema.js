const express = require('express');
const app = express();
const {ApolloServer} = require('apollo-server-express');

const typeDefs = require('./types.js');
const resolvers = require('./resolvers.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: `http://localhost:4000/graphql`,
        settings: {
            'editor.theme': 'light'
        }
    }
});

server.applyMiddleware({
    app: app
});

app.listen(4000);
// module.exports = server;