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

export { createApp, h };
//# sourceMappingURL=mini-vue.esm-bundler.js.map
