/*
    1. 初始化 options.data;
    2. 代理 data 对象上的各个属性到 Vue 实例
    3. 给 data 对象上的各个属性设置响应能力 
*/
import { proxy } from './utils.js';
import observe from './observe.js';

export default function initData(vm) {
	const { data } = vm.$options;
	// 1. 初始化 options.data;
	if (!data) {
		vm._data = {};
	} else {
		vm._data = typeof data === 'function' ? data() : data;
	}

	// 2. 代理 data 对象上的各个属性到 Vue 实例, 支持通过 this.xx 方式访问
	for (const key in vm._data) {
		proxy(vm, '_data', key);
	}

	// 3. 设置响应
	observe(vm._data);
}
