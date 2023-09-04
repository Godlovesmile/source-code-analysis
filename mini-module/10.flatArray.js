/**
 * 深度数组扁平化
 * [1, 2, [3, 4, [4, 5]]]
 */
function flatArrayOne(arr) {
  const isDeep = arr.some(i => i instanceof Array)
  const res = Array.prototype.concat.apply([], arr)


  if (!isDeep) return res

  return flatArrayOne(res)
}

function flatArrayTwo(arr) {
  return arr.flat(Infinity)
}

const testArr = [1, 2, [3, 4, [4, 5]], 6, 7]

console.log(flatArrayOne(testArr))
console.log(flatArrayTwo(testArr))