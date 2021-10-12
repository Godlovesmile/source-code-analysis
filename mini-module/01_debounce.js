// 防抖, 一段时间之内, 值执行一次
/*
 应用场景:
    1. 搜索框搜索输入。只需用户最后一次输入完，再发送请求
    2. 手机号、邮箱验证输入检测
    3. 窗口大小Resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。
 */
function debounce(fn, delay) {
	let timer;
	return function () {
		if (timer) {
			clearTimeout(timer);
		}

		let args = arguments;
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}
