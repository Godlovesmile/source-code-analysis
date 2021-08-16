import VNode from './vnode.js';

// 在 Vue 实例上安装运行时的渲染函数, 比如 _c, _v 
export default renderHelper(target) {
    target._c = createElement;
    target._v = createTextNode;
}

// 根据标签信息创建 Vnode
function createElement(tag, attr, children) {
    return VNode(tag, attr, children, this);
}

// 生成文本节点 VNode
function createTextNode(textAst) {
    return VNode(null, null, null, this, textAst);
}