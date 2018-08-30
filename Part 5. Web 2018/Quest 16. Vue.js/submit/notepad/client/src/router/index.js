import Vue from 'vue';
import VueRouter from 'vue-router';
import Note from '../components/Note.vue';
import Login from '../components/Login.vue';
import store from '../store';

Vue.use(VueRouter);

function checkAuth(to, from, next) {
    if (store.getters.isAuthenticated) return next();
    next('/login');
}

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'notepad',
            component: Note,
            // beforeEnter: checkAuth()
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})