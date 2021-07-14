import Observer from './observer.js';

export default function observe(value) {
    console.log('=== observe ===', value);
	if (typeof value !== 'object') return;
	if (value.__ob__) return value.__ob__;
	return new Observer(value);
}
