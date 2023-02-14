import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

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
})
