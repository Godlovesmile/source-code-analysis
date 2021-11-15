<template>
	<button class="y-el-button" @click="handleClick">button-test</button>
</template>

<script>
export default {
	name: 'YElButton',

	methods: {
		handleClick(evt) {
			console.log(evt);
		},
	},
};
</script>

<style></style>
