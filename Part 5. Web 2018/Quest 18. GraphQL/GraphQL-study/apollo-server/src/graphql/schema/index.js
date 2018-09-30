import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

const Query = `
    type Query{
        status: String
    }
`;

const Mutation = `
    type Mutation {
        _empty: String
    }
`;

let resolvers = {
    Query: {
        status: () => 'ok'
    }
};

const typeDefs = [Query, Mutation];

fs.readdirSync(__dirname)
    .filter(dir => (dir.indexOf('.') < 0))
    .forEach((dir) => {
        console.log(dir);
        console.log(require(path.join(__dirname, dir)).default)
        const tmp = require(path.join(__dirname, dir)).default;
        resolvers = merge(resolvers, tmp.resolvers);
        console.log(resolvers);
        typeDefs.push(tmp.types);
});

export default makeExecutableSchema({
    typeDefs,
    resolvers
});