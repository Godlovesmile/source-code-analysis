// 每隔一段时间, 只执行一次函数
/*
 应用场景: 
    1. 滚动加载，加载更多或滚到底部监听
    2. 谷歌搜索框，搜索联想功能
    3. 高频点击提交，表单重复提交
 */
function throttle(fn, delay) {
	let lastTime = 0

	return function () {
		let currentTime = Date.now()
		let args = arguments
		
		if (currentTime - lastTime > delay) {
			fn.apply(this, args)
			lastTime = currentTime
		}
	};
}
