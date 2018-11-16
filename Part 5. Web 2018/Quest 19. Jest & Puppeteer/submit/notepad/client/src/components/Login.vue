<template>
    <div>
        <label for="username">username</label>
        <input id="username" type="text" v-model="username" autocomplete="off">
        <label for="password">password</label>
        <input id="password" type="password" v-model="password">
        <input type="submit" @click.prevent="login(username, password)" value="로그인">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            login(username, password) {
                this.$store.dispatch('login', {username, password}).then(data => {
                    console.log(data);
                    this.$router.push(data)
                })
                .catch((err => console.error(err)));
            }
        }
    }
</script>

<style scoped>
div {
    margin: 10px;
}
</style>