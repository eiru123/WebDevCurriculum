const axios = require('axios');

const resolvers = {
    Query: {
        test_query: (parent, args) => {
            console.log('call!');
            return {
                test_field_1: 'hello',
                test_field_2: 12,
                test_field_3: true
            };
        }
    }
};

module.exports = resolvers;