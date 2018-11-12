// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { ApolloLink} from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import store from '../store';
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
		
		return {
			headers: {
				...headers,
				Authorization: token ? `Bearer ${token}` : 'Bearer'
			}
		};
	}),
	errorLink = onError(({ graphQLErrors, response}) => {
		if (graphQLErrors) {
			for (let err of graphQLErrors) {
				if (err.extensions.code === 'UNAUTHENTICATED') {
					alert('토큰이 만료되었습니다.');
					store.commit('logout');
					window.location = '/login';
				}
			}
		}
	}),
	link = ApolloLink.from([
		authLink,
		errorLink,
		httpLink,
	]),
	apolloClient = new ApolloClient({
		link,
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