import observe from './observe.js';
import Dep from './dep.js';

export default function defineReactive(obj, key, val) {
	const dep = new Dep();
	// observe
	const childObj = observe(val);

	Object.defineProperty(obj, key, {
		get() {
			// 读取数据时, Dep.target 不为 null, 进行依赖收集
			if (Dep.target) {
				dep.depend();
				// 存在子 childObj, 也进行依赖收集
				if (childObj) {
					childObj.dep.depend();
				}
			}
			// console.log(`getter: key = ${key}`);
			return val;
		},
		set(newVal) {
			// console.log(`setter: key = ${key}`);
			if (newVal === val) return;
			val = newVal;
			// 对新值进行响应式处理
			observe(val);
            // 数据更新, 让 dep 通知自己收集的所有 Watcher 执行 update 方法
            dep.notify();
		},
	});
}
