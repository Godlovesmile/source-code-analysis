import { reactive, computed } from '../src'

describe('reactivity/computed', () => {
  it('should return updated value', () => {
    const value = reactive({})
    const cValue = computed(() => value.foo)

    expect(cValue.value).toBe(undefined)
    value.foo = 1
    expect(cValue.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({ foo: 1 })
    const getter = vi.fn(() => { return value.foo })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()
  })
})