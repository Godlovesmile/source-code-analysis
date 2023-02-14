// reactivity/src/reactive.ts

import { isObject } from '@mini-vue3/shared'
import { track, trigger } from './effect'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

// 缓存响应式对象
const reactiveMap = new WeakMap()

export function reactive(target: object) {
  // 判断 target 是否是响应式对象
  // 每当一个 target 需要响应式, 先判断其有没有该属性, 此时产生属性访问操作, 如果 target 被代理过, 则会进入下面的 get 方法中, 做进一步判断
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 只能代理对象
  if (!isObject(target)) return target

  // 判断 target 是否被代理过, 如果被代理过, 则直接返回代理对象
  const existing = reactiveMap.get(target)

  if (existing) {
    return existing
  }

  const handler = {
    // 监听属性访问操作
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        // 返回设置 '__v_isReactive' 的值
        return true
      }

      // 依赖收集, 让 target, key 和当前的 _effect 关联起来
      track(target, key)

      const res = Reflect.get(target, key)

      if (isObject(res)) {
        return reactive(res)
      }

      return res
    },
    // 监听设置属性操作
    set(target, key, value, receiver) {
      console.log(`${key}属性变化了, 派发更新`)
      if (target[key] !== value) {
        const result = Reflect.set(target, key, value, receiver)

        // 派发更新, 通知 target 的属性, 让依赖它的 _effect 再次执行
        trigger(target, key)
        
        return result
      }
    },
  }

  // 实例化代理对象
  const proxy = new Proxy(target, handler)

  // 将代理对象进行缓存
  reactiveMap.set(target, proxy)

  return proxy
}
