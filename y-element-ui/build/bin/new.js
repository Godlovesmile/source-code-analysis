if (!process.argv[2]) {
	console.log('[组件名]必填');
	process.exit(1);
}

const uppercamelcase = require('uppercamelcase');
const componentname = process.argv[2];
const ComponentName = uppercamelcase(componentname);
const path = require('path');
const componentsFile = require('../../components.json');
const fileSave = require('file-save');
const fs = require('fs');

// 1. 添加到 components.json
if (componentsFile[componentname]) {
	console.error(`${componentname} 已存在`);
	process.exit(1);
}
componentsFile[componentname] = `./packages/${componentname}/index.js`;
fileSave(path.join(__dirname, '../../components.json'))
	.write(JSON.stringify(componentsFile, null, '  '), 'utf8')
	.end('\n');

// 2. 添加到 index.scss
const sassPath = path.join(
	__dirname,
	'../../packages/theme-chalk/src/index.scss'
);
const sassImportText = `${fs.readFileSync(
	sassPath
)}@import "./${componentname}.scss";`;

fileSave(sassPath).write(sassImportText, 'utf8').end('\n');

// 3. 自动生成 packages 文件下的组件文件
const PackagePath = path.resolve(__dirname, '../../packages', componentname);
const Files = [
	{
		filename: 'index.js',
		content: `import ${ComponentName} from './src/main'; 
${ComponentName}.install = function(Vue) {
	Vue.component(${ComponentName}.name), ${ComponentName}
};
export default ${ComponentName}`,
	},
	{
		filename: 'src/main.vue',
		content: `<template>
	<div class="el-${componentname}"></div>
</template>
		
<script>
export default {
	name: 'El${ComponentName}'
}
</script>`,
	},
	{
		filename: path.join(
			'../../packages/theme-chalk/src',
			`${componentname}.scss`
		),
		content: `@import "mixins/mixins";
@import "common/var";

@include b(${componentname}) {}`,
	},
];
Files.forEach((file) => {
	fileSave(path.join(PackagePath, file.filename))
		.write(file.content, 'utf8')
		.end('\n');
});
