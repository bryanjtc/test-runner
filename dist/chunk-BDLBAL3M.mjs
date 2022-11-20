import {
  getStorybookMain
} from "./chunk-BZ454Q7N.mjs";
import {
  __name,
  __spreadProps,
  __spreadValues
} from "./chunk-2RV4EXUL.mjs";

// src/util/getStorybookMetadata.ts
import { relative, resolve } from "path";
import { normalizeStories } from "@storybook/core-common";
var getStorybookMetadata = /* @__PURE__ */ __name(() => {
  var _a, _b, _c;
  const workingDir = resolve();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;
  const main = getStorybookMain(configDir);
  const normalizedStoriesEntries = normalizeStories(main.stories, {
    configDir,
    workingDir
  }).map((specifier) => __spreadProps(__spreadValues({}, specifier), {
    importPathMatcher: new RegExp(specifier.importPathMatcher)
  }));
  const storiesPaths = normalizedStoriesEntries.map((entry) => entry.directory + "/" + entry.files).map((dir) => "<rootDir>/" + relative(workingDir, dir)).join(";");
  const lazyCompilation = !!((_c = (_b = (_a = main == null ? void 0 : main.core) == null ? void 0 : _a.builder) == null ? void 0 : _b.options) == null ? void 0 : _c.lazyCompilation);
  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation
  };
}, "getStorybookMetadata");

export {
  getStorybookMetadata
};
