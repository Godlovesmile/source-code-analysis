/**
 * 获取数组深度
 */

function getArrayDepth(arr) {
  if (!Array.isArray(arr)) return 0

  let dep = 1

  for (let val of arr) {
    if (Array.isArray(val)) {
      const tempDepth = getArrayDepth(val) + 1

      if (tempDepth > dep) {
        dep = tempDepth
      }
    }
  }

  return dep
}

const testArr = [[5, 6], 1, 2, [2, 3, [3, [5, 7, 8, [9]]], [5]]]

console.log(getArrayDepth(testArr))