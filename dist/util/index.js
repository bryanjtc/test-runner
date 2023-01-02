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

// src/util/index.ts
var util_exports = {};
__export(util_exports, {
  getCliOptions: () => getCliOptions,
  getParsedCliOptions: () => getParsedCliOptions,
  getStorybookMain: () => getStorybookMain,
  getStorybookMetadata: () => getStorybookMetadata,
  getTestRunnerConfig: () => getTestRunnerConfig
});
module.exports = __toCommonJS(util_exports);

// src/util/getParsedCliOptions.ts
var getParsedCliOptions = /* @__PURE__ */ __name(() => {
  const { program } = require("commander");
  program.option("-i, --index-json", "Run in index json mode. Automatically detected (requires a compatible Storybook)").option("-s, --stories-json", "Run in index json mode. Automatically detected (requires a compatible Storybook) [deprecated, use --index-json]").option("--no-index-json", "Disable index json mode").option("--no-stories-json", "Disable index json mode [deprecated, use --no-index-json]").option("-c, --config-dir <directory>", "Directory where to load Storybook configurations from", ".storybook").option("--watch", "Watch files for changes and rerun tests related to changed files", false).option("--watchAll", "Watch files for changes and rerun all tests when something changes").option("--browsers <browsers...>", "Define browsers to run tests in. Could be one or multiple of: chromium, firefox, webkit", [
    "chromium"
  ]).option("--url <url>", "Define the URL to run tests in. Useful for custom Storybook URLs", "http://localhost:6006").option("--maxWorkers <amount>", "Specifies the maximum number of workers the worker-pool will spawn for running tests").option("--no-cache", "Disable the cache").option("--clearCache", "Deletes the Jest cache directory and then exits without running tests").option("--verbose", "Display individual test results with the test suite hierarchy").option("-u, --updateSnapshot", "Use this flag to re-record every snapshot that fails during this test run").option("--json", "Prints the test results in JSON. This mode will send all other test output and user messages to stderr.").option("--outputFile", "Write test results to a file when the --json option is also specified.").option("--coverage", "Indicates that test coverage information should be collected and reported in the output").option("--junit", "Indicates that test information should be reported in a junit file").option("--eject", "Creates a local configuration file to override defaults of the test-runner. Use it only if you want to have better control over the runner configurations").option("--ci", "Instead of the regular behavior of storing a new snapshot automatically, it will fail the test and require to be run with --updateSnapshot.");
  program.exitOverride();
  try {
    program.parse();
  } catch (err) {
    switch (err.code) {
      case "commander.unknownOption": {
        program.outputHelp();
        console.warn(`
If you'd like this option to be supported, please open an issue at https://github.com/storybookjs/test-runner/issues/new
`);
        process.exit(1);
      }
      case "commander.helpDisplayed": {
        process.exit(0);
      }
      default: {
        throw err;
      }
    }
  }
  const { storiesJson, ...options } = program.opts();
  return {
    options: {
      indexJson: storiesJson,
      ...options
    },
    extraArgs: program.args
  };
}, "getParsedCliOptions");

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

// src/util/getTestRunnerConfig.ts
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

// src/util/getStorybookMain.ts
var import_path2 = require("path");
var import_core_common2 = require("@storybook/core-common");
var storybookMainConfig;
var getStorybookMain = /* @__PURE__ */ __name((configDir) => {
  if (storybookMainConfig) {
    return storybookMainConfig;
  }
  storybookMainConfig = (0, import_core_common2.serverRequire)((0, import_path2.join)((0, import_path2.resolve)(configDir), "main"));
  if (!storybookMainConfig) {
    throw new Error(`Could not load main.js in ${configDir}. Is the config directory correct? You can change it by using --config-dir <path-to-dir>`);
  }
  return storybookMainConfig;
}, "getStorybookMain");

// src/util/getStorybookMetadata.ts
var import_path3 = require("path");
var import_core_common3 = require("@storybook/core-common");
var getStorybookMetadata = /* @__PURE__ */ __name(() => {
  const workingDir = (0, import_path3.resolve)();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;
  const main = getStorybookMain(configDir);
  const normalizedStoriesEntries = (0, import_core_common3.normalizeStories)(main.stories, {
    configDir,
    workingDir
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher)
  }));
  const storiesPaths = normalizedStoriesEntries.map((entry) => entry.directory + "/" + entry.files).map((dir) => "<rootDir>/" + (0, import_path3.relative)(workingDir, dir)).join(";");
  const lazyCompilation = !!main?.core?.builder?.options?.lazyCompilation;
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
  getCliOptions,
  getParsedCliOptions,
  getStorybookMain,
  getStorybookMetadata,
  getTestRunnerConfig
});
