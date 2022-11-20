var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/jest-playwright.ts
var jest_playwright_exports = {};
__export(jest_playwright_exports, {
  getJestConfig: () => getJestConfig
});
module.exports = __toCommonJS(jest_playwright_exports);
var import_path = __toESM(require("path"));
var getJestPlaywrightConfig = /* @__PURE__ */ __name(() => {
  const presetBasePath = import_path.default.dirname(require.resolve("jest-playwright-preset", {
    paths: [
      import_path.default.join(__dirname, "../node_modules")
    ]
  }));
  const expectPlaywrightPath = import_path.default.dirname(require.resolve("expect-playwright", {
    paths: [
      import_path.default.join(__dirname, "../node_modules")
    ]
  }));
  return {
    runner: import_path.default.join(presetBasePath, "runner.js"),
    globalSetup: "@storybook/test-runner/playwright/global-setup.js",
    globalTeardown: "@storybook/test-runner/playwright/global-teardown.js",
    testEnvironment: "@storybook/test-runner/playwright/custom-environment.js",
    setupFilesAfterEnv: [
      "@storybook/test-runner/playwright/jest-setup.js",
      expectPlaywrightPath,
      import_path.default.join(presetBasePath, "lib", "extends.js")
    ]
  };
}, "getJestPlaywrightConfig");
var getJestConfig = /* @__PURE__ */ __name(() => {
  const { TEST_ROOT, TEST_MATCH, STORYBOOK_STORIES_PATTERN, TEST_BROWSERS, STORYBOOK_COLLECT_COVERAGE, STORYBOOK_JUNIT } = process.env;
  const jestJunitPath = import_path.default.dirname(require.resolve("jest-junit", {
    paths: [
      import_path.default.join(__dirname, "../node_modules")
    ]
  }));
  const jestSerializerHtmlPath = import_path.default.dirname(require.resolve("jest-serializer-html", {
    paths: [
      import_path.default.join(__dirname, "../node_modules")
    ]
  }));
  const swcJestPath = import_path.default.dirname(require.resolve("@swc/jest", {
    paths: [
      import_path.default.join(__dirname, "../node_modules")
    ]
  }));
  const reporters = STORYBOOK_JUNIT ? [
    "default",
    jestJunitPath
  ] : [
    "default"
  ];
  let config = __spreadValues({
    rootDir: process.cwd(),
    roots: TEST_ROOT ? [
      TEST_ROOT
    ] : void 0,
    reporters,
    testMatch: STORYBOOK_STORIES_PATTERN && STORYBOOK_STORIES_PATTERN.split(";"),
    transform: {
      "^.+\\.stories\\.[jt]sx?$": "@storybook/test-runner/playwright/transform",
      "^.+\\.[jt]sx?$": swcJestPath
    },
    snapshotSerializers: [
      jestSerializerHtmlPath
    ],
    testEnvironmentOptions: {
      "jest-playwright": {
        browsers: TEST_BROWSERS.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean),
        collectCoverage: STORYBOOK_COLLECT_COVERAGE === "true"
      }
    },
    watchPlugins: [
      require.resolve("jest-watch-typeahead/filename"),
      require.resolve("jest-watch-typeahead/testname")
    ],
    watchPathIgnorePatterns: [
      "coverage",
      ".nyc_output",
      ".cache"
    ]
  }, getJestPlaywrightConfig());
  if (TEST_MATCH) {
    config.testMatch = [
      TEST_MATCH
    ];
  }
  return config;
}, "getJestConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getJestConfig
});
