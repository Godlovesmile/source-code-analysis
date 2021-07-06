/*
 * 递归编译节点树
 */
import compileTextNode from './compileTextNode.js';

export default function compileNode(nodes, vm) {
	for (var i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (node.nodeType === 1) {
			// 元素节点
		} else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
			// 编译文本节点
			compileTextNode(node, vm);
		}
	}
}
