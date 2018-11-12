// const express = require('express');
// const app = express();
const auth = require('./auth');
const {ApolloServer} = require('apollo-server-express');

const typeDefs = require('./types');
const resolvers = require('./resolvers');

async function context({req}) {
    const headers = req.headers;
    let userId = null;

    if(!headers.referer.endsWith('login'))
        userId = auth.ensureAuth(headers);
    
    return {
        headers,
        userId
    };
}
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: context,
    // playground: {
    //     endpoint: `http://localhost:4000/graphql`,
    //     settings: {
    //         'editor.theme': 'light'
    //     }
    // }
});
// console.log(server.graphqlPath);
// server.applyMiddleware({
//     app: app
// });
// app.listen(4000, () => {
//     console.log('server is running port 4000');
// });
module.exports = server;