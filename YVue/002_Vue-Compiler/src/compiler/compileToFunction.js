/*
 * 解析模板字符串, 得到 AST 语法树
 * 将 AST 语法树生成渲染函数
 */
export default function compileToFunction(template) {
	// 解析模板, 生成 AST
	const ast = parse(template);
	// 将 ast 生成渲染函数
	const render = generate(ast);

	return render;
}
