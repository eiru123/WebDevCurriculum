<template>
    <div class="note">
        <menubar></menubar>
        <tab-menu></tab-menu>
        <content-view></content-view>
    </div>
</template>

<script>
    import Menubar from './note-view/Menubar.vue';
    import TabMenu from './note-view/TabMenu.vue';
    import ContentView from './note-view/ContentView.vue';
    
    export default {
        components: {
            Menubar,
            TabMenu,
            ContentView,
        },
        created() {
            console.log('notepad created');
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