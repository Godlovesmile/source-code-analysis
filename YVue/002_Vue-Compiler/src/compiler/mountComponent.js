import Watcher from '../watcher.js';
import Vue from '../index.js';

export default function mountComponent(vm) {
	// 负责初始化渲染和后续更新组件的一个方法
	const updateComponent = (vm) => {
		vm._update(vm._render());
	};
	// 实例化渲染 Watcher
	new Watcher(updateComponent);
}

// 负责执行 vm.$options.render 函数
Vue.prototype._render = function () {
	return this.$options._render.apply(this);
};
