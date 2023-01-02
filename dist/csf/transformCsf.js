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

// src/csf/transformCsf.ts
var transformCsf_exports = {};
__export(transformCsf_exports, {
  transformCsf: () => transformCsf
});
module.exports = __toCommonJS(transformCsf_exports);
var import_csf_tools = require("@storybook/csf-tools");
var t = __toESM(require("@babel/types"));
var import_generator = __toESM(require("@babel/generator"));
var import_csf = require("@storybook/csf");
var import_ts_dedent = __toESM(require("ts-dedent"));
var prefixFunction = /* @__PURE__ */ __name((key, title, input, testPrefixer) => {
  const name = (0, import_csf.storyNameFromExport)(key);
  const context = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name),
    title: t.stringLiteral(title),
    id: t.stringLiteral((0, import_csf.toId)(title, name))
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
  const csf = (0, import_csf_tools.loadCsf)(code, {
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
    const { code: describeCode } = (0, import_generator.default)(describe, {});
    result = import_ts_dedent.default`
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transformCsf
});
