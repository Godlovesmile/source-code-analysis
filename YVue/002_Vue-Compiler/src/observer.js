import { def } from './utils.js';
import protoAgument from './protoAgument.js';
import observe from './observe.js';
import defineReactive from './defineReactive.js';
import Dep from './Dep.js';

export default function Observer(value) {
    // 为对象本身设置一个 dep, 对象更新本身时使用
    this.dep = new Dep();

	// 设置 __ob__ 属性, 值为 this, 标识当前对象已经是一个响应式对象了
	def(value, '__ob__', this);

	if (Array.isArray(value)) {
		// 数组响应式处理
		// 1. 内置方法设置监测
		protoAgument(value);
		// 2. 数组每个元素设置修改监测
		this.observeArray(value);
	} else {
		// 对象响应式处理
		this.walk(value);
	}
}

// 遍历数组的每个元素，为每个元素非原始值设置响应式
Observer.prototype.observeArray = function (arr) {
	for (const item of arr) {
		observe(item);
	}
};

// 遍历对象属性, 为这些属性设置 getter, setter 拦截
Observer.prototype.walk = function (obj) {
	for (let key in obj) {
		defineReactive(obj, key, obj[key]);
	}
};
