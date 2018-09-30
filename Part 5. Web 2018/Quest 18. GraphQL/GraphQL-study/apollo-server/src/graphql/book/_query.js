const Query = `
    extend type Query {
        books: [Book]
    }
`

export const queryTypes = () => [Query];

export const queryResolvers = {
    Query: {
        book: () => ([
            {
                title: "Harry Potter and the Sorcerer's stone",
                author: 'J.K Rowling',
            },
            {
                title: 'Jurassic Park',
                author: 'Michael Crichton',
            },
        ])
    }
}