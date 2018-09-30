<template>
    <div id="app">
        <router-view></router-view>
  	</div>
</template>

<script>
import Note from './components/Note.vue';

export default {
	components: {
		Note
	}
}
</script>

<style>
* {
	margin: 0; padding: 0;
	font-size: 15px;
	box-sizing: border-box;
}
html {
	width: 100%; height: 100%;
}
body {
	width: 100%; height: 100%;
}
#app {
	width:100%; height: 100%;
}
ul {
	list-style: none;
}
</style>
