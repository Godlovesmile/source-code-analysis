import Dep, { popTarget, pushTarget } from './dep.js';

export default function Watcher(cb, options = {}, vm = null) {
	// 回调函数, 负责更新 Dom 回调函数
	this._cb = cb;

	// Dep.target = this;
	// 执行 cb 函数, cb 函数中会发生 vm.xx 的属性读取, 进行依赖收集
	// cb();
	// Dep.target = null;

	// 回调函数执行后的值
	this.value = null;
	// computed 计算属性实现缓存的原理, 标记当前回调函数在本次渲染周期内是否已经被执行过
	this.dirty = !!options.lazy;
	// Vue 实例
	this.vm = vm;
	// 非懒执行时, 直接执行 cb 函数, cb 函数中会发生 vm.xx 的属性读取, 从而进行依赖收集
	!options.lazy && this.get();
}

Watcher.prototype.update = function () {
	Promise.resolve().then(() => {
		this._cb();
	});
	this.dirty = true;
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
