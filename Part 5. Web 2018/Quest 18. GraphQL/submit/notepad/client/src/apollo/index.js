// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
// const apolloClient = new ApolloClient({
//     uri: "http://localhost:3000/graphql",
//     request: async(operation) => {
//         const {accessToken} = localStorage;
//         operation.setContext({
//             headers: {
//                 Authorization: accessToken ? `Bearer ${accessToken}` : ''
//             }
//         })
//     }
// });
const
	httpLink = new HttpLink({
		uri: "http://localhost:3000/graphql"
	}),
	authLink = setContext((_, { headers }) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			return {
				headers: {
					...headers,
					Authorization: token ? `Bearer ${token}` : ''
				}
			};
		} else {
			return headers;
		}
	}),
	apolloClient = new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
		connectToDevTools: true,
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'no-cache'
			},
			query: {
				fetchPolicy: 'no-cache'
			}
		}
	});
export default apolloClient;