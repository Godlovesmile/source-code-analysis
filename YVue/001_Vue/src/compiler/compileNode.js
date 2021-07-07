/*
 * 递归编译节点树
 */
import compileTextNode from './compileTextNode.js';
import compileAttribute from './compileAttribute.js';

export default function compileNode(nodes, vm) {
	for (var i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (node.nodeType === 1) {
			// 元素节点
			// 1. 编译元素上的属性节点
			compileAttribute(node, vm);
			// 2. 递归编译子节点
			compileNode(Array.from(node.childNodes), vm);
		} else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
			// 编译文本节点
			compileTextNode(node, vm);
		}
	}
}
