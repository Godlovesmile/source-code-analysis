/**
 * 数组去重
 */

function uniqueArray(arr) {
  if (!Array.isArray(arr)) return []

  const uniqueArr = []
  
  for (const val of arr) {
    if (!uniqueArr.includes(val)) {
      uniqueArr.push(val)
    }
  }

  return uniqueArr
}

function uniqueArrayNext(arr) {
  const setArr = new Set(arr)

  return [...setArr]
}

const testArr = [1, 2, 4, 5, 5, 7]

console.log('===', uniqueArray(testArr))
console.log('===', uniqueArrayNext(testArr))