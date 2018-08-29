<template>
    <div class="menubar">
        <button v-for="(value, key) in buttons" :key="key" @click="buttonEvent(key)"> {{ value }}</button>
        <div v-if="showMenu" class="files">
            <ul>
                <li v-for="file in existTab" :key="file" class="open-file" @click="openFile(file)">{{ file }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                buttons: {
                    newFile: "새 파일",
                    open: "열기",
                    save: "저장",
                    delete: "삭제",
                    logout: "로그아웃"
                },
                showMenu: false,
                existTab: [],
                focusedTab: '',
                host: 'http://localhost:3000'
            }
        },
        created() {
            axios.get(`${this.host}/exist`).then(res => {
                const data = JSON.parse(res.data);
                data.fileNames.forEach(file => {
                    this.existTab.push(file);
                });
            }).catch(err => {
                console.error(err);
            });
        },
        methods: {
            buttonEvent(name) {
                switch(name){
                    case 'newFile': this.newFile(name); break;
                    case 'open': this.open(name); break;
                    case 'save': this.save(name); break;
                    case 'delete': this.delete(name); break;
                    case 'logout': this.logout(name); break;
                }
            },
            newFile(){
                const name = prompt('파일명을 입력해주세요.');
                axios.defaults.headers.post['Content-Type'] = "application/json";
                axios.post(`${this.host}/file`, {
                    name: name
                }).then(res => {
                    console.log(res.status);
                    this.$emit('openFile', name);
                }).catch(err => {
                    console.error(err);
                });
            },
            open(){
                this.showMenu = !this.showMenu;
            },
            openFile(file){
                this.open();
                console.log(file);
                this.$emit('openFile', file);
            },
            save(name){
                console.log(name);
                console.log(this.tabs);
            },
            delete(name){
                const focusedIndex = this.existTab.indexOf(this.focusedTab);
                if(focusedIndex !== -1)
                    this.existTab.splice(focusedIndex, 1);
            },
            logout(name){
                console.log(name);
            }
        }
    }
</script>

<style scoped>
.menubar{
    grid-area: menubar;
}
button {
	display: block;
	width: 80px; height: 80px;
}
.files{
	position: absolute;
	left: 80px; top: 80px;
	width: 300px; height: 200px;
	overflow: scroll;
}
.open-file {
	width:300px;
	height: 25px;
	border: 1px solid black;
	font-size: 20px;
	text-align: left;
	line-height: 25px;
}
</style>