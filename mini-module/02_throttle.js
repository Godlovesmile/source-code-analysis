// 每隔一段时间, 只执行一次函数
/*
 应用场景: 
    1. 滚动加载，加载更多或滚到底部监听
    2. 谷歌搜索框，搜索联想功能
    3. 高频点击提交，表单重复提交
 */
function throttle(fn, delay) {
	let t1 = 0;
	return function () {
		let t2 = new Date();
		let args = arguments;
		if (t2 - t1 > delay) {
			fn.apply(this, args);
			t1 = t2;
		}
	};
}
