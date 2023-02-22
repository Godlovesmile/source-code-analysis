import { ref } from '../src/ref' 
import { effect } from '../src/effect' 

describe('reactivity/ref', () => {
  it('should hold a value', () => {
    const a = ref(1)
    // a.value = 2
    expect(a.value).toBe(1)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0

    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
  })
})