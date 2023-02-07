// scripts/dev.js

// 使用 minimist 解析命令参数
const args = require('minimist')(process.argv.slice(2))
const path = require('path')
// 使用 esbuild 作为构建工具
const { build } = require('esbuild')
// 需要打包的模块, 默认打包 reactivity 模块
const target = args._[0] || 'reactivity'

console.log('=== args ===', args)
console.log('=== build ===', build)