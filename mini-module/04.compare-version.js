// 版本号比较, 版本号风格为 Major.Minor.Patch（主版本号 . 次版本号 . 修订版本号）
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')

  const maxLen = Math.max(v1.length, v2.length)

  while (v1.length < maxLen) {
    v1.push('0')
  }
  while (v2.length < maxLen) {
    v2.push('0')
  }

  for (let i = 0; i < maxLen; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

console.log('=== version ===', compareVersion('1.1.1', '1.1.1'))