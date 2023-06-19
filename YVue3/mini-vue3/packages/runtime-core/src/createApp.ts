import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // vnode, 所有操作都基于 vnode 进行处理
      const vnode = createVNode(rootComponent)
    },
  }
}
