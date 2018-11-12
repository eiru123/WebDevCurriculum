import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import swal from 'sweetalert';
import gql from 'graphql-tag';
import apolloClient from '../apollo';

Vue.use(Vuex);

const apiHost = 'http://localhost:3000';

export default new Vuex.Store({
    state: {
        accessToken: null,
        content: '',
        existFiles: [],
        openTabs: [],
        focusedTab: '',
        readonly: true
    },
    getters: {
        isAuthenticated (state) {
            state.accessToken = state.accessToken || localStorage.accessToken;
            return state.accessToken;
        },
        getExistFiles(state){
            return state.existFiles;
        },
        getOpenTabs(state){
            return state.openTabs;
        },
        getContent(state) {
            return state.content;
        },
        getReadonly(state) {
            return state.readonly;
        }
    },
    mutations: {
        login(state, {accessToken}) {
            state.accessToken = accessToken;
            localStorage.accessToken = accessToken;
        },
        logout(state) {
            state.accessToken = null;
            delete localStorage.accessToken;
        },
        addExistFile(state, filename) {
            state.existFiles.push(filename);
        },
        deleteExistFile(state, filename) {
            const index = state.existFiles.indexOf(filename);
            state.existFiles.splice(index, 1);
        },
        focusTab(state, filename){
            state.openTabs.forEach(tab => {
                tab.focus = false;
                if(tab.filename === filename){
                    tab.focus = true;
                }
            });
            if(filename) state.readonly = false;
            state.focusedTab = filename;
        },
        addOpenTabs(state, filename) {
            let repeatCheck = false;
            state.openTabs.forEach(tab => {
                if(tab.filename === filename){
                    repeatCheck = true;
                }
            });
            if(!repeatCheck){
                state.openTabs.push({
                    filename: filename, 
                    focus: true
                });
            }
            
        },
        deleteOpenTabs(state, index) {
            state.openTabs.forEach((tab, idx) => {
                if(tab.focus && !index) {
                    console.log(index);
                    index = idx;
                }
                tab.focus = false;
            });
            state.openTabs.splice(index, 1);
            state.readonly = true;
            state.focusedTab = '';
            state.content = '';
        },
        setContent(state, content) {
            state.content = content;
        }
    },
    actions: {
        async login({commit}, {username, password}) {
            const mutation = gql`mutation ($userId: String!, $password: String!){
                login (userId: $userId, password: $password){
                    accessToken
                    redirectPath
                }
            }`,
            variables = {
                userId: username,
                password: password
            },
            req = await apolloClient.mutate({ mutation, variables });
			if (req.hasOwnProperty('error')) {
				console.error(req.error);
				return;
            }
            commit('login', req.data.login);
            return req.data.login.redirectPath;
        },
        async logout(context) {
            const openTabs = [];
            context.state.openTabs.forEach(({filename}) => {
                openTabs.push(filename);
            })
            const variables = {
                openTabs: openTabs,
                focusedTab: context.state.focusedTab
            }
            const mutation = gql`mutation ($logoutInfo: LogoutInfo){
                logout(logoutInfo: $logoutInfo)
            }`;
            const req = await apolloClient.mutate({mutation, variables});
            if (req.hasOwnProperty('error')) {
				console.error(req.error);
				return;
            }
            context.commit('logout');
            return true;
        },
        async exist({dispatch, commit}) {
            const query = gql`query {
                getUser{
                    userId
                    focusedTab
                    cursorPos
                    existFiles
                    openTabs
                }
            }`,
            req = await apolloClient.query({ query });
            if (req.hasOwnProperty('error')) {
                console.error(req.error);
                return;
            }
            const data = req.data.getUser;
            data.existFiles.forEach(file => {
                commit('addExistFile', file);
            });
            data.openTabs.forEach(file => {
                commit('addOpenTabs', file);
            });
            commit('focusTab', data.focusedTab);
            dispatch('openFile', data.focusedTab);
            
        },
        async newFile(context, filename) {
            const mutation = gql`mutation ($filename: String!){
                newFile (filename: $filename)
            }`, variables = {
                filename
            }, req = await apolloClient.mutate({ mutation, variables });
            
            if (req.hasOwnProperty('error')) {
                console.error(req.error);
                return;
            }
            if(req.data.newFile){
                context.commit('focusTab', filename);
                context.commit('addExistFile', filename);
                context.commit('addOpenTabs', filename);
            }
        },
        async openFile(context, filename) {
            const query = gql`query ($filename: String!){
                getFile(filename: $filename){
                    content
                }
            }`;
            const variables = {
                filename: filename
            };
            
            const req = await apolloClient.query({ query, variables });
            if (req.hasOwnProperty('error')) {
                console.error(req.error);
                return;
            }
            context.commit('addOpenTabs', filename);
            context.dispatch('focusTab', filename);
        },
        async focusTab(context, filename) {
            let content = '';
            const query = gql`query ($filename: String!){
                getFile(filename: $filename){
                    content
                }
            }`;
            const variables = {
                filename: filename
            };
            
            const req = await apolloClient.query({ query, variables });
            if (req.hasOwnProperty('error')) {
                console.error(req.error);
                return;
            }
            if(req.data.getFile){
                content = req.data.getFile.content;
            }
            context.commit('setContent', content);
            context.commit('focusTab', filename);
        },
        async save(context) {
            const mutation = gql`mutation($filename: String!, $content: String!){
                updateFile(filename: $filename, content: $content)
            }`
            const variables = {
                filename: context.state.focusedTab,
                content: context.state.content
            }
            const req = await apolloClient.mutate({mutation, variables});
            if(req.hasOwnProperty('error')){
                console.error(req.error);
                return;
            }
        },
        async delete(context) {
            const filename = context.state.focusedTab;
            const mutation = gql`mutation ($filename: String!){
                deleteFile(filename: $filename)
            }`;
            const variables = {
                filename: filename
            };
            const req = await apolloClient.mutate({mutation, variables});

            if(req.hasOwnProperty('error')){
                console.error(req.error);
                return;
            }
            if(req.data.deleteFile){
                context.commit('deleteExistFile', filename);
                context.commit('deleteOpenTabs');
            }else{
                alert('삭제 실패');
            }
        }
    }
})