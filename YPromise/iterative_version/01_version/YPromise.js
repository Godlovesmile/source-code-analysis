// 定义状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// new YPromise
class YPromise {
	constructor(executor) {
		try {
			// executor 是执行器, 进入会立即执行
			executor(this.resolve, this.reject);
		} catch (error) {
			this.reject(error);
		}
	}

	// 存储状态变量
	status = PENDING;

	// 成功之后的值
	value = null;

	// 失败之后的理由
	reason = null;

	// 暂存 then 成功的回调
	// onFulfilled = null;
	onFulfilledCallbacks = []; // 多次 then 的处理

	// 暂存 then 失败的回调
	// onRejected = null;
	onRejectedCallbacks = [];

	// 更改成功的状态
	resolve = (value) => {
		if (this.status === PENDING) {
			this.status = FULFILLED;
			this.value = value;
			// typeof this.onFulfilled === 'function' && this.onFulfilled(value);

			while (this.onFulfilledCallbacks.length) {
				const onFulfilledItem = this.onFulfilledCallbacks.shift();
				typeof onFulfilledItem === 'function' && onFulfilledItem(value);
			}
		}
	};

	// 更改失败的状态
	reject = (reason) => {
		if (this.status === PENDING) {
			this.status = REJECTED;
			this.reason = reason;
			// typeof this.onRejected === 'function' && this.onRejected(reason);
			while (this.onRejectedCallbacks.length) {
				const onRejectedItem = this.onRejectedCallbacks.shift();
				typeof onRejectedItem === 'function' && onRejectedItem(reason);
			}
		}
	};

	then(onFulfilled, onRejected) {
		// const realOnFulfilled =
		// 	typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
		// const realOnRejected =
		// 	typeof onRejected === 'function'
		// 		? onRejected
		// 		: (reason) => {
		// 				throw reason;
		// 		  };

		onFulfilled =
			typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
		onRejected =
			typeof onRejected === 'function'
				? onRejected
				: (reason) => {
						throw reason;
				  };

		const _promise = new YPromise((resolve, reject) => {
			const fulfilledMicrotask = () => {
				// 创建一个微任务等待 _promise 完成初始化
				queueMicrotask(() => {
					try {
						// 获取成功回调函数的执行结果
						const x = onFulfilled(this.value);
						// 传入 _resolvePromise 集中处理
						_resolvePromise(_promise, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};

			const rejectedMicrotask = () => {
				// 创建一个微任务等待 _promise 完成初始化
				queueMicrotask(() => {
					try {
						// 调用失败回调，并且把原因返回
						const x = onRejected(this.reason);
						// 传入 _resolvePromise 集中处理
						_resolvePromise(_promise, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};

			if (this.status === FULFILLED) {
				// typeof onFulfilled === 'function' &&
				fulfilledMicrotask();
			} else if (this.status === REJECTED) {
				// typeof onRejected === 'function' && onRejected(this.reason);
				rejectedMicrotask();
			} else if (this.status === PENDING) {
				// this.onFulfilledCallbacks.push(onFulfilled);
				this.onFulfilledCallbacks.push(fulfilledMicrotask);
				// this.onRejectedCallbacks.push(onRejected);
				this.onRejectedCallbacks.push(rejectedMicrotask);
			}
		});

		return _promise;
	}

	static resolve(parameter) {
		if (parameter instanceof YPromise) {
			return parameter;
		}

		return new YPromise((resolve) => {
			resolve(parameter);
		});
	}

	static reject(reason) {
		return new YPromise((reject) => {
			reject(reason);
		});
	}

	static all(promises) {
		return new YPromise((resolve, reject) => {
			if (promises.length === 0) {
				resolve(promiseValues);
			}

			let promiseValues = [];
			let count = 0;

			promises.forEach((v, index) => {
				YPromise.resolve(v).then(
					(value) => {
						console.log(value);
						count++;
						promiseValues[index] = value;

						if (count === promises.length) {
							resolve(promiseValues);
						}
					},
					(reason) => {
						reject(reason);
					}
				);
			});
		});
	}
}

function _resolvePromise(_promise, x, resolve, reject) {
	if (_promise === x) {
		return reject(
			new TypeError('Chaining cycle detected for promise #<Promise>')
		);
	}
	// if (x instanceof YPromise) {
	// 	x.then(resolve, reject);
	// } else {
	// 	resolve(x);
	// }
	if (typeof x === 'object' || typeof x === 'function') {
		if (x === null) {
			return resolve(x);
		}

		let then;
		try {
			then = x.then;
		} catch (e) {
			return reject(e);
		}

		if (typeof then === 'function') {
			let called = false;
			try {
				then.call(
					x,
					(y) => {
						if (called) return;
						called = true;
						_resolvePromise(_promise, y, resolve, reject);
					},
					(r) => {
						if (called) return;
						called = true;
						reject(r);
					}
				);
			} catch (e) {
				if (called) return;
				reject(e);
			}
		} else {
			resolve(x);
		}
	} else {
		resolve(x);
	}
}

YPromise.deferred = function () {
	var result = {};

	result.promise = new YPromise(function (resolve, reject) {
		result.resolve = resolve;
		result.reject = reject;
	});

	return result;
};

// 对外暴露 YPromise
module.exports = YPromise;
