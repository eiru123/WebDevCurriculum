import Vue from 'vue'
import App from './App.vue'
import { ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import VueApollo from 'vue-apollo';

const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`
});

const link = httpLink;
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
const middlewareLink = setCotext(() => ({
  headers: {
    authorization: `Bearer ${HOWEVER_I_GET_MY_JWT}`,
  }
}));
Vue.use(VueApollo);
new Vue({
  el: '#app',
  provide: apolloProvider.provide(),
  render: h => h(App)
})
