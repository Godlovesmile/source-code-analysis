/*
 * 从 ast 生成渲染函数
 */

export default function generate(ast) {
	// 函数函数字符串形式
	const renderStr = genElement(ast);
	console.log('=== renderStr ===');
	console.log(renderStr);
	return new Function(`with(this) { return ${renderStr} }`);
}

function genElement(ast) {
	const { tag, rawAttr, attr } = ast;
	// 生成属性 Map 对象, 静态属性 + 动态属性
	const attrs = { ...rawAttr, ...attr };
	// 处理子节点, 得到一个所有子节点渲染函数组成的数组
	const children = genChildren(ast);

	if (tag === 'slot') {
		// 生成插槽的处理函数
		return `_t(${JSON.stringify(attrs)}, [${children}])`;
	}

	// 生成 VNode 的可执行方法
	return `_c('${tag}', ${JSON.stringify(attrs)}, [${children}])`;
}

function genChildren(ast) {
	const ret = [],
		{ children } = ast;

	for (let i = 0, len = children.length; i < len; i++) {
		const child = children[i];
		if (child.type == 3) {
			// 文本节点
			ret.push(`_v(${JSON.stringify(child)})`);
		} else if (child.type == 1) {
			// 元素节点
			ret.push(genElement(child));
		}
	}
	return ret;
}
