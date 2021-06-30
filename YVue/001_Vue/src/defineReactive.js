import observe from './observe.js';

export default function defineReactive(obj, key, val) {
    // observe
    console.log('=== defineReactive ===', obj, key, val);
    observe(val);

	Object.defineProperty(obj, key, {
		get() {
			console.log(`getter: key = ${key}`);
			return val;
		},
		set(newVal) {
            console.log(`setter: key = ${key}`);
			if (newVal === val) return;
			val = newVal;
			// 对新值进行响应式处理
			observe(val);
		},
	});
}
