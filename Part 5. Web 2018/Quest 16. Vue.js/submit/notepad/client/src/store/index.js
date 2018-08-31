import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const apiHost = 'http://localhost:3000';

export default new Vuex.Store({
    state: {
        accessToken: null,
        content: '',
        existTabs: [],
        focusedTab: ''
    },
    getters: {
        isAuthenticated (state) {
            state.accessToken = state.accessToken || localStorage.accessToken;
            return state.accessToken;
        }
    }
})