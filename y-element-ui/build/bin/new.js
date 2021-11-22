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

if (componentsFile[componentname]) {
	console.error(`${componentname} 已存在`);
	process.exit(1);
}
componentsFile[componentname] = `./packages/${componentname}/index.js`;
fileSave(path.join(__dirname, '../../components.json'))
	.write(JSON.stringify(componentsFile, null, '  '), 'utf8')
	.end('\n');
