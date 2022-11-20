import {
  getParsedCliOptions
} from "./chunk-TR4TBT53.mjs";
import {
  __name
} from "./chunk-2RV4EXUL.mjs";

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
var getCliOptions = /* @__PURE__ */ __name(() => {
  const { options: allOptions, extraArgs } = getParsedCliOptions();
  const defaultOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2)
  };
  const finalOptions = Object.keys(allOptions).reduce((acc, key) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      acc.runnerOptions[key] = allOptions[key];
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
    finalOptions.jestOptions.push(...extraArgs);
  }
  return finalOptions;
}, "getCliOptions");

export {
  getCliOptions
};
