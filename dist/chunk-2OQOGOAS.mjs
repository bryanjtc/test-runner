import {
  __name,
  __require
} from "./chunk-AIG2NDDY.mjs";

// src/config/jest-playwright.ts
import path from "path";
var getJestPlaywrightConfig = /* @__PURE__ */ __name(() => {
  const presetBasePath = path.dirname(__require.resolve("jest-playwright-preset", {
    paths: [
      path.join(__dirname, "../node_modules")
    ]
  }));
  const expectPlaywrightPath = path.dirname(__require.resolve("expect-playwright", {
    paths: [
      path.join(__dirname, "../node_modules")
    ]
  }));
  return {
    runner: path.join(presetBasePath, "runner.js"),
    globalSetup: "@storybook/test-runner/playwright/global-setup.js",
    globalTeardown: "@storybook/test-runner/playwright/global-teardown.js",
    testEnvironment: "@storybook/test-runner/playwright/custom-environment.js",
    setupFilesAfterEnv: [
      "@storybook/test-runner/playwright/jest-setup.js",
      expectPlaywrightPath,
      path.join(presetBasePath, "lib", "extends.js")
    ]
  };
}, "getJestPlaywrightConfig");
var getJestConfig = /* @__PURE__ */ __name(() => {
  const { TEST_ROOT, TEST_MATCH, STORYBOOK_STORIES_PATTERN, TEST_BROWSERS, STORYBOOK_COLLECT_COVERAGE, STORYBOOK_JUNIT } = process.env;
  const jestJunitPath = path.dirname(__require.resolve("jest-junit", {
    paths: [
      path.join(__dirname, "../node_modules")
    ]
  }));
  const jestSerializerHtmlPath = path.dirname(__require.resolve("jest-serializer-html", {
    paths: [
      path.join(__dirname, "../node_modules")
    ]
  }));
  const swcJestPath = path.dirname(__require.resolve("@swc/jest", {
    paths: [
      path.join(__dirname, "../node_modules")
    ]
  }));
  const reporters = STORYBOOK_JUNIT ? [
    "default",
    jestJunitPath
  ] : [
    "default"
  ];
  let config = {
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
      __require.resolve("jest-watch-typeahead/filename"),
      __require.resolve("jest-watch-typeahead/testname")
    ],
    watchPathIgnorePatterns: [
      "coverage",
      ".nyc_output",
      ".cache"
    ],
    ...getJestPlaywrightConfig()
  };
  if (TEST_MATCH) {
    config.testMatch = [
      TEST_MATCH
    ];
  }
  return config;
}, "getJestConfig");

export {
  getJestConfig
};
