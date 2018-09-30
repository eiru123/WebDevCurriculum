const express = require('express');
const graphqlHTTP = require('express-graphql');
// const { buildSchema } = require('graphql');

// const schema = buildSchema(`
//     type Query {
//         ip: String
//     }
// `);

// function loggingMiddleware(req, res, next) {
//     console.log('ip: ', req.ip);
//     next();
// }

// const root = {
//     ip: function(args, req) {
//         return req.ip;
//     }
// }

// const app = express();
// app.use(loggingMiddleware);
// app.use('/graphql', graphqlHTTP( {
//     schema: schema,
//     rootValue: root,
//     graphiql: true
// }));
// app.listen(4000);
var graphql = require('graphql');

// Maps id to User object
var fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

// Define the User type
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});

// Define the Query type
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function (_, {id}) {
        return fakeDatabase[id];
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);