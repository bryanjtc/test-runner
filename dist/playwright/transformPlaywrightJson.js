var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/playwright/transformPlaywrightJson.ts
var transformPlaywrightJson_exports = {};
__export(transformPlaywrightJson_exports, {
  transformPlaywrightJson: () => transformPlaywrightJson
});
module.exports = __toCommonJS(transformPlaywrightJson_exports);
var t2 = __toESM(require("@babel/types"));
var import_generator2 = __toESM(require("@babel/generator"));
var import_csf2 = require("@storybook/csf");

// src/playwright/transformPlaywright.ts
var import_template = __toESM(require("@babel/template"));

// src/util/getTestRunnerConfig.ts
var import_core_common = require("@storybook/core-common");

// src/util/getStorybookMain.ts
var import_core_common2 = require("@storybook/core-common");

// src/util/getStorybookMetadata.ts
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transformPlaywrightJson
});
