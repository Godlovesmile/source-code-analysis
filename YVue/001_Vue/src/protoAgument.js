import { def } from './utils.js';

// 数组默认原型对象
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
// patch 七个方法, 通过拦截这七个方法实现数组响应式, 是这个七个方法的原因是它们能改变数组本身
const methodsToPatch = [
	'push',
	'pop',
	'unshift',
	'shift',
	'splice',
	'sort',
	'reverse',
];

methodsToPatch.forEach((method) => {
	def(arrayMethods, method, function mutator(...args) {
		// 1. 完成数组本身的调用动作, eg: this.arr.push(xxx);
		const result = arrayProto[method].apply(this, args);

		// 2. notify change; 预留数组的检测变化, 响应式
		console.log('array notify change');
		return result;
	});
});

export default function protoAgument(arr) {
	arr.__proto__ = arrayMethods;
}
