<template>
    <div class="menubar">
        <button v-for="(value, key) in buttons" :key="key" @click="buttonEvent(key)"> {{ value }}</button>
        <div v-if="showMenu" class="files">
            <ul>
                <li v-for="(file, index) in getExistFiles" :key="index" class="open-file" @click="openFile(file)">{{ file }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
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
            }
        },
        created() {
            this.$store.dispatch('exist');
        },
        computed: {
            ...mapGetters([
                'getExistFiles'
            ])
        },
        methods: {
            buttonEvent(name) {
                switch(name){
                    case 'newFile': this.newFile(); break;
                    case 'open': this.open(); break;
                    case 'save': this.save(); break;
                    case 'delete': this.delete(); break;
                    case 'logout': this.logout(); break;
                }
            },
            newFile(){
                const filename = prompt('파일명을 입력해주세요.');
                if(filename === '') return alert('파일명을 입력하셔야합니다');
                this.$store.dispatch('newFile', filename)
                .catch(err => console.error(err));
            },
            open(){
                this.showMenu = !this.showMenu;
            },
            openFile(file){
                this.open();
                this.$store.dispatch('openFile', file);
            },
            save(){
                this.$store.dispatch('save');
            },
            delete(name){
                this.$store.dispatch('delete');
            },
            logout(name){
                if(!confirm('로그아웃 하시겠습니까?')) return false;this.$store.dispatch('logout').then(()=>{
                    this.$router.push('login');
                });
                
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