import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import swal from 'sweetalert';
Vue.use(Vuex);

const apiHost = 'http://localhost:3000';
function sendToken() {
    const {accessToken} = localStorage;
    if(accessToken) {
        return axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
	}
}
function addInterceptor() {
	const {accessToken} = localStorage;
	axios.interceptors.response.use(function (req) {
		return req;
	}, function (error) {
		console.dir(error);
		if (401 === error.response.status) {
			swal({
				title: "로그인 만료",
				text: "로그인 정보가 만료되었습니다. 다시 로그인 해주세요.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes",
				closeOnConfirm: false
			}).then(function(){
				delete localStorage.accessToken;
				window.location = '/login';
			});
		} else {
			return Promise.reject(error);
		}
	});
}
sendToken();
addInterceptor();
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
        login({commit}, {username, password}) {
            return axios.post(`${apiHost}/login`, {username, password})
            .then(({data}) => {
                if(data.redirectPath === '/'){
                    commit('login', data);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                }
                return data.redirectPath;
            })
            .catch(err => console.log(err));
        },
        async logout(context) {
            let tabs = [];
            context.state.openTabs.forEach(({filename}) => {
                tabs.push(filename);
            })
            let userData = {
                tabs: tabs,
                focusedTab: context.state.focusedTab
			}
            await axios.post(`${apiHost}/logout`, {
                userData: userData
            }).then(() => {
                axios.defaults.headers.common['Authorization'] = undefined;
            })
            .catch(err => console.error(err));
            context.commit('logout');
        },
        exist({dispatch, commit}) {
            axios.get(`${apiHost}/exist`).then(res => {
                const data = JSON.parse(res.data);
                const userData = data.userData;
                data.fileNames.forEach(file => {
                    commit('addExistFile', file);
                });
                userData.openTabs.forEach(tab => {
                    commit('addOpenTabs', tab);
                });
                commit('focusTab', userData.focusedTab);
                dispatch('openFile', userData.focusedTab);
            }).catch(err => {
                console.error(err);
            });
        },
        newFile(context, filename) {
            if(context.state.existFiles.includes(filename)) {
                return alert('이미 있는 이름입니다.');
            }
            axios.post(`${apiHost}/file`, {
                name: filename
            }).then(res => {
                context.commit('focusTab', filename);
                context.commit('addExistFile', filename);
                context.commit('addOpenTabs', filename);
            }).catch(err => {
                console.error(err);
            });
        },
        openFile(context, filename) {
            axios.get(`${apiHost}/file`, {
                params: {
                    filename: filename
                }
            }).then(({data}) => {
                context.commit('focusTab', filename);
                // if(filename){
                    context.commit('addOpenTabs', filename);
                    context.commit('setContent', data.content);
                // }
            }).catch(err => console.error(err));
        },
        focusTab(context, filename) {
            if(!filename) filename = context.state.focusedTab;
            axios.get(`${apiHost}/file`, {
                params: {
                    filename: filename
                }
            }).then(({data}) => {
                context.commit('focusTab', filename);
                context.commit('setContent', data.content);
            }).catch(err => console.error(err));
        },
        save(context) {
            axios.put(`${apiHost}/file`, {
                name: context.state.focusedTab,
                content: context.state.content
            })
            .catch(err => console.error(err));
        },
        delete(context) {
            const filename = context.state.focusedTab;
            axios.delete(`${apiHost}/file`, {
                params: {
                    filename: filename
                }
            }).then(() => {
                context.commit('deleteExistFile', filename);
                context.commit('deleteOpenTabs');
            }).catch(err => console.error(err));
        }
    }
})