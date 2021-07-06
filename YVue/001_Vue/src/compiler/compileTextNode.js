/*
 * 编译文本节点
 */
import Watcher from '../watcher.js';

export default function compileTextNode(node, vm) {
	const key = RegExp.$1.trim();

	function cb() {
		node.textContent = vm[key];
	}

	new Watcher(cb);
}
