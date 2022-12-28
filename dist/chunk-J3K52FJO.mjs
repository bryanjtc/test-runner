import {
  __name
} from "./chunk-AIG2NDDY.mjs";

// src/playwright/hooks.ts
var setPreRender = /* @__PURE__ */ __name((preRender) => {
  globalThis.__sbPreRender = preRender;
}, "setPreRender");
var setPostRender = /* @__PURE__ */ __name((postRender) => {
  globalThis.__sbPostRender = postRender;
}, "setPostRender");
var getStoryContext = /* @__PURE__ */ __name(async (page, context) => {
  return page.evaluate(({ storyId }) => globalThis.__getContext(storyId), {
    storyId: context.id
  });
}, "getStoryContext");

export {
  setPreRender,
  setPostRender,
  getStoryContext
};
