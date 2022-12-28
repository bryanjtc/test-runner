import {
  getParsedCliOptions
} from "./chunk-7P5FXBEF.mjs";
import {
  __name
} from "./chunk-AIG2NDDY.mjs";

// src/util/getCliOptions.ts
var STORYBOOK_RUNNER_COMMANDS = [
  "indexJson",
  "configDir",
  "browsers",
  "eject",
  "url",
  "coverage",
  "junit"
];
function copyOption(obj, key, value) {
  obj[key] = value;
}
__name(copyOption, "copyOption");
var getCliOptions = /* @__PURE__ */ __name(() => {
  const { options: allOptions, extraArgs } = getParsedCliOptions();
  const defaultOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2)
  };
  const finalOptions = Object.keys(allOptions).reduce((acc, key) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      copyOption(acc.runnerOptions, key, allOptions[key]);
    } else {
      if (allOptions[key] === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (allOptions[key] === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}`, allOptions[key]);
      }
    }
    return acc;
  }, defaultOptions);
  if (extraArgs.length) {
    finalOptions.jestOptions.push(...[
      extraArgs
    ]);
  }
  return finalOptions;
}, "getCliOptions");

export {
  getCliOptions
};
