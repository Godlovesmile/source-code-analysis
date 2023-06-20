'use strict';

const createVNode = function (type, props, children) {
    return {
        type,
        props,
        children
    };
};

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
        },
    };
}

const h = (type, props, children) => {
    return createVNode(type, props, children);
};

exports.createApp = createApp;
exports.h = h;
//# sourceMappingURL=mini-vue.cjs.js.map
