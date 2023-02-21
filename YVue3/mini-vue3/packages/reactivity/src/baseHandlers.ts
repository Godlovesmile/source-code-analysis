import { isObject } from '@mini-vue3/shared'
import { track, trigger } from './effect'
import { reactive, readonly, ReactiveFlags } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

/**
 * 高阶通用 getter 方法
 * @param isReadonly
 */
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      track(target, key)
    }

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

/**
 * 高阶 set 方法
 */
function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)

    // 触发依赖
    trigger(target, key)

    return res
  }
}

/**
 * 正常逻辑 reactive 走的 handler
 */
export const mutableHandlers = {
  get,
  set,
}

/**
 * readonly 逻辑 reactive 走的 handler
 */
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly 模式响应式对象不可修改
    console.warn(`Set operation on key '${String(key)} failed: target is readonly'`)
    return true
  },
}

/**
 * shallowReadonly 逻辑 reactive 走的 handler
 */
export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly`, target)
    return true
  }
}