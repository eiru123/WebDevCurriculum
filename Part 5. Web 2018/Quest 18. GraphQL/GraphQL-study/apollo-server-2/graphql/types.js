const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        test_query: Test
    }

    type Test {
        test_field_1: String
        test_field_2: Int
        test_field_3: Boolean
    }
`;

module.exports = typeDefs;