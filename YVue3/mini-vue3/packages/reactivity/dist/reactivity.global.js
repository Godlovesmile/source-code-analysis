"use strict";
var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    reactive: () => reactive
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isArray = Array.isArray;

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    if (!isObject(target))
      return target;
    const existing = reactiveMap.get(target);
    if (existing) {
      return existing;
    }
    const handler = {
      // 监听属性访问操作
      get(target2, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        console.log(`=== ${key} \u5C5E\u6027\u88AB\u8BBF\u95EE, \u4F9D\u8D56\u6536\u96C6 ===`);
        return Reflect.get(target2, key);
      },
      // 监听设置属性操作
      set(target2, key, value, receiver) {
        console.log(`${key}\u5C5E\u6027\u53D8\u5316\u4E86, \u6D3E\u53D1\u66F4\u65B0`);
        if (target2[key] !== value) {
          const result = Reflect.set(target2, key, value, receiver);
          return result;
        }
      }
    };
    const proxy = new Proxy(target, handler);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
