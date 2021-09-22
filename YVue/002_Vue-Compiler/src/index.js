import initData from './initData.js';
import mount from './compiler/index.js';
import renderHelper from './compiler/renderHelper.js';
import patch from './compiler/patch.js';
export default function Vue(options) {
	this._init(options);
}

Vue.prototype._init = function (options) {
	// 将 options 配置挂在到 Vue 实例上
	this.$options = options;
	/*
        1. 初始化 options.data;
        2. 代理 data 对象上的各个属性到 Vue 实例
        3. 给 data 对象上的各个属性设置响应能力 
    */
	initData(this);
	renderHelper(this);
	// 将 patch 方法挂在到 Vue 实例上
	this.__patch__ = patch;

	if (this.$options.el) {
		this.$mount();
	}
};

Vue.prototype.$mount = function () {
	mount(this);
};
