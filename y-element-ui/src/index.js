
import Alert from '../packages/alert/index.js';
import Icon from '../packages/icon/index.js';

const components = [ Alert,
 Icon];

const install = function(Vue, opts = {}) {
	components.forEach(component => {
		Vue.component(component.name, component);
	});
}

export default {
	version: '1.0.0',
	install,
    Alert,
 Icon
}