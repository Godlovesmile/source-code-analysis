// 存储所有的 Deep.target
export default function Dep() {
	this.watchers = [];
}

// 造成 computed 计算属性之后渲染的响应式数据无法完成依赖收集
const targetStatck = [];

// 实例化 Watcher 时进行赋值; 收集完成之后又赋值为 null
Dep.target = null;

// 1. 收集 watcher
Dep.prototype.depend = function () {
	// 防止 Watcher 实例重新收集
	if (this.watchers.includes(Dep.target)) return;

	this.watchers.push(Dep.target);
};

// 2. dep 通知收集 watcher 进行更新
Dep.prototype.notify = function () {
	for (const watcher of this.watchers) {
		watcher.update();
	}
};

//
export function pushTarget(target) {
	// 备份传递进来的 Watcher
	targetStatck.push(target);
	Dep.target = target;
}

export function popTarget(target) {
	targetStatck.pop();
	Dep.target = targetStatck[targetStatck.length - 1];
}
