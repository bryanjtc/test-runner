import {
  __name
} from "./chunk-2RV4EXUL.mjs";

// src/util/getTestRunnerConfig.ts
import { join, resolve } from "path";
import { serverRequire } from "@storybook/core-common";
var testRunnerConfig;
var loaded = false;
var getTestRunnerConfig = /* @__PURE__ */ __name((configDir) => {
  if (loaded) {
    return testRunnerConfig;
  }
  testRunnerConfig = serverRequire(join(resolve(configDir), "test-runner"));
  loaded = true;
  return testRunnerConfig;
}, "getTestRunnerConfig");

export {
  getTestRunnerConfig
};
