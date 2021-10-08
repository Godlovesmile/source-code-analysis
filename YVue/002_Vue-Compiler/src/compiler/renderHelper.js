import VNode from './vnode.js';

// 在 Vue 实例上安装运行时的渲染函数, 比如 _c, _v
export default function renderHelper(target) {
	target._c = createElement;
	target._v = createTextNode;
	target._t = renderSlot;
}

// 根据标签信息创建 Vnode
function createElement(tag, attr, children) {
	return VNode(tag, attr, children, this);
}

// 生成文本节点 VNode
function createTextNode(textAst) {
	return VNode(null, null, null, this, textAst);
}

// 插槽原理
function renderSlot(attrs, children) {
	// 父组件 vnode 的 attr 信息
	const parentAttr = this._parentVnode.attr;
	let vnode = null;

	if (parentAttr.scopedSlots) {
		console.log('===');
		console.log(attrs);
        console.log(parentAttr.scopedSlots);
		// 获取插槽信息
		const slotName = attrs.name;
		const slotInfo = parentAttr.scopedSlots[slotName];
		console.log('slotInfo', slotInfo);

		this[slotInfo.scopeSlot] = this[Object.keys(attrs.vBind)[0]];
		vnode = genVNode(slotInfo.children, this);
	} else {
		vnode = genVNode(children, this);
	}

	// 如果 children 长度为 1, 则说明插槽只有一个子节点
	if (children.length == 1) return vnode[0];
	return createElement.call(this, 'div', {}, vnode);
}

// 将第一批 ast 节点(数组)转换成 vnode 数组
function genVNode(childs, vm) {
	const vnode = [];
	for (let i = 0, len = childs.length; i < len; ++i) {
		const { tag, attr, children, text } = childs[i];
		if (text) {
			// 文本节点
			if (typeof text === 'string') {
				// 构造文本节点的 AST 对象
				const textAst = {
					type: 3,
					text,
				};
				if (text.match(/{{(.*)}}/)) {
					// 说明是表达式
					textAst.expression = RegExp.$1.trim();
				}
				vnode.push(createTextNode.call(vm, textAst));
			} else {
				vnode.push(createTextNode.call(vm, text));
			}
		} else {
			// 元素节点
			vnode.push(
				createElement.call(vm, tag, attr, genVNode(children, vm))
			);
		}
	}
	return vnode;
}
