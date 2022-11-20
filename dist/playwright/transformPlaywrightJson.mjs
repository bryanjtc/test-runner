import {
  testPrefixer
} from "../chunk-7PHEBI6W.mjs";
import "../chunk-EJBUYBQQ.mjs";
import "../chunk-3PCGZATC.mjs";
import "../chunk-TR4TBT53.mjs";
import "../chunk-BDLBAL3M.mjs";
import "../chunk-BZ454Q7N.mjs";
import "../chunk-X55CJN5W.mjs";
import "../chunk-6J2TR5JU.mjs";
import {
  require_lib2 as require_lib,
  require_lib3 as require_lib2
} from "../chunk-JVSXUXAE.mjs";
import "../chunk-ICZWPBDQ.mjs";
import {
  __name,
  __objRest,
  __spreadValues,
  __toESM
} from "../chunk-2RV4EXUL.mjs";

// src/playwright/transformPlaywrightJson.ts
var t = __toESM(require_lib());
var import_generator = __toESM(require_lib2());
import { toId } from "@storybook/csf";
var makeTest = /* @__PURE__ */ __name((entry) => {
  const result = testPrefixer({
    name: t.stringLiteral(entry.name),
    title: t.stringLiteral(entry.title),
    id: t.stringLiteral(entry.id),
    storyExport: t.identifier(entry.id)
  });
  const stmt = result[1];
  return t.expressionStatement(t.callExpression(t.identifier("it"), [
    t.stringLiteral("test"),
    stmt.expression
  ]));
}, "makeTest");
var makeDescribe = /* @__PURE__ */ __name((title, stmts) => {
  return t.expressionStatement(t.callExpression(t.identifier("describe"), [
    t.stringLiteral(title),
    t.arrowFunctionExpression([], t.blockStatement(stmts))
  ]));
}, "makeDescribe");
var isV3DocsOnly = /* @__PURE__ */ __name((stories) => stories.length === 1 && stories[0].name === "Page", "isV3DocsOnly");
function v3TitleMapToV4TitleMap(titleIdToStories) {
  return Object.fromEntries(Object.entries(titleIdToStories).map(([id, stories]) => [
    id,
    stories.map((_a) => {
      var _b = _a, { parameters } = _b, story = __objRest(_b, ["parameters"]);
      return __spreadValues({
        type: isV3DocsOnly(stories) ? "docs" : "story"
      }, story);
    })
  ]));
}
__name(v3TitleMapToV4TitleMap, "v3TitleMapToV4TitleMap");
function groupByTitleId(entries) {
  return entries.reduce((acc, entry) => {
    const titleId = toId(entry.title);
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
      const program2 = t.program([
        makeDescribe(stories[0].title, storyTests)
      ]);
      const { code } = (0, import_generator.default)(program2, {});
      acc[titleId] = code;
    }
    return acc;
  }, {});
  return titleIdToTest;
}, "transformPlaywrightJson");
export {
  transformPlaywrightJson
};
