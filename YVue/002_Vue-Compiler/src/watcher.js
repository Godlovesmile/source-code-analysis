import Dep, { popTarget, pushTarget } from './dep.js';

// 用来标记 watcher
let uid = 0;

export default function Watcher(cb, options = {}, vm = null) {
	// 回调函数, 负责更新 Dom 回调函数
	this._cb = cb;

	// Dep.target = this;
	// 执行 cb 函数, cb 函数中会发生 vm.xx 的属性读取, 进行依赖收集
	// cb();
	// Dep.target = null;
	// 标识 watcher
	this.uid = uid++;

	// 回调函数执行后的值
	this.value = null;
	// computed 计算属性实现缓存的原理, 标记当前回调函数在本次渲染周期内是否已经被执行过
	this.dirty = !!options.lazy;
	// Vue 实例
	this.vm = vm;
	// 非懒执行时, 直接执行 cb 函数, cb 函数中会发生 vm.xx 的属性读取, 从而进行依赖收集
	!options.lazy && this.get();
}

// 响应式数据更新时, dep 通知 watcher 执行 update 方法
Watcher.prototype.update = function () {
	// Promise.resolve().then(() => {
	// 	this._cb();
	// });
	// this.dirty = true;
	if (this.options.lazy) {
		// 懒执行
		this.dirty = true;
	} else {
		// 将 watcher 放入异步 watcher 队列
	}
};

Watcher.prototype.get = function () {
	pushTarget(this);
	this.value = this._cb.apply(this.vm);
	popTarget();
};

Watcher.prototype.evalute = function () {
	// 执行 get, 触发计算函数 cb 的执行
	this.get();
	this.dirty = false;
};
