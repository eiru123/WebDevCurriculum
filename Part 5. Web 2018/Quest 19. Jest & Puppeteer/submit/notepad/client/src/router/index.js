import Vue from 'vue';
import VueRouter from 'vue-router';
import Note from '../components/Note.vue';
import Login from '../components/Login.vue';
import store from '../store';

Vue.use(VueRouter);

const checkAuth = () => (to, from, next) => {
    const name = to.name;
    
    if (store.getters.isAuthenticated) {
        return name === 'login'? next('/') : next();
    }
    return name === 'login'? next() : next('/login');
}

const router =  new VueRouter({
    mode: 'history',
    beforeEach: checkAuth(),
    routes: [
        {
            path: '/',
            name: 'notepad',
            component: Note,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        }
    ]
})
router.beforeEach(checkAuth());
export default router;