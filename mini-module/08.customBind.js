/**
 * 自定义 bind 函数
 * bind 是创建了一个新函数
 */

// 深入参考文章: https://zhuanlan.zhihu.com/p/433154965

Function.prototype.xbind = function () {
  // 1. 获取参数, (类数组转化为数组)
  const args = Array.prototype.slice.call(arguments)

  // 2. 传入的绑定 this 对象(即参数的第一个)
  const t = args.shift()

  const self = this

  // 3.
  return function() {
    return self.apply(t, args)
  }
}

function fn(a, b, c) {
  console.log('=== this ===', this)
  console.log('=== args ===', a, b, c)

  return 'return res'
}

const newFn = fn.xbind({ x: 100 }, 1, 2, 3)
const res = newFn()

console.log('=== res ===', res)