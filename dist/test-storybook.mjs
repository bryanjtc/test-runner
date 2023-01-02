#!/usr/bin/env node
import {
  transformPlaywrightJson
} from "./chunk-OERBPGCN.mjs";
import "./chunk-TFZNTRD5.mjs";
import "./chunk-EJBUYBQQ.mjs";
import {
  getCliOptions
} from "./chunk-GF2YUQZN.mjs";
import "./chunk-DZYMMINJ.mjs";
import {
  getStorybookMetadata
} from "./chunk-XHBBCDN7.mjs";
import "./chunk-Z7JFROLK.mjs";
import "./chunk-VFZNZQRC.mjs";
import "./chunk-UOPJUKPN.mjs";
import {
  __name,
  __require
} from "./chunk-AIG2NDDY.mjs";

// src/test-storybook.ts
import { execSync } from "child_process";
import fetch from "node-fetch";
import canBindToHost from "can-bind-to-host";
import fs from "fs";
import dedent from "ts-dedent";
import path from "path";
import tempy from "tempy";
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
    fs.rmSync(indexTmpDir, {
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
  const coverageFolderE2E = path.resolve(process.cwd(), ".nyc_output");
  const coverageFolder = path.resolve(process.cwd(), "coverage/storybook");
  if (!fs.existsSync(coverageFolderE2E)) {
    return;
  }
  if (!fs.existsSync(coverageFolder)) {
    fs.mkdirSync(coverageFolder, {
      recursive: true
    });
  }
  fs.renameSync(`${coverageFolderE2E}/coverage.json`, `${coverageFolder}/coverage-storybook.json`);
  fs.rmSync(coverageFolderE2E, {
    recursive: true
  });
  execSync(`npx nyc report --reporter=text -t ${coverageFolder} --report-dir ${coverageFolder}`, {
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
  const jestPath = path.dirname(__require.resolve("jest", {
    paths: [
      path.join(__dirname, "../@storybook/test-runner/node_modules")
    ]
  }));
  const jest = __require(jestPath);
  let argv = args.slice(2);
  const jestConfigPath = fs.existsSync("test-runner-jest.config.js") ? "test-runner-jest.config.js" : path.resolve(__dirname, "../playwright/test-runner-jest.config.js");
  argv.push("--config", jestConfigPath);
  await jest.run(argv);
}
__name(executeJestPlaywright, "executeJestPlaywright");
async function checkStorybook(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD"
    });
    if (res.status !== 200)
      throw new Error(`Unxpected status: ${res.status}`);
  } catch (e) {
    console.error(dedent`\x1b[31m[test-storybook]\x1b[0m It seems that your Storybook instance is not running at: ${url}. Are you sure it's running?
      
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
    fetch(indexJsonUrl),
    fetch(storiesJsonUrl)
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
  throw new Error(dedent`
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
    tmpDir = tempy.directory();
    Object.entries(titleIdToTest).forEach(([titleId, test]) => {
      const tmpFile = path.join(tmpDir, `${titleId}.test.js`);
      fs.writeFileSync(tmpFile, test);
    });
  } catch (err) {
    error(err);
    process.exit(1);
  }
  return tmpDir;
}
__name(getIndexTempDir, "getIndexTempDir");
function ejectConfiguration() {
  const origin = path.resolve(__dirname, "../playwright/test-runner-jest.config.js");
  const destination = path.resolve("test-runner-jest.config.js");
  const fileAlreadyExists = fs.existsSync(destination);
  if (fileAlreadyExists) {
    throw new Error(dedent`Found existing file at:
    
    ${destination}
    
    Please delete it and rerun this command.
    \n`);
  }
  fs.copyFileSync(origin, destination);
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
  const isLocalStorybookIp = await canBindToHost(hostname);
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
