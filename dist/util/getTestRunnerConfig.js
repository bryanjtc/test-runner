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

// src/util/getTestRunnerConfig.ts
var getTestRunnerConfig_exports = {};
__export(getTestRunnerConfig_exports, {
  getTestRunnerConfig: () => getTestRunnerConfig
});
module.exports = __toCommonJS(getTestRunnerConfig_exports);
var import_path = require("path");
var import_core_common = require("@storybook/core-common");
var testRunnerConfig;
var loaded = false;
var getTestRunnerConfig = /* @__PURE__ */ __name((configDir) => {
  if (loaded) {
    return testRunnerConfig;
  }
  testRunnerConfig = (0, import_core_common.serverRequire)((0, import_path.join)((0, import_path.resolve)(configDir), "test-runner"));
  loaded = true;
  return testRunnerConfig;
}, "getTestRunnerConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTestRunnerConfig
});