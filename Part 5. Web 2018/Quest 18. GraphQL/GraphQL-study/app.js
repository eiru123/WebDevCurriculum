const express = require('express');
const graphqlHTTP = require('express-graphql');
const Graphql = require('graphql');
const fakeDatabase = require('./fakedata.js');
const app = express();

const geoType = new Graphql.GraphQLObjectType({
    name: 'geo',
    fields: {
        lat: {type: Graphql.GraphQLFloat},
        lng: {type: Graphql.GraphQLFloat}
    }
});

const companyType = new Graphql.GraphQLObjectType({
    name: "company",
    fields: {
      name: { type: Graphql.GraphQLString },
      catchPhrase: { type: Graphql.GraphQLString },
      bs: { type: Graphql.GraphQLString }
    }
});
const addressType = new Graphql.GraphQLObjectType({
    name: "address",
    fields: {
        street: { type: Graphql.GraphQLString },
        suite: { type: Graphql.GraphQLString },
        city: { type: Graphql.GraphQLString },
        zipcode: { type: Graphql.GraphQLString },
        geo: { type: geoType } // Object 형태일 경우 새로 GrapgQLObject를 만들어서 지정해 줍니다.
    }
});
const userType = new Graphql.GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: Graphql.GraphQLInt },
        name: { type: Graphql.GraphQLString },
        username: { type: Graphql.GraphQLString },
        email: { type: Graphql.GraphQLString },
        address: { type: addressType }, // Object 형태일 경우 새로 GrapgQLObject를 만들어서 지정해 줍니다.
        phone: { type: Graphql.GraphQLString },
        website: { type: Graphql.GraphQLString },
        company: { type: companyType } // Object 형태일 경우 새로 GrapgQLObject를 만들어서 지정해 줍니다.
    }
});
const queryType = new Graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: userType,
            args: {
                id: { type: Graphql.GraphQLInt }
            },
            resolve: function(a,{ id },b,c) {
                const data = Object.keys(fakeDatabase).filter(element => {
                    if(fakeDatabase[element].id === id) {
                        return element;
                    }
                });
                return fakeDatabase[data];
            }
        },
        allUser: {
            type: new Graphql.GraphQLList(userType),
            resolve: function(a,b,c,d) {
                return fakeDatabase;
            }
        }
    }
});
const schema = new Graphql.GraphQLSchema({ query: queryType});
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(4000, ()=> {
    console.log('running server port num 4000');
});
