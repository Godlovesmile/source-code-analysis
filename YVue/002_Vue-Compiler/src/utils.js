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

/*
 * 是否闭合标签
 */
export function isUnaryTag(tagName) {
	const unaryTag = ['input', 'img'];
	return unaryTag.includes(tagName);
}

/*
 * 是否平台保留节点
 */
export function isReserveTag(tagName) {
	const reserveTag = [
		'div',
		'h3',
		'span',
		'input',
		'select',
		'option',
		'p',
		'button',
		'template',
		'img',
		'label'
	];
	return reserveTag.includes(tagName);
}
