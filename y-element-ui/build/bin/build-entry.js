const Components = require('../../components.json');
const uppercamelcase = require('uppercamelcase');
const render = require('json-templater/string');
const endfLine = require('os').EOL;
const path = require('path');
const OUTPUT_PATH = path.join(__dirname, '../../src/index.js');
const fs = require('fs');

// 1. index.js 头部动态引入文件代码
const ComponentsNames = Object.keys(Components);
const includeComponentTemplate = [];
const installTemplate = [];
const IMPORT_TEMPLATE =
	"import {{name}} from '../packages/{{package}}/index.js';";
const INSTALL_COMPONENT_TEMPLATE = ' {{name}}';

// 2. 主文件内容
let MAIN_TEMPLATE = `
{{include}}

const components = [{{install}}];

const install = function(Vue, opts = {}) {
	components.forEach(component => {
		Vue.component(component.name, component);
	});
}

export default {
	version: '{{version}}',
	install,
   {{list}}
}`;

ComponentsNames.forEach((name) => {
	const componentName = uppercamelcase(name);

	includeComponentTemplate.push(
		render(IMPORT_TEMPLATE, {
			name: componentName,
			package: name,
		})
	);

	installTemplate.push(
		render(INSTALL_COMPONENT_TEMPLATE, { name: componentName })
	);
});
console.log('===========');
console.log(includeComponentTemplate);
console.log('===========');

const template = render(MAIN_TEMPLATE, {
	version: process.env.VERSION || require('../../package.json').version,
	include: includeComponentTemplate.join(endfLine),
	install: installTemplate.join(',' + endfLine),
	list: installTemplate.join(',' + endfLine)
});

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE: ', OUTPUT_PATH);
