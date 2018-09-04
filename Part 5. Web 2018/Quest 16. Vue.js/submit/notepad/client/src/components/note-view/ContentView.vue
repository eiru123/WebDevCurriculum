<template>
    <div class="content-view">
        <textarea class="write-space" v-model="content" :readonly="getReadonly"></textarea>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            content: {
                get () {
                    return this.$store.getters.getContent;
                },
                set (content) {
                    this.$store.commit('setContent', content);
                }
            },
            ...mapGetters([
                'getReadonly'
            ])
        }
    }
</script>

<style scoped>
.content-view{
    grid-area: content;
}
.write-space {
	width: 100%; height: 100%;
	outline: none;
	font-size: 16px;
	resize: none;
}
.write-space:focus {
	cursor: default;
}
</style>