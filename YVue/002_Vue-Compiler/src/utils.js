/*
    将 key 代理到 target 上, 比如代理 this_data.xx 为 this.xx
*/
export function proxy(target, sourceKey, key) {
	Object.defineProperty(target, key, {
		get() {
			return target[sourceKey][key];
		},
		set(newVal) {
			target[sourceKey][key] = newVal;
		},
	});
}

/*
 * Define a property
 */
export function def(obj, key, val, enumerable) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enumerable,
		writable: true,
		configurable: true,
	});
}
