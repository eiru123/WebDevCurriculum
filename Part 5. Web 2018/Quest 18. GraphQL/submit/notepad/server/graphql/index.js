const express = require('express');
const app = express();
const {ApolloServer} = require('apollo-server-express');

const typeDefs = require('./types');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    playground: {
        endpoint: `http://localhost:4000/graphql`,
        settings: {
            'editor.theme': 'light'
        }
    }
});
console.log(server.graphqlPath);
server.applyMiddleware({
    app: app
});
app.listen(4000, () => {
    console.log('server is running port 4000');
});
// module.exports = server;