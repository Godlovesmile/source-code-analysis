// reactivity/src/effect.ts
import { extend } from '@mini-vue3/shared'

export let activeEffect
export let shouldTrack = false

export class ReactiveEffect {
  active = true
  deps = []
  onStop?: () => void

  // ts constructor public 会自动生成属性
  constructor(public fn, public scheduler?) {
    // this.fn = fn
  }

  run() {
    if (!this.active) return this.fn()

    shouldTrack = true
    // 将 _effect 赋给全局的变量 activeEffect
    activeEffect = this

    // fn 执行时, 内部用到的响应式数据的属性会被访问到, 就能触发 proxy 对象的 get 取值操作
    const result = this.fn()

    shouldTrack = false
    activeEffect = undefined

    return result
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      
      if (this.onStop) {
        this.onStop()
      }
    }
    this.active = false
  }
}

/**
 * 是否正在收集
 */
export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

// 取消 effect
function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })

  effect.deps.length = 0
}

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn)

  // 用户传进入 options 值, 合并到 _effect 对象上
  extend(_effect, options)

  _effect.run()

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

// 存储所有的依赖信息, 包含 target, key 和 _effect
const targetMap = new WeakMap()
/**
 * 依赖收集
 */
export function track(target, key) {
  if (!isTracking()) return

  // 从缓存中找到 target 对象所有的依赖信息
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  // 再找到属性 key 所对应的 _effect 集合
  let dep = depsMap.get(key)

  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  // 如果 _effect 已经被收集过了, 则不再收集
  trackEffects(dep)
}

// 依赖收集代码抽离, 复用到 ref 依赖收集
export function trackEffects(dep) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
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

  triggerEffects(effects)
}

// 依赖触发代码抽离, 复用到 ref 依赖触发模块
export function triggerEffects(effects) {
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

/**
 * 停止机制
 */
export function stop(runner) {
  runner.effect.stop()
}
