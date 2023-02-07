"use strict";
var VueReactivity = (() => {
  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isArray = Array.isArray;

  // packages/reactivity/src/index.ts
  var obj = { name: "vue3" };
  console.log(isObject(obj));
})();
//# sourceMappingURL=reactivity.global.js.map
