import Watcher from '../watcher.js';
import Vue from '../index.js';

export default function mountComponent(vm) {
	// 负责初始化渲染和后续更新组件的一个方法
	const updateComponent = () => {
		console.log('=== vm ===');
		console.log(vm);
		vm._update(vm._render());
	};
	// 实例化渲染 Watcher
	new Watcher(updateComponent);
}

// 负责执行 vm.$options.render 函数
Vue.prototype._render = function () {
	return this.$options.render.apply(this);
};

Vue.prototype._update = function (vnode) {
	console.log(vnode);
	// 获取旧的 vnode 节点
	const preVNode = this._vnode;
	// 设置新的 vnode
	this._vnode = vnode;

	if (!preVNode) {
		// 旧的 vnode 不存在, 说明是首次渲染
		this.$el = this.__patch__(this.$el, vnode);
	} else {
		// 旧的 vnoode 存在, 说明是后续更新
		this.$el = this.__patch__(preVNode, vnode);
	}
};
