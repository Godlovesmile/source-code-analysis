// reactivity/src/effect.ts
import { extend } from '@mini-vue3/shared'

export let activeEffect

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn)

  // 用户传进入 options 值, 合并到 _effect 对象上
  extend(_effect, options)

  _effect.run()

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }

  run() {
    // 将 _effect 赋给全局的变量 activeEffect
    activeEffect = this
    // fn 执行时, 内部用到的响应式数据的属性会被访问到, 就能触发 proxy 对象的 get 取值操作
    const result = this.fn()

    return result
  }
}

// 存储所有的依赖信息, 包含 target, key 和 _effect
const targetMap = new WeakMap()
/**
 * 依赖收集
 */
export function track(target, key) {
  if (!activeEffect) return

  // 从缓存中找到 target 对象所有的依赖信息
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  // 再找到属性 key 所对应的 _effect 集合
  let deps = depsMap.get(key)

  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  // 如果 _effect 已经被收集过了, 则不再收集
  let shouldTrack = !deps.has(activeEffect)

  if (shouldTrack) {
    deps.add(activeEffect)
  }
}

/**
 * 派发机制
 */
export function trigger(target, key) {
  // 找到 target 的所有资源
  let depsMap = targetMap.get(target)

  if (!depsMap) return

  // 属性依赖的 _effect 列表
  let effects = depsMap.get(key)

  if (effects) {
    effects.forEach((effect) => {
      // scheduler 可以让用户自己选择调用的时机, 这样就可以灵活的控制调用
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    })
  }
}
