import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApollo from 'vue-apollo';
import apolloClient from './apollo'
// import babelPolyfill from 'babel-polyfill'

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});
new Vue({
  el: '#app',
  router,
  store,
  apolloProvider,
  render: h => h(App)
})
