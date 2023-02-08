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
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isArray = Array.isArray;

  // packages/reactivity/src/effect.ts
  var activeEffect;
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
    }
    run() {
      activeEffect = this;
      this.fn();
    }
  };
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
    }
  }
  function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    let effects = depsMap.get(key);
    if (effects) {
      effects.forEach((effect2) => {
        effect2.run();
      });
    }
  }

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
        track(target2, key);
        const res = Reflect.get(target2, key);
        if (isObject(res)) {
          return reactive(res);
        }
        return res;
      },
      // 监听设置属性操作
      set(target2, key, value, receiver) {
        console.log(`${key}\u5C5E\u6027\u53D8\u5316\u4E86, \u6D3E\u53D1\u66F4\u65B0`);
        if (target2[key] !== value) {
          const result = Reflect.set(target2, key, value, receiver);
          trigger(target2, key);
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
