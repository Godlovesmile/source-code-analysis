import YElButton from './src/button.vue';

YElButton.install = function (Vue) {
	Vue.component(YElButton.name, YElButton);
};

export default YElButton;
