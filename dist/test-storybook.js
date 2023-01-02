#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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

// src/test-storybook.ts
var import_child_process = require("child_process");
var import_node_fetch = __toESM(require("node-fetch"));
var import_can_bind_to_host = __toESM(require("can-bind-to-host"));
var import_fs = __toESM(require("fs"));
var import_ts_dedent3 = __toESM(require("ts-dedent"));
var import_path3 = __toESM(require("path"));
var import_tempy = __toESM(require("tempy"));

// src/util/getParsedCliOptions.ts
var getParsedCliOptions = /* @__PURE__ */ __name(() => {
  const { program: program2 } = require("commander");
  program2.option("-i, --index-json", "Run in index json mode. Automatically detected (requires a compatible Storybook)").option("-s, --stories-json", "Run in index json mode. Automatically detected (requires a compatible Storybook) [deprecated, use --index-json]").option("--no-index-json", "Disable index json mode").option("--no-stories-json", "Disable index json mode [deprecated, use --no-index-json]").option("-c, --config-dir <directory>", "Directory where to load Storybook configurations from", ".storybook").option("--watch", "Watch files for changes and rerun tests related to changed files", false).option("--watchAll", "Watch files for changes and rerun all tests when something changes").option("--browsers <browsers...>", "Define browsers to run tests in. Could be one or multiple of: chromium, firefox, webkit", [
    "chromium"
  ]).option("--url <url>", "Define the URL to run tests in. Useful for custom Storybook URLs", "http://localhost:6006").option("--maxWorkers <amount>", "Specifies the maximum number of workers the worker-pool will spawn for running tests").option("--no-cache", "Disable the cache").option("--clearCache", "Deletes the Jest cache directory and then exits without running tests").option("--verbose", "Display individual test results with the test suite hierarchy").option("-u, --updateSnapshot", "Use this flag to re-record every snapshot that fails during this test run").option("--json", "Prints the test results in JSON. This mode will send all other test output and user messages to stderr.").option("--outputFile", "Write test results to a file when the --json option is also specified.").option("--coverage", "Indicates that test coverage information should be collected and reported in the output").option("--junit", "Indicates that test information should be reported in a junit file").option("--eject", "Creates a local configuration file to override defaults of the test-runner. Use it only if you want to have better control over the runner configurations").option("--ci", "Instead of the regular behavior of storing a new snapshot automatically, it will fail the test and require to be run with --updateSnapshot.");
  program2.exitOverride();
  try {
    program2.parse();
  } catch (err) {
    switch (err.code) {
      case "commander.unknownOption": {
        program2.outputHelp();
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
  const { storiesJson, ...options } = program2.opts();
  return {
    options: {
      indexJson: storiesJson,
      ...options
    },
    extraArgs: program2.args
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

// src/util/getStorybookMetadata.ts
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
  const workingDir = (0, import_path2.resolve)();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;
  const main2 = getStorybookMain(configDir);
  const normalizedStoriesEntries = (0, import_core_common2.normalizeStories)(main2.stories, {
    configDir,
    workingDir
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher)
  }));
  const storiesPaths = normalizedStoriesEntries.map((entry) => entry.directory + "/" + entry.files).map((dir) => "<rootDir>/" + (0, import_path2.relative)(workingDir, dir)).join(";");
  const lazyCompilation = !!main2?.core?.builder?.options?.lazyCompilation;
  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation
  };
}, "getStorybookMetadata");

// src/playwright/transformPlaywrightJson.ts
var t2 = __toESM(require("@babel/types"));
var import_generator2 = __toESM(require("@babel/generator"));
var import_csf2 = require("@storybook/csf");

// src/playwright/transformPlaywright.ts
var import_template = __toESM(require("@babel/template"));

// src/util/getTestRunnerConfig.ts
var import_core_common3 = require("@storybook/core-common");

// src/csf/transformCsf.ts
var import_csf_tools = require("@storybook/csf-tools");
var t = __toESM(require("@babel/types"));
var import_generator = __toESM(require("@babel/generator"));
var import_csf = require("@storybook/csf");
var import_ts_dedent = __toESM(require("ts-dedent"));

// src/playwright/transformPlaywright.ts
var import_ts_dedent2 = __toESM(require("ts-dedent"));
var coverageErrorMessage = import_ts_dedent2.default`
  [Test runner] An error occurred when evaluating code coverage:
  The code in this story is not instrumented, which means the coverage setup is likely not correct.
  More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage
`;
var testPrefixer = (0, import_template.default)(`
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      const testFn = async() => {
        const context = { id: %%id%%, title: %%title%%, name: %%name%% };

        page.on('pageerror', (err) => {
          page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
        });

        if(globalThis.__sbPreRender) {
          await globalThis.__sbPreRender(page, context);
        }

        const result = await page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
          id: %%id%%,
        });
  
        if(globalThis.__sbPostRender) {
          await globalThis.__sbPostRender(page, context);
        }

        if(globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(\`${coverageErrorMessage}\`);
          }

          await jestPlaywright.saveCoverage(page);
        }

        return result;
      };

      try {
        await testFn();
      } catch(err) {
        if(err.toString().includes('Execution context was destroyed')) {
          console.log(\`An error occurred in the following story, most likely because of a navigation: "\${%%title%%}/\${%%name%%}". Retrying...\`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page);
          await testFn();
        } else {
          throw err;
        }
      }
    }
  `, {
  plugins: [
    "jsx"
  ]
});

// src/playwright/transformPlaywrightJson.ts
var makeTest = /* @__PURE__ */ __name((entry) => {
  const result = testPrefixer({
    name: t2.stringLiteral(entry.name),
    title: t2.stringLiteral(entry.title),
    id: t2.stringLiteral(entry.id),
    storyExport: t2.identifier(entry.id)
  });
  const stmt = result[1];
  return t2.expressionStatement(t2.callExpression(t2.identifier("it"), [
    t2.stringLiteral("test"),
    stmt.expression
  ]));
}, "makeTest");
var makeDescribe = /* @__PURE__ */ __name((title, stmts) => {
  return t2.expressionStatement(t2.callExpression(t2.identifier("describe"), [
    t2.stringLiteral(title),
    t2.arrowFunctionExpression([], t2.blockStatement(stmts))
  ]));
}, "makeDescribe");
var isV3DocsOnly = /* @__PURE__ */ __name((stories) => stories.length === 1 && stories[0].name === "Page", "isV3DocsOnly");
function v3TitleMapToV4TitleMap(titleIdToStories) {
  return Object.fromEntries(Object.entries(titleIdToStories).map(([id, stories]) => [
    id,
    stories.map(({ parameters, ...story }) => ({
      type: isV3DocsOnly(stories) ? "docs" : "story",
      ...story
    }))
  ]));
}
__name(v3TitleMapToV4TitleMap, "v3TitleMapToV4TitleMap");
function groupByTitleId(entries) {
  return entries.reduce((acc, entry) => {
    const titleId = (0, import_csf2.toId)(entry.title);
    acc[titleId] = acc[titleId] || [];
    acc[titleId].push(entry);
    return acc;
  }, {});
}
__name(groupByTitleId, "groupByTitleId");
var transformPlaywrightJson = /* @__PURE__ */ __name((index) => {
  let titleIdToEntries;
  if (index.v === 3) {
    const titleIdToStories = groupByTitleId(Object.values(index.stories));
    titleIdToEntries = v3TitleMapToV4TitleMap(titleIdToStories);
  } else if (index.v === 4) {
    titleIdToEntries = groupByTitleId(Object.values(index.entries));
  } else {
    throw new Error(`Unsupported version ${index.v}`);
  }
  const titleIdToTest = Object.entries(titleIdToEntries).reduce((acc, [titleId, entries]) => {
    const stories = entries.filter((s) => s.type !== "docs");
    if (stories.length) {
      const storyTests = stories.map((story) => makeDescribe(story.name, [
        makeTest(story)
      ]));
      const program2 = t2.program([
        makeDescribe(stories[0].title, storyTests)
      ]);
      const { code } = (0, import_generator2.default)(program2, {});
      acc[titleId] = code;
    }
    return acc;
  }, {});
  return titleIdToTest;
}, "transformPlaywrightJson");

// src/test-storybook.ts
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";
process.env.STORYBOOK_TEST_RUNNER = "true";
process.env.PUBLIC_URL = "";
process.on("unhandledRejection", (err) => {
  throw err;
});
var log = /* @__PURE__ */ __name((message) => console.log(`[test-storybook] ${message}`), "log");
var error = /* @__PURE__ */ __name((err) => {
  if (err instanceof Error) {
    console.error(`\x1B[31m[test-storybook]\x1B[0m ${err.message} 

${err.stack}`);
  } else {
    console.error(`\x1B[31m[test-storybook]\x1B[0m ${err}`);
  }
}, "error");
var indexTmpDir;
var cleanup = /* @__PURE__ */ __name(() => {
  if (indexTmpDir) {
    log(`Cleaning up ${indexTmpDir}`);
    import_fs.default.rmSync(indexTmpDir, {
      recursive: true,
      force: true
    });
  }
}, "cleanup");
var isWatchMode = false;
async function reportCoverage() {
  if (isWatchMode || process.env.STORYBOOK_COLLECT_COVERAGE !== "true") {
    return;
  }
  const coverageFolderE2E = import_path3.default.resolve(process.cwd(), ".nyc_output");
  const coverageFolder = import_path3.default.resolve(process.cwd(), "coverage/storybook");
  if (!import_fs.default.existsSync(coverageFolderE2E)) {
    return;
  }
  if (!import_fs.default.existsSync(coverageFolder)) {
    import_fs.default.mkdirSync(coverageFolder, {
      recursive: true
    });
  }
  import_fs.default.renameSync(`${coverageFolderE2E}/coverage.json`, `${coverageFolder}/coverage-storybook.json`);
  import_fs.default.rmSync(coverageFolderE2E, {
    recursive: true
  });
  (0, import_child_process.execSync)(`npx nyc report --reporter=text -t ${coverageFolder} --report-dir ${coverageFolder}`, {
    stdio: "inherit"
  });
}
__name(reportCoverage, "reportCoverage");
var onProcessEnd = /* @__PURE__ */ __name(() => {
  cleanup();
  reportCoverage();
}, "onProcessEnd");
process.on("SIGINT", onProcessEnd);
process.on("exit", onProcessEnd);
function sanitizeURL(url) {
  let finalURL = url;
  if (finalURL.indexOf("http://") === -1 && finalURL.indexOf("https://") === -1) {
    finalURL = "http://" + finalURL;
  }
  finalURL = finalURL.replace(/iframe.html\s*$/, "");
  finalURL = finalURL.replace(/index.html\s*$/, "");
  if (finalURL.slice(-1) !== "/") {
    finalURL = finalURL + "/";
  }
  return finalURL;
}
__name(sanitizeURL, "sanitizeURL");
async function executeJestPlaywright(args) {
  const jestPath = import_path3.default.dirname(require.resolve("jest", {
    paths: [
      import_path3.default.join(__dirname, "../@storybook/test-runner/node_modules")
    ]
  }));
  const jest = require(jestPath);
  let argv = args.slice(2);
  const jestConfigPath = import_fs.default.existsSync("test-runner-jest.config.js") ? "test-runner-jest.config.js" : import_path3.default.resolve(__dirname, "../playwright/test-runner-jest.config.js");
  argv.push("--config", jestConfigPath);
  await jest.run(argv);
}
__name(executeJestPlaywright, "executeJestPlaywright");
async function checkStorybook(url) {
  try {
    const res = await (0, import_node_fetch.default)(url, {
      method: "HEAD"
    });
    if (res.status !== 200)
      throw new Error(`Unxpected status: ${res.status}`);
  } catch (e) {
    console.error(import_ts_dedent3.default`\x1b[31m[test-storybook]\x1b[0m It seems that your Storybook instance is not running at: ${url}. Are you sure it's running?
      
      If you're not running Storybook on the default 6006 port or want to run the tests against any custom URL, you can pass the --url flag like so:
      
      yarn test-storybook --url http://localhost:9009
      
      More info at https://github.com/storybookjs/test-runner#getting-started`);
    process.exit(1);
  }
}
__name(checkStorybook, "checkStorybook");
async function getIndexJson(url) {
  const indexJsonUrl = new URL("index.json", url).toString();
  const storiesJsonUrl = new URL("stories.json", url).toString();
  const [indexRes, storiesRes] = await Promise.all([
    (0, import_node_fetch.default)(indexJsonUrl),
    (0, import_node_fetch.default)(storiesJsonUrl)
  ]);
  if (indexRes.ok) {
    try {
      const json = await indexRes.text();
      return JSON.parse(json);
    } catch (err) {
    }
  }
  if (storiesRes.ok) {
    try {
      const json1 = await storiesRes.text();
      return JSON.parse(json1);
    } catch (err1) {
    }
  }
  throw new Error(import_ts_dedent3.default`
    Failed to fetch index data from the project.

    Make sure that either of these URLs are available with valid data in your Storybook:
    ${storiesJsonUrl}
    ${indexJsonUrl}

    More info: https://github.com/storybookjs/test-runner/blob/main/README.md#indexjson-mode
  `);
}
__name(getIndexJson, "getIndexJson");
async function getIndexTempDir(url) {
  let tmpDir;
  try {
    const indexJson = await getIndexJson(url);
    const titleIdToTest = transformPlaywrightJson(indexJson);
    tmpDir = import_tempy.default.directory();
    Object.entries(titleIdToTest).forEach(([titleId, test]) => {
      const tmpFile = import_path3.default.join(tmpDir, `${titleId}.test.js`);
      import_fs.default.writeFileSync(tmpFile, test);
    });
  } catch (err) {
    error(err);
    process.exit(1);
  }
  return tmpDir;
}
__name(getIndexTempDir, "getIndexTempDir");
function ejectConfiguration() {
  const origin = import_path3.default.resolve(__dirname, "../playwright/test-runner-jest.config.js");
  const destination = import_path3.default.resolve("test-runner-jest.config.js");
  const fileAlreadyExists = import_fs.default.existsSync(destination);
  if (fileAlreadyExists) {
    throw new Error(import_ts_dedent3.default`Found existing file at:
    
    ${destination}
    
    Please delete it and rerun this command.
    \n`);
  }
  import_fs.default.copyFileSync(origin, destination);
  log("Configuration file successfully copied as test-runner-jest.config.js");
}
__name(ejectConfiguration, "ejectConfiguration");
var main = /* @__PURE__ */ __name(async () => {
  const { jestOptions, runnerOptions } = getCliOptions();
  if (runnerOptions.eject) {
    ejectConfiguration();
    process.exit(0);
  }
  isWatchMode = jestOptions.watch || jestOptions.watchAll;
  const rawTargetURL = process.env.TARGET_URL || runnerOptions.url || "http://localhost:6006";
  await checkStorybook(rawTargetURL);
  const targetURL = sanitizeURL(rawTargetURL);
  process.env.TARGET_URL = targetURL;
  if (runnerOptions.coverage) {
    process.env.STORYBOOK_COLLECT_COVERAGE = "true";
  }
  if (runnerOptions.junit) {
    process.env.STORYBOOK_JUNIT = "true";
  }
  if (process.env.REFERENCE_URL) {
    process.env.REFERENCE_URL = sanitizeURL(process.env.REFERENCE_URL);
  }
  if (!process.env.TEST_BROWSERS && runnerOptions.browsers) {
    if (Array.isArray(runnerOptions.browsers))
      process.env.TEST_BROWSERS = runnerOptions.browsers.join(",");
    else
      process.env.TEST_BROWSERS = runnerOptions.browsers;
  }
  const { hostname } = new URL(targetURL);
  const isLocalStorybookIp = await (0, import_can_bind_to_host.default)(hostname);
  const shouldRunIndexJson = runnerOptions.indexJson !== false && !isLocalStorybookIp;
  if (shouldRunIndexJson) {
    log("Detected a remote Storybook URL, running in index json mode. To disable this, run the command again with --no-index-json\n");
  }
  if (runnerOptions.indexJson || shouldRunIndexJson) {
    indexTmpDir = await getIndexTempDir(targetURL);
    process.env.TEST_ROOT = indexTmpDir;
    process.env.TEST_MATCH = "**/*.test.js";
  }
  process.env.STORYBOOK_CONFIG_DIR = runnerOptions.configDir;
  const { storiesPaths, lazyCompilation } = getStorybookMetadata();
  process.env.STORYBOOK_STORIES_PATTERN = storiesPaths;
  if (lazyCompilation && isLocalStorybookIp) {
    log(`You're running Storybook with lazy compilation enabled, and will likely cause issues with the test runner locally. Consider disabling 'lazyCompilation' in ${runnerOptions.configDir}/main.js when running 'test-storybook' locally.`);
  }
  await executeJestPlaywright(jestOptions);
}, "main");
main().catch((e) => {
  error(e);
  process.exit(1);
});
