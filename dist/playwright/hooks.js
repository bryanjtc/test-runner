var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/playwright/hooks.ts
var hooks_exports = {};
__export(hooks_exports, {
  getStoryContext: () => getStoryContext,
  setPostRender: () => setPostRender,
  setPreRender: () => setPreRender
});
module.exports = __toCommonJS(hooks_exports);
var setPreRender = /* @__PURE__ */ __name((preRender) => {
  globalThis.__sbPreRender = preRender;
}, "setPreRender");
var setPostRender = /* @__PURE__ */ __name((postRender) => {
  globalThis.__sbPostRender = postRender;
}, "setPostRender");
var getStoryContext = /* @__PURE__ */ __name((page, context) => __async(void 0, null, function* () {
  return page.evaluate(({ storyId }) => globalThis.__getContext(storyId), {
    storyId: context.id
  });
}), "getStoryContext");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStoryContext,
  setPostRender,
  setPreRender
});
