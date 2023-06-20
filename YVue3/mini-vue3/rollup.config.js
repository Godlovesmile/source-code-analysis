import typescript from '@rollup/plugin-typescript'

export default {
  input: './packages/vue/src/index.ts',
  output: [
    {
      format: 'cjs',
      file: './packages/vue/dist/mini-vue.cjs.js',
      sourcemap: true,
    },
    {
      format: 'es',
      file: './packages/vue/dist/mini-vue.esm-bundler.js',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
}
