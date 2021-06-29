export default function Vue(options) {
	this._init(options);
}

Vue.prototype._init = function (options) {
	this.$options = options;
	initData(this);
};
