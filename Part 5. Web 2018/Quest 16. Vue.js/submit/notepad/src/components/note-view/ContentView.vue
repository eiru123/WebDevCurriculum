<template>
    <div class="content-view">
        <textarea class="write-space" v-model="content"></textarea>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                content: '',
                host: 'http://localhost:8080'
            }
        },
        watch: {
            content: function(){
                console.log(this.content);
            }
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
</style>