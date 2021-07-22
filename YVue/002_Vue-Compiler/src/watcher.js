import Dep from './dep.js';

export default function Watcher(cb) {
	// 回调函数, 负责更新 Dom 回调函数
	this._cb = cb;
	Dep.target = this;
	// 执行 cb 函数, cb 函数中会发生 vm.xx 的属性读取, 进行依赖收集
	cb();
	Dep.target = null;
}

Watcher.prototype.update = function () {
    this._cb();
};
