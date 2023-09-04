/**
 * 判断两值是否相等
 */

function isObject(val) {
  return typeof val === 'object' && val != null
}

function isEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }

  if (obj1 === obj2) return true

  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) return false

  for (let key in obj1) {
    const res = isEqual(obj1[key], obj2[key])

    if (!res) return false
  }

  return true
}

// const a = { a: 1 }
// const b = { a: 1, g: 2 }
const a = [1, 2]
const b = [1, 3]
console.log(a, b)
console.log('===', isEqual(a, b))