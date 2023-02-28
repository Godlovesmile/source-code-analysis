import { createDep } from './dep'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { hasChanged } from '@mini-vue3/shared'

export class RefImpl {
  private _value
  public dep

  constructor(value) {
    this._value = value
    this.dep = createDep()
  }

  get value() {
    trackRefValue(this)

    return this._value
  }

  set value(newValue) {
    // 当值更新才需要进行更新操作
    if (hasChanged(this._value, newValue)) {
      // 更新值
      this._value = newValue
      // 触发依赖
      triggerRefValue(this)
    }
  }
}

function createRef(value) {
  const refImpl = new RefImpl(value)

  return refImpl
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
