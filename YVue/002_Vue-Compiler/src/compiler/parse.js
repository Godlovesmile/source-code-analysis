/*
 * 解析模板字符串, 生 AST 语法树
 */

export default function parse(template) {
	const stack = [];
	let root = null;
	let html = template;

	while (html.trim()) {
		// 过滤注释标签
		if (html.indexOf('<!--') === 0) {
			// 说明开始位置是注释标签, 忽略掉
			html = html.slice(html.indexOf('-->') + 3);
			continue;
		}
		// 匹配开始标签
		const startIndex = html.indexOf('<');
		if (startIndex === 0) {
			if (html.indexOf('</') === 0) {
				// 说明是闭合标签
				parseEnd();
			} else {
				// 处理开始标签
				parseStartTag();
			}
		} else if (startIndex > 0) {
		} else {
			// 纯文本标签
		}
	}

	return root;

	/*
	 * 解析开始标签
	 */
	function parseStartTag() {
		// 先找到开始标签的结束位置
		const end = html.indexOf('>');
		// 解析开始标签中的内容
		const content = html.slice(1, end);
		// 截断 html, 将上面解析的内容从 html 字符串中删除
		html = html.slice(end + 1);
		// 找到第一个空格位置
		const firstSpaceIndex = content.indexOf(' ');
		// 标签名和属性名字符串
		let tagName = '',
			attrsStr = '';
		if (firstSpaceIndex === -1) {
			// 没有空格, 则认为 content 就是标签名, 如 <h3></h3>, 则 content = h3;
			tagName = content;
			attrsStr = '';
		} else {
			// 标签名
			tagName = content.slice(0, firstSpaceIndex);
			// 所有属性
			attrsStr = content.slice(firstSpaceIndex + 1);
		}

		// 得到属性数组, [id='app', xx=xx]
		const attrs = attrsStr ? attrsStr.split(' ') : [];
		// 进一步解析属性数组, 得到一个 map 对象
		const attrMap = parseAttrs(attrs);
		// 生成 AST 对象
		const elementAst = generateAST(tagName, attrMap);
	}
}

/*
 * 解析属性数组, 得到一个 map 对象
 */
function parseAttrs(attrs) {
	const attrMap = {};
	for (let i = 0; i < attrs.length; i++) {
		const attr = attrs[i];
		const [attrKey, attrValue] = attr.split('=');

		attrMap[attrKey] = attrValue.replace(/\s*/g, '');
	}
	return attrMap;
}
