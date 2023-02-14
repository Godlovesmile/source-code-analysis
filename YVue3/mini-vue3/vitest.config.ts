import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
  },
  // vitest 包引入其他模块, 配置文件寻址路径
  resolve: {
    alias: [
      {
        find: /@mini-vue3\/([\w-]*)/,
        replacement: path.resolve(__dirname, 'packages') + '/$1/src',
      },
    ],
  },
})
