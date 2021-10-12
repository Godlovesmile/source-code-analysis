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
			patchVnode(oldVnode, vnode);
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
	console.log(textNode);
	return textNode;
}

// 给节点设置属性
function setAttribute(attr, vnode) {
	for (const name in attr) {
		console.log(name);
		if (name === 'vModel' || name == 'v-model') {
			const { tag, value } = attr['vModel'] || attr['v-model'];
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

// 对比新老节点, 找出其中的不同, 然后更新老节点
function patchVnode(oldVnode, vnode) {
	// 新老节点相同, 直接结束
	if (oldVnode === vnode) return;

	// 将老 vnode 上的真实节点同步到新的 vnode 上, 否则, 后续更新的时候会出现 vnode.elm 为空现象
	vnode.elm = oldVnode.elm;

	// 到此, 说明新老节点不一样, 则获取它们的孩子节点, 比较孩子节点
	const ch = vnode.children;
	const oldCh = oldVnode.children;

	if (!vnode.text) {
		// 新节点不存在文本节点
		if (ch && oldCh) {
			// diff
			updateChildren(ch, oldCh);
		} else if (ch) {
			// 新节点有孩子
			// 增加孩子节点
		} else {
			// 新节点没有孩子, 老节点有孩子
			// 删除这些孩子节点
		}
	} else {
		// 新节点存在文本节点
		if (vnode.text.expression) {
			// 说明存在表达式
			// 获取表达式的新值
			const value = JSON.stringify(vnode.context[vnode.text.expression]);
			try {
				const oldValue = oldVnode.elm.textContent;
				if (value !== oldValue) {
					// 新老值不一样, 则更新
					oldVnode.elm.textContent = value.replace(/\"/g, '');
				}
			} catch (error) {
				// 防止更新时遇到插槽, 导致报错
				// 先不处理插槽数据更新
			}
		}
	}
}

// diff, 比较孩子节点, 找出不同点, 然后将不同点更新到老节点
function updateChildren(ch, oldCh) {
	// 四个游标进行对比
	let newStartIdx = 0;
	let newEndIdx = ch.length - 1;
	let oldStartIdx = 0;
	let oldEndIdx = oldCh.length - 1;

	// 循环遍历找出不同点
	while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
		// 新开始节点
		const newStartNode = ch[newStartIdx];
		// 新结束节点
		const newEndNode = ch[newEndIdx];
		// 旧开始节点
		const oldStartNode = oldCh[oldStartIdx];
		// 旧结束节点
		const oldEndNode = oldCh[oldEndIdx];

		if (sameNode(newStartNode, oldStartNode)) {
			// 新开始节点与旧开始节点是同一个节点
			// 对比两个节点, 找出不同然后更新
			patchVnode(oldStartNode, newStartNode);
			// 更新游标
			newStartIdx++;
			oldStartIdx++;
		} else if (sameNode(newStartNode, oldEndNode)) {
			// 新开始节点和老开始是同一个节点
			patchVnode(oldEndNode, newStartNode);
			// 将老结束移动到新开始位置
			oldEndNode.elm.parentNode.insertBefore(
				oldEndNode.elm,
				oldCh[newStartNode].elm
			);
			// 移动游标
			newStartIdx++;
			oldEndIdx--;
		} else if (sameNode(newEndIdx, oldStartIdx)) {
			// 新结束节点和旧开始节点相同
			patchVnode(oldStartNode, newEndNode);
			// 将旧开始移动到新结束位置
			oldStartNode.elm.parentNode.insertBefore(
				oldStartNode.elm,
				oldCh[newEndIdx].elm
			);
			oldStartIdx++;
			newEndIdx--;
		} else if (sameNode(newEndNode, oldEndNode)) {
			patchVnode(oldEndNode, newEndNode);
			newEndIdx--;
			oldEndIdx--;
		} else {
			// 上面几种假设都没命中, 则老老实实遍历, 找到那个相同的元素
		}
	}
}

// 判断节点是否相同
function sameNode(n1, n2) {
	return n1.key == n2.key && n1.tag == n2.tag;
}
