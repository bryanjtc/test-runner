import {
  __name
} from "./chunk-AIG2NDDY.mjs";

// src/csf/transformCsf.ts
import { loadCsf } from "@storybook/csf-tools";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { toId, storyNameFromExport } from "@storybook/csf";
import dedent from "ts-dedent";
var prefixFunction = /* @__PURE__ */ __name((key, title, input, testPrefixer) => {
  const name = storyNameFromExport(key);
  const context = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name),
    title: t.stringLiteral(title),
    id: t.stringLiteral(toId(title, name))
  };
  const result = makeArray(testPrefixer(context));
  const stmt = result[1];
  return stmt.expression;
}, "prefixFunction");
var makePlayTest = /* @__PURE__ */ __name((key, title, metaOrStoryPlay, testPrefix) => {
  return [
    t.expressionStatement(t.callExpression(t.identifier("it"), [
      t.stringLiteral(!!metaOrStoryPlay ? "play-test" : "smoke-test"),
      prefixFunction(key, title, metaOrStoryPlay, testPrefix)
    ]))
  ];
}, "makePlayTest");
var makeDescribe = /* @__PURE__ */ __name((key, tests, beforeEachBlock) => {
  const blockStatements = beforeEachBlock ? [
    beforeEachBlock,
    ...tests
  ] : tests;
  return t.expressionStatement(t.callExpression(t.identifier("describe"), [
    t.stringLiteral(key),
    t.arrowFunctionExpression([], t.blockStatement(blockStatements))
  ]));
}, "makeDescribe");
var makeBeforeEach = /* @__PURE__ */ __name((beforeEachPrefixer) => {
  const stmt = beforeEachPrefixer();
  return t.expressionStatement(t.callExpression(t.identifier("beforeEach"), [
    stmt.expression
  ]));
}, "makeBeforeEach");
var makeArray = /* @__PURE__ */ __name((templateResult) => Array.isArray(templateResult) ? templateResult : [
  templateResult
], "makeArray");
var transformCsf = /* @__PURE__ */ __name((code, { clearBody = false, testPrefixer, beforeEachPrefixer, insertTestIfEmpty, makeTitle } = {}) => {
  const csf = loadCsf(code, {
    makeTitle
  });
  csf.parse();
  const storyExports = Object.keys(csf._stories);
  const title = csf.meta.title;
  const storyPlays = storyExports.reduce((acc, key) => {
    const annotations = csf._storyAnnotations[key];
    if (annotations?.play) {
      acc[key] = annotations.play;
    }
    return acc;
  }, {});
  const playTests = storyExports.map((key) => {
    let tests = [];
    tests = [
      ...tests,
      ...makePlayTest(key, title, storyPlays[key], testPrefixer)
    ];
    if (tests.length) {
      return makeDescribe(key, tests);
    }
    return null;
  }).filter(Boolean);
  const allTests = playTests;
  let result = "";
  if (!clearBody)
    result = `${result}${code}
`;
  if (allTests.length) {
    const describe = makeDescribe(csf.meta.title, allTests, beforeEachPrefixer ? makeBeforeEach(beforeEachPrefixer) : void 0);
    const { code: describeCode } = generate(describe, {});
    result = dedent`
      ${result}
      if (!require.main) {
        ${describeCode}
      }
    `;
  } else if (insertTestIfEmpty) {
    result = `describe('${csf.meta.title}', () => { it('no-op', () => {}) });`;
  }
  return result;
}, "transformCsf");

export {
  transformCsf
};
