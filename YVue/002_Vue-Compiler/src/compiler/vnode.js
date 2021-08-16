/*
 * VNode
 * tag 标签名, 
 * attr 属性 Map 对象, 
 * children 子节点组成的 vnode, 
 * text 文本节点的 ast 对象, 
 * context Vue 实例
 */
export default function VNode(tag, attr, children, context, text = null) {
    return {
        tag,
        attr,
        parent: null,
        children,
        text,
        // VNode 真实节点
        elm: null,
        // Vue 实例
        context,
    }
}