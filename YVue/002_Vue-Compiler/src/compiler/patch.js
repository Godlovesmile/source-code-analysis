import Vue from '../index.js';
import { isReserveTag } from '../utils.js';

export default function patch(oldVnode, vnode) {
	if (oldVnode && !vnode) {
		// 老的 vnode 存在, 新的 vnode 不存在, 则销毁组件
		return;
	}

	if (!oldVnode) {
		// 说明是子组件首次渲染
		createElm(vnode);
	} else {
		if (oldVnode.nodeType) {
			// 说明是真实节点, 则表示首次渲染根组件
			// 父节点
			const parent = oldVnode.parentNode;
			// 参考节点是 第一个 script 标签
			const referNode = oldVnode.nextSibling;
			// 创建元素, 将 vnode 变成真实节点, 并添加到父节点内
			createElm(vnode, parent, referNode);
			// 移除老的 vnode, 其实就是模板节点
			parent.removeChild(oldVnode);
		} else {
			// 后续更新
			console.log('=== update ===');
		}
	}
	return vnode.elm;
}

function createElm(vnode, parent, referNode) {
	// 在 vnode 上记录自己的父节点是谁
	vnode.parent = parent;

	// 创建自定义组件, 如果是非组件, 则会继续后续的流程
	if (createComponent(vnode)) return;

	// 代码到这儿, 说明是普通标签
	const { tag, attr, children, text } = vnode;

	if (text) {
		// 说明是文本节点
		// 创建文本节点, 并插入父节点内
		vnode.elm = createTextNode(vnode);
	} else {
		// 普通的元素节点
		// 创建元素
		vnode.elm = document.createElement(tag);
		// 给元素设置属性
		setAttribute(attr, vnode);
		// 循环递归调用 createElm 创建当前节点的所有子节点
		for (let i = 0, len = children.length; i < len; i++) {
			createElm(children[i], vnode.elm);
		}
	}

	// 节点创建完毕, 将创建的节点插入到父节点内
	if (parent) {
		const elm = vnode.elm;
		if (referNode) {
			parent.insertBefore(elm, referNode);
		} else {
			parent.appendChild(elm);
		}
	}
}

// 创建自定义组件
function createComponent(vnode) {
	if (vnode.tag && !isReserveTag(vnode.tag)) {
		// 非保留节点, 是自定会组件名称
		// 获取组件信息
		const {
			tag,
			context: {
				$options: { components },
			},
		} = vnode;
		const comOptions = components[tag];
		const comIns = new Vue(comOptions);
		// 将父组件的 VNode 放到子组件的实例上
		comIns._parentVnode = vnode;
		// 挂在子组件
		comIns.$mount();
		// 记录子组件 vnode 的父节点信息
		comIns._vnode.parent = vnode.parent;
		// 将子组件添加到父节点内
		vnode.parent.appendChild(comIns._vnode.elm);
		return true;
	}
}

// 创建文本节点
function createTextNode(textVnode) {
	let { text } = textVnode,
		textNode = null;
	if (text.expression) {
		// 说明当前文本节点含表达式, 表达式是响应式数据
		const value = textVnode.context[text.expression];
		textNode = document.createTextNode(
			typeof value === 'object' ? JSON.stringify(value) : value
		);
	} else {
		// 纯文本节点
		textNode = document.createTextNode(text.text);
	}

	return textNode;
}

// 给节点设置属性
function setAttribute(attr, vnode) {
	for (const name in attr) {
		if (name === 'vModel') {
			const { tag, value } = attr.vModel;
			setVModel(tag, value, vnode);
		} else if (name === 'vOn') {
			setVOn(vnode);
		} else if (name === 'vBind') {
			setVBind(vnode);
		} else {
			// 普通属性, 直接设置
			vnode.elm.setAttribute(name, attr[name]);
		}
	}
}

// v-model 原理
function setVModel(tag, value, vnode) {
	const { context: vm, elm } = vnode;

	if (tag === 'select') {
		// 下拉, <select></select>
		Promise.resolve().then(() => {
			elm.value = vm[value];
		});
		elm.addEventListener('change', function () {
			vm[value] = elm.value;
		});
	} else if (tag === 'input' && elm.type === 'text') {
		// 文本框, <input type="text" />
		elm.value = vm[value];
		elm.addEventListener('input', function () {
			vm[value] = elm.value;
		});
	} else if (tag === 'input' && elm.type === 'checkbox') {
		elm.checked = vm[value];
		elm.addEventListener('change', function () {
			vm[value] = elm.checked;
		});
	}
}

// v-on 原理
function setVOn(vnode) {
	const {
		attr: { vOn },
		elm,
		context: vm,
	} = vnode;

	for (let eventName in vOn) {
		elm.addEventListener(eventName, function (...args) {
			vm.$options.methods[vOn[eventName]].apply(vm, args);
		});
	}
}

// v-bind 原理
function setVBind(vnode) {
	const {
		attr: { vBind },
		elm,
		context: vm,
	} = vnode;

	for (let attrName in vBind) {
		elm.setAttribute(attrName, vm[vBind[attrName]]);
		elm.removeAttribute(`v-bind:${attrName}`);
	}
}
