<template>
    <div class="tab-menu">
        <div class="tab" v-for="(tab, index) in tabs" :key="index">
            <span class="tab-name">{{ tab }}</span>
			<div class='close' @click="closeTab(index)">
				<img src="../../assets/windowclose.svg">
			</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['tabs'],
        methods: {
            closeTab(index){
                this.$emit('closeTab', index);
            }
        }
    }
</script>

<style scoped>
.tab-menu {
    display: flex;
	width: 100%; height: 100%;
	grid-area: tabs;
}
.tab {
	display: flex;
	width: 10%; height: 60px;
	text-align: center;
	background-color: #f3f3f3;
	border: 0;
	border-right: 1px solid #000000;
	border-top: 1px solid #000000;
	justify-content: center;
}
.tab-name{
	display: block;
	line-height: 60px;
    font-size: 15px;
    overflow: hidden;
}
.focus {
	background-color: #bababa;
}
.close {
	width: 16px; height: 16px;
	margin-top: 20px;
	margin-left: 3px;
}
.close:active {
	border-radius: 3px;
	background-color: #000000;
}
</style>