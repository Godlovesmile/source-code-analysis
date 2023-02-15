// reactivity/src/reactive.ts

import { isObject } from '@mini-vue3/shared'
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

// 缓存响应式对象
export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()

export function reactive(target: object) {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyMap, readonlyHandlers)
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

/**
 * 通用创建 reactive 方法
 * @param target
 * @param proxyMap
 * @param baseHandlers
 */
function createReactiveObject(target, proxyMap, baseHandlers) {
  // 只能代理对象
  if (!isObject(target)) return target

  // 判断 target 是否是响应式对象
  // 每当一个 target 需要响应式, 先判断其有没有该属性, 此时产生属性访问操作, 如果 target 被代理过, 则会进入下面的 get 方法中, 做进一步判断
  if (target[ReactiveFlags.IS_REACTIVE] || target[ReactiveFlags.IS_READONLY]) {
    return target
  }

  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)

  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, baseHandlers)

  // 将代理对象进行缓存
  proxyMap.set(target, proxy)

  return proxy
}
