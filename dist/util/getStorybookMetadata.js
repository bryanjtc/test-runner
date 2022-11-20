var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/util/getStorybookMetadata.ts
var getStorybookMetadata_exports = {};
__export(getStorybookMetadata_exports, {
  getStorybookMetadata: () => getStorybookMetadata
});
module.exports = __toCommonJS(getStorybookMetadata_exports);
var import_path2 = require("path");
var import_core_common2 = require("@storybook/core-common");

// src/util/getStorybookMain.ts
var import_path = require("path");
var import_core_common = require("@storybook/core-common");
var storybookMainConfig;
var getStorybookMain = /* @__PURE__ */ __name((configDir) => {
  if (storybookMainConfig) {
    return storybookMainConfig;
  }
  storybookMainConfig = (0, import_core_common.serverRequire)((0, import_path.join)((0, import_path.resolve)(configDir), "main"));
  if (!storybookMainConfig) {
    throw new Error(`Could not load main.js in ${configDir}. Is the config directory correct? You can change it by using --config-dir <path-to-dir>`);
  }
  return storybookMainConfig;
}, "getStorybookMain");

// src/util/getStorybookMetadata.ts
var getStorybookMetadata = /* @__PURE__ */ __name(() => {
  var _a, _b, _c;
  const workingDir = (0, import_path2.resolve)();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;
  const main = getStorybookMain(configDir);
  const normalizedStoriesEntries = (0, import_core_common2.normalizeStories)(main.stories, {
    configDir,
    workingDir
  }).map((specifier) => __spreadProps(__spreadValues({}, specifier), {
    importPathMatcher: new RegExp(specifier.importPathMatcher)
  }));
  const storiesPaths = normalizedStoriesEntries.map((entry) => entry.directory + "/" + entry.files).map((dir) => "<rootDir>/" + (0, import_path2.relative)(workingDir, dir)).join(";");
  const lazyCompilation = !!((_c = (_b = (_a = main == null ? void 0 : main.core) == null ? void 0 : _a.builder) == null ? void 0 : _b.options) == null ? void 0 : _c.lazyCompilation);
  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation
  };
}, "getStorybookMetadata");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStorybookMetadata
});
