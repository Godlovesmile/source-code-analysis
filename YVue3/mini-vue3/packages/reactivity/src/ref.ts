import { createDep } from './dep'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { hasChanged, isObject } from '@mini-vue3/shared'
import { reactive } from './reactive'

export class RefImpl {
  private _rawValue
  private _value
  public dep
  public __v_isRef = true

  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = createDep()
  }

  get value() {
    trackRefValue(this)

    return this._value
  }

  set value(newValue) {
    // 当值更新才需要进行更新操作
    if (hasChanged(this._rawValue, newValue)) {
      // 更新值
      this._value = convert(newValue)
      this._rawValue = newValue
      // 触发依赖
      triggerRefValue(this)
    }
  }
}

function createRef(value) {
  const refImpl = new RefImpl(value)

  return refImpl
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value?: unknown) {
  return createRef(value)
}

// ref 依赖收集
export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

// ref 依赖触发
export function triggerRefValue(ref) {
  triggerEffects(ref.dep)
}

export function isRef(value) {
  return !!value.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

/** 
 * 函数目的是帮助解析 ref
*/
const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    return unRef(Reflect.get(target, key, receiver))
  },
  set(target, key, value, receiver) {
    const oldValue = target[key]

    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value)
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers)
}
