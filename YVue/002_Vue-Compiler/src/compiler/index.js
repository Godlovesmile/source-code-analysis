/*
 * 编译器
 */
import compileToFunction from './compileToFunction.js';

export default function mount(vm) {
	if (!vm.$options.render) {
		// 没有提供 render 选项, 则编译生成 render 函数
		let template = '';

		if (vm.$options.template) {
			// 模板存在
			template = vm.$options.template;
		} else if (vm.$options.el) {
			// 存在挂载点
			template = document.querySelector(vm.$options.el).outerHTML;
			// 在实例上记录挂载点, this._update 中用到
			vm.$el = document.querySelector(vm.$options.el);
		}

		// 生成渲染函数
		const render = compileToFunction(template);
		// 将渲染函数挂载到 $options 上
		vm.$options.render = render;
	}
}
