import { readonly, isReadonly, isProxy, isReactive } from '../src/reactive'

describe('readonly', () => {
  it('should make nested values readonly', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(isProxy(wrapped)).toBe(true)
    expect(isReactive(wrapped)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReactive(wrapped.bar)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReactive(original.bar)).toBe(false)
    expect(isReadonly(original.bar)).toBe(false)
    // has
    expect('foo' in wrapped).toBe(true)
    // get
    expect(wrapped.foo).toBe(1)
    // own keys
    expect(Object.keys(wrapped)).toEqual(['foo', 'bar'])
  })

  it('warn then call set', () => {
    console.warn = vi.fn()

    const user = readonly({ age: 10 })
    user.age = 20

    expect(console.warn).toBeCalled()
  })
})
