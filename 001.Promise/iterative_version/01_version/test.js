const YPromise = require('./YPromise');

// test1
const promise = new YPromise((resolve, reject) => {
	resolve('success');
	reject('error');
});

// promise.then(
// 	(value) => {
// 		console.log('resolve1', value);
// 	},
// 	(reason) => {
// 		console.log('reject1', reason);
// 	}
// );
// promise.then(
// 	(value) => {
// 		console.log('resolve1===1', value);
// 	},
// 	(reason) => {
// 		console.log('reject1', reason);
// 	}
// );

// test2
const promise2 = new YPromise((resolve, reject) => {
	// setTimeout(() => {
	// 	resolve('test-2-success');
	// }, 3000);
	resolve('test-2-success');
});

// promise2.then(
// 	(value) => {
// 		console.log('resolve2', value);
// 	},
// 	(error) => {
// 		console.log('reject2', error);
// 	}
// );

// test3, 多次 then 调用处理
// promise2.then(
// 	(value) => {
// 		console.log('resolve2===1', value);
// 	},
// 	(error) => {
// 		console.log('reject2====1', error);
// 	}
// );

// test4, then 链式调用处理
// promise2
// 	.then((value) => {
// 		console.log(1);
// 		console.log('resolve', value);
// 	})
// 	.then((value) => {
// 		console.log(2);
// 		console.log('resolve', value);
// 	});

// test5
function other() {
	return new YPromise((resolve, reject) => {
		resolve('=== other ===');
	});
}
// promise2
// 	.then((value) => {
// 		console.log(3);
// 		console.log('resolve', value);
// 		return other();
// 	})
// 	.then((value) => {
// 		console.log(4);
// 		console.log('resolve', value);
// 	});

// test6
const promise6 = new YPromise((resolve, reject) => {
	resolve(100);
});
// const p1 = promise6.then((value) => {
// 	return p1;
// });

// p1.then(
// 	(value) => {
// 		console.log(2);
// 		console.log('resolve', value);
// 	},
// 	(error) => {
// 		console.log(3);
// 		console.log(error.message);
// 	}
// );

// test7
const promise7 = new YPromise((resolve, reject) => {
	// throw new Error('执行器错误');
	resolve('success');
});

// promise7
// 	.then(
// 		(value) => {
// 			console.log(1);
// 			console.log('resolve', value);
// 			throw new Error('then error');
// 		},
// 		(error) => {
// 			console.log(2);
// 			console.log(error.message);
// 		}
// 	)
// 	.then(
// 		(value) => {
// 			console.log(3);
// 			console.log('resolve', value);
// 		},
// 		(error) => {
// 			console.log(4);
// 			console.log(error.message);
// 		}
// 	);

// test8
const promise8 = new YPromise((resolve, reject) => {
	// resolve(100);
	reject('error');
});
// promise8
// 	.then()
// 	.then()
// 	.then()
// 	.then()
// 	.then(
// 		(value) => console.log(value),
// 		(reason) => {
// 			console.log(reason);
// 		}
// 	);

// test 9
// YPromise.resolve()
// 	.then(() => {
// 		console.log(0);
// 		return YPromise.resolve(4);
// 	})
// 	.then((res) => {
// 		console.log(res);
// 	});

// test 10
// YPromise.resolve()
// 	.then(() => {
// 		console.log(0);
// 		return Promise.resolve(4);
// 	})
// 	.then((res) => {
// 		console.log(res);
// 	});

// YPromise.resolve()
// 	.then(() => {
// 		console.log(1);
// 	})
// 	.then(() => {
// 		console.log(2);
// 	})
// 	.then(() => {
// 		console.log(3);
// 	})
// 	.then(() => {
// 		console.log(5);
// 	})
// 	.then(() => {
// 		console.log(6);
// 	});

// test 11
const p1 = new YPromise((resolve, reject) => {
	setTimeout(() => {
		resolve('=== setTimeout ===');
	}, 1000);
	// reject('error');
	// resolve(6);
});
const p2 = 22;
const p3 = YPromise.resolve(3);

YPromise.all([p3, p1, p2]).then(
	(values) => {
		console.log('--- values ---', values);
	},
	(reason) => {
		console.log('--- reason ---', reason);
	}
);
