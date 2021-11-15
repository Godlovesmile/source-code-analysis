/*
 * 将 watcher 放入队列
 */

// 存储本次更新的所有 watcher
const queue = [];
// 标识现在是否正在刷新 watcher 队列
let flushing = false;
// 标识, 保证 callbacks 数组中只会一个刷新 watcher 队列的函数
let waiting = false;
// 存放刷新 watcher 队列的函数, 或者用户调用 Vue.nextTick 方法传递的回调函数
const callbacks = [];
// 标识浏览器当前任务中是否存在刷新 callbacks 数组的函数
let pending = false;

export function queueWatcher(watcher) {
	// 防止重复队列
	if (!queue.includes(watcher)) {
		// 现在没有刷新 watcher 队列
		if (!flushing) {
			queue.push(watcher);
		} else {
			// 标记当前 watcher 队列在 for 中是否已经完成入队操作
			let flag = false;
			for (let i = queue.length - 1; i >= 0; i--) {
				if (queue[i].uid < watcher.uid) {
					queue.splice(i + 1, 0, watcher);
					flag = true;
					break;
				}
			}
			// 说明上面的 for 循环在队列中没找到比当前小的 watcher.uid, 即将当前的 watcher 插入到队首
			if (!flag) {
				queue.unshift(watcher);
			}
		}
		// 保证 callbacks 数组中只会有一个刷新 watcher 队列函数
		if (!waiting) {
			waiting = true;
			nextTick(flushSchedulerQueue);
		}
	}
}

/*
 * 负责刷新 watcher 队列的函数, 由 flushCallbacks 函数调用
 */
function flushSchedulerQueue() {
	// 表示正在刷新 watcher 队列
	flushing = true;
	queue.sort((a, b) => a.uid - b.uid);

	while (queue.length) {
		const watcher = queue.shift();
		watcher.run();
	}
	// 队列刷新完毕
	flushing = waiting = false;
}

// 将刷新 watcher 队列的函数或者用户调用 Vue.nextTick 方法传递的回调函数放入 callbacks 数组
function nextTick(cb) {
	callbacks.push(cb);
	if (!pending) {
		Promise.resolve().then(flushCallbacks);
		pending = true;
	}
}

function flushCallbacks() {
	pending = false;

	while (callbacks.length) {
		const cb = callbacks.shift();
		// 执行回调函数
		cb();
	}
}
