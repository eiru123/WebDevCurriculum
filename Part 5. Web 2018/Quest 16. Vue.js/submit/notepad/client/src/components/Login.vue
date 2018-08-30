<template>
    <div>
        <label for="username">username</label>
        <input id="username" type="text" v-model="username" autocomplete="off">
        <label for="password">password</label>
        <input id="password" type="password" v-model="password">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        }
    }
</script>

<style scoped>

</style>