/*
 * v-on:click; v-bind, v-model 处理逻辑
 */
import Watcher from '../watcher.js';

export default function compileAttribute(node, vm) {
	const attrs = Array.from(node.attributes);
	for (const attr of attrs) {
		// 属性名称, 属性值
		const { name, value } = attr;
		if (name.match(/v-on:click/)) {
			compileVOnClick(node, value, vm);
		} else if (name.match(/v-bind:(.*)/)) {
			compileVBind(node, value, vm);
		} else if (name.match(/v-model/)) {
		}
	}
}

function compileVOnClick(node, value, vm) {
	node.addEventListener('click', function (...args) {
		vm.$options.methods[value].apply(vm, args);
	});
}

function compileVBind(node, value, vm) {
	console.log('=== v-bind ===');
	console.log(node);
	console.log(value);
	console.log(vm);

	const attrName = RegExp.$1;
	node.removeAttribute(`v-bind:${attrName}`);

	function cb() {
		node.setAttribute(attrName, vm[value]);
	}

	new Watcher(cb);
}
