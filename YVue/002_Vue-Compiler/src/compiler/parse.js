/*
 * 解析模板字符串, 生 AST 语法树
 */
import { isUnaryTag } from '../utils.js';

export default function parse(template) {
	let stack = [];
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
			// eg: <div id="app">xxx</div>
			if (html.indexOf('</') === 0) {
				// 说明是闭合标签
				parseEnd();
			} else {
				// 处理开始标签
				parseStartTag();
			}
		} else if (startIndex > 0) {
			// 处理完开始标签的内容, 剩下 内容 + 结束标签的部分
			// eg: xxx</div>
			const nextStartIndex = html.indexOf('<');
			// 先处理文本部分, 通过 statck 判断文本部分是不是为处理标签中的内容
			if (stack.length) {
				processChars(html.slice(0, nextStartIndex));
			}
			// 处理完文本, 删除文本部分, 剩下结束标签 </div>
			html = html.slice(nextStartIndex);
		} else {
			// 纯文本标签
		}
	}

	return root;

	/*
	 * 解析开始标签 <div id="app"></div>, <h3></h3>
	 */
	function parseStartTag() {
		// 先找到开始标签的结束位置
		const end = html.indexOf('>');
		// 解析开始标签中的内容 (div id="app")
		const content = html.slice(1, end);
		// 截断 html, 将上面解析的内容从 html 字符串中删除
		html = html.slice(end + 1);
		// 找到(div id="app")第一个空格位置
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
	 * 处理结束标签 </div> next content
	 */
	function parseEnd() {
		// 将结束标签从 html 中移除掉
		html = html.slice(html.indexOf('>') + 1);
		// 一个标签处理结束了, 处理保存在 stack 中的 ast 元素
		processElement();
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

		// vue 中定义的自己的属性进行处理 ['v-model', 'v-on', 'v-bind']
		if (propertyArr.includes('v-model')) {
			// 处理 v-model 指令
			processVModel(curEle);
		} else if (propertyArr.find((i) => i.match(/^v-bind:(.*)/))) {
			// 处理 v-bind 指令
			processVBind(curEle, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`]);
		} else if (propertyArr.find((i) => i.match(/^v-on:(.*)/))) {
			// 处理 v-on 指令
			processVOn(curEle, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`]);
		}

		// 节点处理完后让其和父节点产生关系
		if (stackLen) {
			stack[stackLen - 1].children.push(curEle);
			curEle.parent = stack[stackLen - 1];
		}
	}

	/*
	 * 处理文本
	 */
	function processChars(text) {
		if (!text.trim()) return;

		// 构造文本节点的 AST 对象
		const textAst = {
			type: 3,
			text,
		};
		if (text.match(/{{(.*)}}/)) {
			// 说明是表达式, eg: {{ test }}
			textAst.expression = RegExp.$1.trim();
		}
		// 将 ast 放到栈顶元素中 children 中
		stack[stack.length - 1].children.push(textAst);
	}

	/*
	 * 解析属性数组, 得到一个 map 对象
	 */
	function parseAttrs(attrs) {
		const attrMap = {};
		for (let i = 0; i < attrs.length; i++) {
			const attr = attrs[i];
			const [attrKey, attrValue] = attr.split('=');

			// attrMap[attrKey] = attrValue.replace(/\s*/g, '');
			attrMap[attrKey] = attrValue.replace(/\"/g, '');
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
			// 原始属性标签
			rawAttr: attrMap,
			children: [],
		};
	}

	/*
	 * 处理 v-model 指令, 将结果直接放在 curEle 对象上
	 */
	function processVModel(curEle) {
		const { tag, rawAttr, attr } = curEle;
		const { type, 'v-moodel': vModelVal } = rawAttr;

		if (tag === 'input') {
			if (/text/.test(type)) {
				// <input type="text" v-model="">
				attr.vModel = { tag, type: 'text', value: vModelVal };
			} else if (/checkbox/.test(type)) {
				attr.vModel = { tag, type: 'checkbox', value: vModelVal };
			}
		} else if (tag === 'textarea') {
			// <textarea v-model="test">
			attr.vModel = { tag, value: vModelVal };
		} else if (tag === 'select') {
			// <select v-model="val"></select>
			attr.vModel = { tag, value: vModelVal };
		}
	}

	/*
	 * 处理 v-bind 指令
	 * <span v-bind:title="title"></span>
	 */
	function processVBind(curEle, bindKey, bindVal) {
		curEle.attr.vBind = { [bindKey]: bindVal };
	}

	/*
	 * 处理 v-on 指令
	 */
	function processVOn(curEle, vOnKey, vOnVal) {
		curEle.attr.vOn = { [vOnKey]: vOnVal };
	}
}
