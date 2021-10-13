import Watcher from './watcher.js';

/*
 初始化 computed 配置项
 */
export default function initComputed(vm) {
	// 获取 computed 配置项
	const computed = vm.$options.computed;
	// 记录 watcher
	const watcher = (vm._watcher = Object.create(null));
	// 遍历 computed 对象
	for (let key in computed) {
		watcher[key] = new Watcher(computed[key], { lazy: true }, vm);
		// 将 computed 的属性 key 代理到 Vue 实例上
		defineComputed(vm, key);
	}
}

function defineComputed(vm, key) {
	// 属性描述符
	const descriptor = {
		get: function () {
			const watcher = vm._watcher[key];
			if (watcher.dirty) {
				watcher.evalute();
			}
			return watcher.value;
		},
		set: function () {},
	};
    Object.defineProperty(vm, key, descriptor);
}
