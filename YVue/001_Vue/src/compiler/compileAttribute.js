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
			compileVModel(node, value, vm);
		}
	}
}

function compileVOnClick(node, value, vm) {
	node.addEventListener('click', function (...args) {
		vm.$options.methods[value].apply(vm, args);
	});
}

function compileVBind(node, value, vm) {
	const attrName = RegExp.$1;
	node.removeAttribute(`v-bind:${attrName}`);

	function cb() {
		node.setAttribute(attrName, vm[value]);
	}

	new Watcher(cb);
}

function compileVModel(node, value, vm) {
	console.log('=== v-model ===');
	console.log(node);
	console.log(value);
	console.log(vm);
	// 节点标签名, 类型
	let { tagName, type } = node;
	tagName = tagName.toLowerCase();
	console.log(tagName, type);

	if (tagName === 'input' && type === 'text') {
		// <input type="text" v-model="inputVal" />
		node.value = vm[value];
		node.addEventListener('input', function () {
			vm[value] = node.value;
		});
	} else if (tagName === 'input' && type === 'checkbox') {
		// <input type="checkbox" v-model="isChecked" />
		node.checked = vm[value];
		node.addEventListener('change', function () {
			vm[value] = node.checked;
		});
	} else if (tagName === 'select') {
		node.value = vm[value];
		node.addEventListener('change', function () {
			vm[value] = node.value;
		});
	}
}
