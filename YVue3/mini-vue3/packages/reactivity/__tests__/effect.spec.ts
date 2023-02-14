import { reactive } from '../src/reactive'
import { effect } from '../src/effect'
import { vi } from 'vitest'

describe('effect', () => {
  it('effect test', () => {
    const user = reactive({ age: 10 })

    let nextAge

    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++
    expect(nextAge).toBe(12)
  })

  it('effect return result runner', () => {
    let foo = 10
    const runner = effect(() => {
      foo++

      return foo
    })

    expect(foo).toBe(11)

    const result = runner()

    expect(foo).toBe(12)
    expect(result).toBe(12)
  })

  it('scheduler', () => {
    let dummy
    let run
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })
})