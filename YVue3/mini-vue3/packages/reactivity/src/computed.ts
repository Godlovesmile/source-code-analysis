import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

export class ComputedRefImpl {
  public effect: ReactiveEffect
  private _dirty: boolean
  private _value

  constructor(getter) {
    this._dirty = true
    // scheduler, 只在值改变时进行触发
    this.effect = new ReactiveEffect(getter, () => {
      if (this._dirty) return

      this._dirty = true
      // 触发依赖收集
      triggerRefValue(this)
    })
  }

  get value() {
    // 依赖收集
    trackRefValue(this)

    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }

    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}
