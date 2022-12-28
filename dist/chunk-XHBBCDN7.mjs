import {
  getStorybookMain
} from "./chunk-Z7JFROLK.mjs";
import {
  __name
} from "./chunk-AIG2NDDY.mjs";

// src/util/getStorybookMetadata.ts
import { relative, resolve } from "path";
import { normalizeStories } from "@storybook/core-common";
var getStorybookMetadata = /* @__PURE__ */ __name(() => {
  const workingDir = resolve();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;
  const main = getStorybookMain(configDir);
  const normalizedStoriesEntries = normalizeStories(main.stories, {
    configDir,
    workingDir
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher)
  }));
  const storiesPaths = normalizedStoriesEntries.map((entry) => entry.directory + "/" + entry.files).map((dir) => "<rootDir>/" + relative(workingDir, dir)).join(";");
  const lazyCompilation = !!main?.core?.builder?.options?.lazyCompilation;
  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation
  };
}, "getStorybookMetadata");

export {
  getStorybookMetadata
};
