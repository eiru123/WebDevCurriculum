<template>
    <div class="menubar">
        <button>새 파일</button>
        <button>열기</button>
        <button>저장</button>
        <button>삭제</button>
        <button>로그아웃</button>
    </div>
</template>

<script>
    export default {
        
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
</style>