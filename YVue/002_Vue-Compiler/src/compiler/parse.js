/*
 * 解析模板字符串, 生 AST 语法树
 */
import { isUnaryTag } from '../utils.js';

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

		if (!root) {
			root = elementAst;
		}

		// 将 ast 对象, push 到栈中, 当遇到结束标签的时候就将栈顶的 ast 对象 pop 出来, 进行匹配处理
		stack.push(elementAst);

		// 自闭合标签, 则直接调用 end 方法, 进入闭合标签的处理截断, 不入栈处理
		if (isUnaryTag(tagName)) {
			processElement();
		}
	}

	/*
	 * 处理元素的闭合标签时会调用该方法
	 */
	function processElement() {
		// 弹出栈顶元素, 进一步处理元素
		const curEle = stack.pop();
		const stackLen = stack.length;
		const { tag, rawAttr } = curEle;

		// 处理结果存放在 attr 对象上, 并删除 rawAttr 对象中相应的属性
		curEle.attr = {};
		const propertyArr = Object.keys(rawAttr);

		if (propertyArr.includes('v-model')) {
			// 处理 v-model 指令
		} else if (propertyArr.find((i) => i.math(/^v-bind:(.*)/))) {
			// 处理 v-bind 指令
		} else if (propertyArr.find((i) => i.math(/^v-on:(.*)/))) {
			// 处理 v-on 指令
		}
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

/*
 * 生成 AST 对象
 */
function generateAST(tagName, attrMap) {
	return {
		// 元素节点
		type: 1,
		tag: tagName,
		rawAttr: attrMap,
		children: [],
	};
}
