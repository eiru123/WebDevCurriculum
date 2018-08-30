<template>
    <div class="note">
        <menubar :focusedTab="focusedTab" @openFile="openFile" @save="save"></menubar>
        <tab-menu :tabs="tabs" :focusedTab="focusedTab" @closeTab="closeTab"></tab-menu>
        <content-view :focusedTab="focusedTab"></content-view>
    </div>
</template>

<script>
    import Menubar from './note-view/Menubar.vue';
    import TabMenu from './note-view/TabMenu.vue';
    import ContentView from './note-view/ContentView.vue';
    
    export default {
        data() {
            return {
                tabs: [],
                focusedTab: '',
                save: false
            }
        },
        components: {
            Menubar,
            TabMenu,
            ContentView,
        },
        created() {
            console.log('notepad created');
        },
        methods: {
            openFile(file){
                console.log(file);
                this.tabs.push(file);
                console.log(this.tabs);
            },
            closeTab(index){
                this.tabs.splice(index, 1);
            },
            save(save){
                this.save = save;
            }
        }
    }
</script>

<style scoped>
.note{
    display: grid;
	width: 100%; height: 100%;
	grid-template-columns: 80px 1fr;
	grid-template-rows: 60px 1fr;
	grid-template-areas: 
		"menubar tabs"
		"menubar content";
}
</style>