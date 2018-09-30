const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        userId: String!
        focusedTab: String
        cursorPos: Int
        existFiles: [String]
        openTabs: [String]
    }

    type File {
        content: String
    }

    input Info{
        userId: String!
        filename: String!
    }

    type LoginInfo {
        accessToken: String
        redirectPath: String!   
    }

    type Query {
        getUser(userId: String!): User
        getFile(userId: String!, filename: String!): File
    }

    type Mutation {
        login(userId: String!, password: String!): LoginInfo
        newFile(info: Info!): Boolean
        updateFile(info: Info!, content: String): Boolean
        deleteFile(info: Info!): Boolean
    }
`;

module.exports = typeDefs;