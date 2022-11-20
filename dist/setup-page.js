var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/p-try/index.js
var require_p_try = __commonJS({
  "node_modules/p-try/index.js"(exports, module2) {
    "use strict";
    var pTry = /* @__PURE__ */ __name((fn, ...arguments_) => new Promise((resolve) => {
      resolve(fn(...arguments_));
    }), "pTry");
    module2.exports = pTry;
    module2.exports.default = pTry;
  }
});

// node_modules/p-locate/node_modules/p-limit/index.js
var require_p_limit = __commonJS({
  "node_modules/p-locate/node_modules/p-limit/index.js"(exports, module2) {
    "use strict";
    var pTry = require_p_try();
    var pLimit = /* @__PURE__ */ __name((concurrency) => {
      if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
        return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
      }
      const queue = [];
      let activeCount = 0;
      const next = /* @__PURE__ */ __name(() => {
        activeCount--;
        if (queue.length > 0) {
          queue.shift()();
        }
      }, "next");
      const run = /* @__PURE__ */ __name((fn, resolve, ...args) => {
        activeCount++;
        const result = pTry(fn, ...args);
        resolve(result);
        result.then(next, next);
      }, "run");
      const enqueue = /* @__PURE__ */ __name((fn, resolve, ...args) => {
        if (activeCount < concurrency) {
          run(fn, resolve, ...args);
        } else {
          queue.push(run.bind(null, fn, resolve, ...args));
        }
      }, "enqueue");
      const generator = /* @__PURE__ */ __name((fn, ...args) => new Promise((resolve) => enqueue(fn, resolve, ...args)), "generator");
      Object.defineProperties(generator, {
        activeCount: {
          get: () => activeCount
        },
        pendingCount: {
          get: () => queue.length
        },
        clearQueue: {
          value: () => {
            queue.length = 0;
          }
        }
      });
      return generator;
    }, "pLimit");
    module2.exports = pLimit;
    module2.exports.default = pLimit;
  }
});

// node_modules/p-locate/index.js
var require_p_locate = __commonJS({
  "node_modules/p-locate/index.js"(exports, module2) {
    "use strict";
    var pLimit = require_p_limit();
    var EndError = /* @__PURE__ */ __name(class EndError extends Error {
      constructor(value) {
        super();
        this.value = value;
      }
    }, "EndError");
    var testElement = /* @__PURE__ */ __name((element, tester) => __async(exports, null, function* () {
      return tester(yield element);
    }), "testElement");
    var finder = /* @__PURE__ */ __name((element) => __async(exports, null, function* () {
      const values = yield Promise.all(element);
      if (values[1] === true) {
        throw new EndError(values[0]);
      }
      return false;
    }), "finder");
    var pLocate = /* @__PURE__ */ __name((iterable, tester, options) => __async(exports, null, function* () {
      options = __spreadValues({
        concurrency: Infinity,
        preserveOrder: true
      }, options);
      const limit = pLimit(options.concurrency);
      const items = [
        ...iterable
      ].map((element) => [
        element,
        limit(testElement, element, tester)
      ]);
      const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);
      try {
        yield Promise.all(items.map((element) => checkLimit(finder, element)));
      } catch (error) {
        if (error instanceof EndError) {
          return error.value;
        }
        throw error;
      }
    }), "pLocate");
    module2.exports = pLocate;
    module2.exports.default = pLocate;
  }
});

// node_modules/locate-path/index.js
var require_locate_path = __commonJS({
  "node_modules/locate-path/index.js"(exports, module2) {
    "use strict";
    var path = require("path");
    var fs = require("fs");
    var { promisify } = require("util");
    var pLocate = require_p_locate();
    var fsStat = promisify(fs.stat);
    var fsLStat = promisify(fs.lstat);
    var typeMappings = {
      directory: "isDirectory",
      file: "isFile"
    };
    function checkType({ type }) {
      if (type in typeMappings) {
        return;
      }
      throw new Error(`Invalid type specified: ${type}`);
    }
    __name(checkType, "checkType");
    var matchType = /* @__PURE__ */ __name((type, stat) => type === void 0 || stat[typeMappings[type]](), "matchType");
    module2.exports = (paths, options) => __async(exports, null, function* () {
      options = __spreadValues({
        cwd: process.cwd(),
        type: "file",
        allowSymlinks: true
      }, options);
      checkType(options);
      const statFn = options.allowSymlinks ? fsStat : fsLStat;
      return pLocate(paths, (path_) => __async(exports, null, function* () {
        try {
          const stat = yield statFn(path.resolve(options.cwd, path_));
          return matchType(options.type, stat);
        } catch (_) {
          return false;
        }
      }), options);
    });
    module2.exports.sync = (paths, options) => {
      options = __spreadValues({
        cwd: process.cwd(),
        allowSymlinks: true,
        type: "file"
      }, options);
      checkType(options);
      const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync;
      for (const path_ of paths) {
        try {
          const stat = statFn(path.resolve(options.cwd, path_));
          if (matchType(options.type, stat)) {
            return path_;
          }
        } catch (_) {
        }
      }
    };
  }
});

// node_modules/find-up/node_modules/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/find-up/node_modules/path-exists/index.js"(exports, module2) {
    "use strict";
    var fs = require("fs");
    var { promisify } = require("util");
    var pAccess = promisify(fs.access);
    module2.exports = (path) => __async(exports, null, function* () {
      try {
        yield pAccess(path);
        return true;
      } catch (_) {
        return false;
      }
    });
    module2.exports.sync = (path) => {
      try {
        fs.accessSync(path);
        return true;
      } catch (_) {
        return false;
      }
    };
  }
});

// node_modules/find-up/index.js
var require_find_up = __commonJS({
  "node_modules/find-up/index.js"(exports, module2) {
    "use strict";
    var path = require("path");
    var locatePath = require_locate_path();
    var pathExists = require_path_exists();
    var stop = Symbol("findUp.stop");
    module2.exports = (_0, ..._1) => __async(exports, [_0, ..._1], function* (name, options = {}) {
      let directory = path.resolve(options.cwd || "");
      const { root } = path.parse(directory);
      const paths = [].concat(name);
      const runMatcher = /* @__PURE__ */ __name((locateOptions) => __async(exports, null, function* () {
        if (typeof name !== "function") {
          return locatePath(paths, locateOptions);
        }
        const foundPath = yield name(locateOptions.cwd);
        if (typeof foundPath === "string") {
          return locatePath([
            foundPath
          ], locateOptions);
        }
        return foundPath;
      }), "runMatcher");
      while (true) {
        const foundPath = yield runMatcher(__spreadProps(__spreadValues({}, options), {
          cwd: directory
        }));
        if (foundPath === stop) {
          return;
        }
        if (foundPath) {
          return path.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path.dirname(directory);
      }
    });
    module2.exports.sync = (name, options = {}) => {
      let directory = path.resolve(options.cwd || "");
      const { root } = path.parse(directory);
      const paths = [].concat(name);
      const runMatcher = /* @__PURE__ */ __name((locateOptions) => {
        if (typeof name !== "function") {
          return locatePath.sync(paths, locateOptions);
        }
        const foundPath = name(locateOptions.cwd);
        if (typeof foundPath === "string") {
          return locatePath.sync([
            foundPath
          ], locateOptions);
        }
        return foundPath;
      }, "runMatcher");
      while (true) {
        const foundPath = runMatcher(__spreadProps(__spreadValues({}, options), {
          cwd: directory
        }));
        if (foundPath === stop) {
          return;
        }
        if (foundPath) {
          return path.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path.dirname(directory);
      }
    };
    module2.exports.exists = pathExists;
    module2.exports.sync.exists = pathExists.sync;
    module2.exports.stop = stop;
  }
});

// node_modules/is-arrayish/index.js
var require_is_arrayish = __commonJS({
  "node_modules/is-arrayish/index.js"(exports, module2) {
    "use strict";
    module2.exports = /* @__PURE__ */ __name(function isArrayish(obj) {
      if (!obj) {
        return false;
      }
      return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && obj.splice instanceof Function;
    }, "isArrayish");
  }
});

// node_modules/error-ex/index.js
var require_error_ex = __commonJS({
  "node_modules/error-ex/index.js"(exports, module2) {
    "use strict";
    var util = require("util");
    var isArrayish = require_is_arrayish();
    var errorEx = /* @__PURE__ */ __name(function errorEx2(name, properties) {
      if (!name || name.constructor !== String) {
        properties = name || {};
        name = Error.name;
      }
      var errorExError = /* @__PURE__ */ __name(function ErrorEXError(message) {
        if (!this) {
          return new ErrorEXError(message);
        }
        message = message instanceof Error ? message.message : message || this.message;
        Error.call(this, message);
        Error.captureStackTrace(this, errorExError);
        this.name = name;
        Object.defineProperty(this, "message", {
          configurable: true,
          enumerable: false,
          get: function() {
            var newMessage = message.split(/\r?\n/g);
            for (var key in properties) {
              if (!properties.hasOwnProperty(key)) {
                continue;
              }
              var modifier = properties[key];
              if ("message" in modifier) {
                newMessage = modifier.message(this[key], newMessage) || newMessage;
                if (!isArrayish(newMessage)) {
                  newMessage = [
                    newMessage
                  ];
                }
              }
            }
            return newMessage.join("\n");
          },
          set: function(v) {
            message = v;
          }
        });
        var overwrittenStack = null;
        var stackDescriptor = Object.getOwnPropertyDescriptor(this, "stack");
        var stackGetter = stackDescriptor.get;
        var stackValue = stackDescriptor.value;
        delete stackDescriptor.value;
        delete stackDescriptor.writable;
        stackDescriptor.set = function(newstack) {
          overwrittenStack = newstack;
        };
        stackDescriptor.get = function() {
          var stack = (overwrittenStack || (stackGetter ? stackGetter.call(this) : stackValue)).split(/\r?\n+/g);
          if (!overwrittenStack) {
            stack[0] = this.name + ": " + this.message;
          }
          var lineCount = 1;
          for (var key in properties) {
            if (!properties.hasOwnProperty(key)) {
              continue;
            }
            var modifier = properties[key];
            if ("line" in modifier) {
              var line = modifier.line(this[key]);
              if (line) {
                stack.splice(lineCount++, 0, "    " + line);
              }
            }
            if ("stack" in modifier) {
              modifier.stack(this[key], stack);
            }
          }
          return stack.join("\n");
        };
        Object.defineProperty(this, "stack", stackDescriptor);
      }, "ErrorEXError");
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(errorExError.prototype, Error.prototype);
        Object.setPrototypeOf(errorExError, Error);
      } else {
        util.inherits(errorExError, Error);
      }
      return errorExError;
    }, "errorEx");
    errorEx.append = function(str, def) {
      return {
        message: function(v, message) {
          v = v || def;
          if (v) {
            message[0] += " " + str.replace("%s", v.toString());
          }
          return message;
        }
      };
    };
    errorEx.line = function(str, def) {
      return {
        line: function(v) {
          v = v || def;
          if (v) {
            return str.replace("%s", v.toString());
          }
          return null;
        }
      };
    };
    module2.exports = errorEx;
  }
});

// node_modules/json-parse-even-better-errors/index.js
var require_json_parse_even_better_errors = __commonJS({
  "node_modules/json-parse-even-better-errors/index.js"(exports, module2) {
    "use strict";
    var hexify = /* @__PURE__ */ __name((char) => {
      const h = char.charCodeAt(0).toString(16).toUpperCase();
      return "0x" + (h.length % 2 ? "0" : "") + h;
    }, "hexify");
    var parseError = /* @__PURE__ */ __name((e, txt, context) => {
      if (!txt) {
        return {
          message: e.message + " while parsing empty string",
          position: 0
        };
      }
      const badToken = e.message.match(/^Unexpected token (.) .*position\s+(\d+)/i);
      const errIdx = badToken ? +badToken[2] : e.message.match(/^Unexpected end of JSON.*/i) ? txt.length - 1 : null;
      const msg = badToken ? e.message.replace(/^Unexpected token ./, `Unexpected token ${JSON.stringify(badToken[1])} (${hexify(badToken[1])})`) : e.message;
      if (errIdx !== null && errIdx !== void 0) {
        const start = errIdx <= context ? 0 : errIdx - context;
        const end = errIdx + context >= txt.length ? txt.length : errIdx + context;
        const slice = (start === 0 ? "" : "...") + txt.slice(start, end) + (end === txt.length ? "" : "...");
        const near = txt === slice ? "" : "near ";
        return {
          message: msg + ` while parsing ${near}${JSON.stringify(slice)}`,
          position: errIdx
        };
      } else {
        return {
          message: msg + ` while parsing '${txt.slice(0, context * 2)}'`,
          position: 0
        };
      }
    }, "parseError");
    var JSONParseError = /* @__PURE__ */ __name(class JSONParseError extends SyntaxError {
      constructor(er, txt, context, caller) {
        context = context || 20;
        const metadata = parseError(er, txt, context);
        super(metadata.message);
        Object.assign(this, metadata);
        this.code = "EJSONPARSE";
        this.systemError = er;
        Error.captureStackTrace(this, caller || this.constructor);
      }
      get name() {
        return this.constructor.name;
      }
      set name(n) {
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    }, "JSONParseError");
    var kIndent = Symbol.for("indent");
    var kNewline = Symbol.for("newline");
    var formatRE = /^\s*[{\[]((?:\r?\n)+)([\s\t]*)/;
    var emptyRE = /^(?:\{\}|\[\])((?:\r?\n)+)?$/;
    var parseJson = /* @__PURE__ */ __name((txt, reviver, context) => {
      const parseText = stripBOM(txt);
      context = context || 20;
      try {
        const [, newline = "\n", indent = "  "] = parseText.match(emptyRE) || parseText.match(formatRE) || [
          ,
          "",
          ""
        ];
        const result = JSON.parse(parseText, reviver);
        if (result && typeof result === "object") {
          result[kNewline] = newline;
          result[kIndent] = indent;
        }
        return result;
      } catch (e) {
        if (typeof txt !== "string" && !Buffer.isBuffer(txt)) {
          const isEmptyArray = Array.isArray(txt) && txt.length === 0;
          throw Object.assign(new TypeError(`Cannot parse ${isEmptyArray ? "an empty array" : String(txt)}`), {
            code: "EJSONPARSE",
            systemError: e
          });
        }
        throw new JSONParseError(e, parseText, context, parseJson);
      }
    }, "parseJson");
    var stripBOM = /* @__PURE__ */ __name((txt) => String(txt).replace(/^\uFEFF/, ""), "stripBOM");
    module2.exports = parseJson;
    parseJson.JSONParseError = JSONParseError;
    parseJson.noExceptions = (txt, reviver) => {
      try {
        return JSON.parse(stripBOM(txt), reviver);
      } catch (e) {
      }
    };
  }
});

// node_modules/lines-and-columns/build/index.js
var require_build = __commonJS({
  "node_modules/lines-and-columns/build/index.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.LinesAndColumns = void 0;
    var LF = "\n";
    var CR = "\r";
    var LinesAndColumns = function() {
      function LinesAndColumns2(string) {
        this.string = string;
        var offsets = [
          0
        ];
        for (var offset = 0; offset < string.length; ) {
          switch (string[offset]) {
            case LF:
              offset += LF.length;
              offsets.push(offset);
              break;
            case CR:
              offset += CR.length;
              if (string[offset] === LF) {
                offset += LF.length;
              }
              offsets.push(offset);
              break;
            default:
              offset++;
              break;
          }
        }
        this.offsets = offsets;
      }
      __name(LinesAndColumns2, "LinesAndColumns");
      LinesAndColumns2.prototype.locationForIndex = function(index) {
        if (index < 0 || index > this.string.length) {
          return null;
        }
        var line = 0;
        var offsets = this.offsets;
        while (offsets[line + 1] <= index) {
          line++;
        }
        var column = index - offsets[line];
        return {
          line,
          column
        };
      };
      LinesAndColumns2.prototype.indexForLocation = function(location) {
        var line = location.line, column = location.column;
        if (line < 0 || line >= this.offsets.length) {
          return null;
        }
        if (column < 0 || column > this.lengthOfLine(line)) {
          return null;
        }
        return this.offsets[line] + column;
      };
      LinesAndColumns2.prototype.lengthOfLine = function(line) {
        var offset = this.offsets[line];
        var nextOffset = line === this.offsets.length - 1 ? this.string.length : this.offsets[line + 1];
        return nextOffset - offset;
      };
      return LinesAndColumns2;
    }();
    exports.LinesAndColumns = LinesAndColumns;
    exports["default"] = LinesAndColumns;
  }
});

// node_modules/js-tokens/index.js
var require_js_tokens = __commonJS({
  "node_modules/js-tokens/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;
    exports.matchToToken = function(match) {
      var token = {
        type: "invalid",
        value: match[0],
        closed: void 0
      };
      if (match[1])
        token.type = "string", token.closed = !!(match[3] || match[4]);
      else if (match[5])
        token.type = "comment";
      else if (match[6])
        token.type = "comment", token.closed = !!match[7];
      else if (match[8])
        token.type = "regex";
      else if (match[9])
        token.type = "number";
      else if (match[10])
        token.type = "name";
      else if (match[11])
        token.type = "punctuator";
      else if (match[12])
        token.type = "whitespace";
      return token;
    };
  }
});

// node_modules/@babel/helper-validator-identifier/lib/identifier.js
var require_identifier = __commonJS({
  "node_modules/@babel/helper-validator-identifier/lib/identifier.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isIdentifierChar = isIdentifierChar;
    exports.isIdentifierName = isIdentifierName;
    exports.isIdentifierStart = isIdentifierStart;
    var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
    var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
    var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
    var astralIdentifierStartCodes = [
      0,
      11,
      2,
      25,
      2,
      18,
      2,
      1,
      2,
      14,
      3,
      13,
      35,
      122,
      70,
      52,
      268,
      28,
      4,
      48,
      48,
      31,
      14,
      29,
      6,
      37,
      11,
      29,
      3,
      35,
      5,
      7,
      2,
      4,
      43,
      157,
      19,
      35,
      5,
      35,
      5,
      39,
      9,
      51,
      13,
      10,
      2,
      14,
      2,
      6,
      2,
      1,
      2,
      10,
      2,
      14,
      2,
      6,
      2,
      1,
      68,
      310,
      10,
      21,
      11,
      7,
      25,
      5,
      2,
      41,
      2,
      8,
      70,
      5,
      3,
      0,
      2,
      43,
      2,
      1,
      4,
      0,
      3,
      22,
      11,
      22,
      10,
      30,
      66,
      18,
      2,
      1,
      11,
      21,
      11,
      25,
      71,
      55,
      7,
      1,
      65,
      0,
      16,
      3,
      2,
      2,
      2,
      28,
      43,
      28,
      4,
      28,
      36,
      7,
      2,
      27,
      28,
      53,
      11,
      21,
      11,
      18,
      14,
      17,
      111,
      72,
      56,
      50,
      14,
      50,
      14,
      35,
      349,
      41,
      7,
      1,
      79,
      28,
      11,
      0,
      9,
      21,
      43,
      17,
      47,
      20,
      28,
      22,
      13,
      52,
      58,
      1,
      3,
      0,
      14,
      44,
      33,
      24,
      27,
      35,
      30,
      0,
      3,
      0,
      9,
      34,
      4,
      0,
      13,
      47,
      15,
      3,
      22,
      0,
      2,
      0,
      36,
      17,
      2,
      24,
      20,
      1,
      64,
      6,
      2,
      0,
      2,
      3,
      2,
      14,
      2,
      9,
      8,
      46,
      39,
      7,
      3,
      1,
      3,
      21,
      2,
      6,
      2,
      1,
      2,
      4,
      4,
      0,
      19,
      0,
      13,
      4,
      159,
      52,
      19,
      3,
      21,
      2,
      31,
      47,
      21,
      1,
      2,
      0,
      185,
      46,
      42,
      3,
      37,
      47,
      21,
      0,
      60,
      42,
      14,
      0,
      72,
      26,
      38,
      6,
      186,
      43,
      117,
      63,
      32,
      7,
      3,
      0,
      3,
      7,
      2,
      1,
      2,
      23,
      16,
      0,
      2,
      0,
      95,
      7,
      3,
      38,
      17,
      0,
      2,
      0,
      29,
      0,
      11,
      39,
      8,
      0,
      22,
      0,
      12,
      45,
      20,
      0,
      19,
      72,
      264,
      8,
      2,
      36,
      18,
      0,
      50,
      29,
      113,
      6,
      2,
      1,
      2,
      37,
      22,
      0,
      26,
      5,
      2,
      1,
      2,
      31,
      15,
      0,
      328,
      18,
      16,
      0,
      2,
      12,
      2,
      33,
      125,
      0,
      80,
      921,
      103,
      110,
      18,
      195,
      2637,
      96,
      16,
      1071,
      18,
      5,
      4026,
      582,
      8634,
      568,
      8,
      30,
      18,
      78,
      18,
      29,
      19,
      47,
      17,
      3,
      32,
      20,
      6,
      18,
      689,
      63,
      129,
      74,
      6,
      0,
      67,
      12,
      65,
      1,
      2,
      0,
      29,
      6135,
      9,
      1237,
      43,
      8,
      8936,
      3,
      2,
      6,
      2,
      1,
      2,
      290,
      16,
      0,
      30,
      2,
      3,
      0,
      15,
      3,
      9,
      395,
      2309,
      106,
      6,
      12,
      4,
      8,
      8,
      9,
      5991,
      84,
      2,
      70,
      2,
      1,
      3,
      0,
      3,
      1,
      3,
      3,
      2,
      11,
      2,
      0,
      2,
      6,
      2,
      64,
      2,
      3,
      3,
      7,
      2,
      6,
      2,
      27,
      2,
      3,
      2,
      4,
      2,
      0,
      4,
      6,
      2,
      339,
      3,
      24,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      7,
      1845,
      30,
      7,
      5,
      262,
      61,
      147,
      44,
      11,
      6,
      17,
      0,
      322,
      29,
      19,
      43,
      485,
      27,
      757,
      6,
      2,
      3,
      2,
      1,
      2,
      14,
      2,
      196,
      60,
      67,
      8,
      0,
      1205,
      3,
      2,
      26,
      2,
      1,
      2,
      0,
      3,
      0,
      2,
      9,
      2,
      3,
      2,
      0,
      2,
      0,
      7,
      0,
      5,
      0,
      2,
      0,
      2,
      0,
      2,
      2,
      2,
      1,
      2,
      0,
      3,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      1,
      2,
      0,
      3,
      3,
      2,
      6,
      2,
      3,
      2,
      3,
      2,
      0,
      2,
      9,
      2,
      16,
      6,
      2,
      2,
      4,
      2,
      16,
      4421,
      42719,
      33,
      4153,
      7,
      221,
      3,
      5761,
      15,
      7472,
      3104,
      541,
      1507,
      4938,
      6,
      4191
    ];
    var astralIdentifierCodes = [
      509,
      0,
      227,
      0,
      150,
      4,
      294,
      9,
      1368,
      2,
      2,
      1,
      6,
      3,
      41,
      2,
      5,
      0,
      166,
      1,
      574,
      3,
      9,
      9,
      370,
      1,
      81,
      2,
      71,
      10,
      50,
      3,
      123,
      2,
      54,
      14,
      32,
      10,
      3,
      1,
      11,
      3,
      46,
      10,
      8,
      0,
      46,
      9,
      7,
      2,
      37,
      13,
      2,
      9,
      6,
      1,
      45,
      0,
      13,
      2,
      49,
      13,
      9,
      3,
      2,
      11,
      83,
      11,
      7,
      0,
      3,
      0,
      158,
      11,
      6,
      9,
      7,
      3,
      56,
      1,
      2,
      6,
      3,
      1,
      3,
      2,
      10,
      0,
      11,
      1,
      3,
      6,
      4,
      4,
      193,
      17,
      10,
      9,
      5,
      0,
      82,
      19,
      13,
      9,
      214,
      6,
      3,
      8,
      28,
      1,
      83,
      16,
      16,
      9,
      82,
      12,
      9,
      9,
      84,
      14,
      5,
      9,
      243,
      14,
      166,
      9,
      71,
      5,
      2,
      1,
      3,
      3,
      2,
      0,
      2,
      1,
      13,
      9,
      120,
      6,
      3,
      6,
      4,
      0,
      29,
      9,
      41,
      6,
      2,
      3,
      9,
      0,
      10,
      10,
      47,
      15,
      406,
      7,
      2,
      7,
      17,
      9,
      57,
      21,
      2,
      13,
      123,
      5,
      4,
      0,
      2,
      1,
      2,
      6,
      2,
      0,
      9,
      9,
      49,
      4,
      2,
      1,
      2,
      4,
      9,
      9,
      330,
      3,
      10,
      1,
      2,
      0,
      49,
      6,
      4,
      4,
      14,
      9,
      5351,
      0,
      7,
      14,
      13835,
      9,
      87,
      9,
      39,
      4,
      60,
      6,
      26,
      9,
      1014,
      0,
      2,
      54,
      8,
      3,
      82,
      0,
      12,
      1,
      19628,
      1,
      4706,
      45,
      3,
      22,
      543,
      4,
      4,
      5,
      9,
      7,
      3,
      6,
      31,
      3,
      149,
      2,
      1418,
      49,
      513,
      54,
      5,
      49,
      9,
      0,
      15,
      0,
      23,
      4,
      2,
      14,
      1361,
      6,
      2,
      16,
      3,
      6,
      2,
      1,
      2,
      4,
      101,
      0,
      161,
      6,
      10,
      9,
      357,
      0,
      62,
      13,
      499,
      13,
      983,
      6,
      110,
      6,
      6,
      9,
      4759,
      9,
      787719,
      239
    ];
    function isInAstralSet(code, set) {
      let pos = 65536;
      for (let i = 0, length = set.length; i < length; i += 2) {
        pos += set[i];
        if (pos > code)
          return false;
        pos += set[i + 1];
        if (pos >= code)
          return true;
      }
      return false;
    }
    __name(isInAstralSet, "isInAstralSet");
    function isIdentifierStart(code) {
      if (code < 65)
        return code === 36;
      if (code <= 90)
        return true;
      if (code < 97)
        return code === 95;
      if (code <= 122)
        return true;
      if (code <= 65535) {
        return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
      }
      return isInAstralSet(code, astralIdentifierStartCodes);
    }
    __name(isIdentifierStart, "isIdentifierStart");
    function isIdentifierChar(code) {
      if (code < 48)
        return code === 36;
      if (code < 58)
        return true;
      if (code < 65)
        return false;
      if (code <= 90)
        return true;
      if (code < 97)
        return code === 95;
      if (code <= 122)
        return true;
      if (code <= 65535) {
        return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
      }
      return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
    }
    __name(isIdentifierChar, "isIdentifierChar");
    function isIdentifierName(name) {
      let isFirst = true;
      for (let i = 0; i < name.length; i++) {
        let cp = name.charCodeAt(i);
        if ((cp & 64512) === 55296 && i + 1 < name.length) {
          const trail = name.charCodeAt(++i);
          if ((trail & 64512) === 56320) {
            cp = 65536 + ((cp & 1023) << 10) + (trail & 1023);
          }
        }
        if (isFirst) {
          isFirst = false;
          if (!isIdentifierStart(cp)) {
            return false;
          }
        } else if (!isIdentifierChar(cp)) {
          return false;
        }
      }
      return !isFirst;
    }
    __name(isIdentifierName, "isIdentifierName");
  }
});

// node_modules/@babel/helper-validator-identifier/lib/keyword.js
var require_keyword = __commonJS({
  "node_modules/@babel/helper-validator-identifier/lib/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isKeyword = isKeyword;
    exports.isReservedWord = isReservedWord;
    exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
    exports.isStrictBindReservedWord = isStrictBindReservedWord;
    exports.isStrictReservedWord = isStrictReservedWord;
    var reservedWords = {
      keyword: [
        "break",
        "case",
        "catch",
        "continue",
        "debugger",
        "default",
        "do",
        "else",
        "finally",
        "for",
        "function",
        "if",
        "return",
        "switch",
        "throw",
        "try",
        "var",
        "const",
        "while",
        "with",
        "new",
        "this",
        "super",
        "class",
        "extends",
        "export",
        "import",
        "null",
        "true",
        "false",
        "in",
        "instanceof",
        "typeof",
        "void",
        "delete"
      ],
      strict: [
        "implements",
        "interface",
        "let",
        "package",
        "private",
        "protected",
        "public",
        "static",
        "yield"
      ],
      strictBind: [
        "eval",
        "arguments"
      ]
    };
    var keywords = new Set(reservedWords.keyword);
    var reservedWordsStrictSet = new Set(reservedWords.strict);
    var reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
    function isReservedWord(word, inModule) {
      return inModule && word === "await" || word === "enum";
    }
    __name(isReservedWord, "isReservedWord");
    function isStrictReservedWord(word, inModule) {
      return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
    }
    __name(isStrictReservedWord, "isStrictReservedWord");
    function isStrictBindOnlyReservedWord(word) {
      return reservedWordsStrictBindSet.has(word);
    }
    __name(isStrictBindOnlyReservedWord, "isStrictBindOnlyReservedWord");
    function isStrictBindReservedWord(word, inModule) {
      return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
    }
    __name(isStrictBindReservedWord, "isStrictBindReservedWord");
    function isKeyword(word) {
      return keywords.has(word);
    }
    __name(isKeyword, "isKeyword");
  }
});

// node_modules/@babel/helper-validator-identifier/lib/index.js
var require_lib = __commonJS({
  "node_modules/@babel/helper-validator-identifier/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "isIdentifierChar", {
      enumerable: true,
      get: function() {
        return _identifier.isIdentifierChar;
      }
    });
    Object.defineProperty(exports, "isIdentifierName", {
      enumerable: true,
      get: function() {
        return _identifier.isIdentifierName;
      }
    });
    Object.defineProperty(exports, "isIdentifierStart", {
      enumerable: true,
      get: function() {
        return _identifier.isIdentifierStart;
      }
    });
    Object.defineProperty(exports, "isKeyword", {
      enumerable: true,
      get: function() {
        return _keyword.isKeyword;
      }
    });
    Object.defineProperty(exports, "isReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isReservedWord;
      }
    });
    Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isStrictBindOnlyReservedWord;
      }
    });
    Object.defineProperty(exports, "isStrictBindReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isStrictBindReservedWord;
      }
    });
    Object.defineProperty(exports, "isStrictReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isStrictReservedWord;
      }
    });
    var _identifier = require_identifier();
    var _keyword = require_keyword();
  }
});

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS({
  "node_modules/escape-string-regexp/index.js"(exports, module2) {
    "use strict";
    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    module2.exports = function(str) {
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      return str.replace(matchOperatorsRe, "\\$&");
    };
  }
});

// node_modules/@babel/highlight/node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/@babel/highlight/node_modules/color-name/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [
        240,
        248,
        255
      ],
      "antiquewhite": [
        250,
        235,
        215
      ],
      "aqua": [
        0,
        255,
        255
      ],
      "aquamarine": [
        127,
        255,
        212
      ],
      "azure": [
        240,
        255,
        255
      ],
      "beige": [
        245,
        245,
        220
      ],
      "bisque": [
        255,
        228,
        196
      ],
      "black": [
        0,
        0,
        0
      ],
      "blanchedalmond": [
        255,
        235,
        205
      ],
      "blue": [
        0,
        0,
        255
      ],
      "blueviolet": [
        138,
        43,
        226
      ],
      "brown": [
        165,
        42,
        42
      ],
      "burlywood": [
        222,
        184,
        135
      ],
      "cadetblue": [
        95,
        158,
        160
      ],
      "chartreuse": [
        127,
        255,
        0
      ],
      "chocolate": [
        210,
        105,
        30
      ],
      "coral": [
        255,
        127,
        80
      ],
      "cornflowerblue": [
        100,
        149,
        237
      ],
      "cornsilk": [
        255,
        248,
        220
      ],
      "crimson": [
        220,
        20,
        60
      ],
      "cyan": [
        0,
        255,
        255
      ],
      "darkblue": [
        0,
        0,
        139
      ],
      "darkcyan": [
        0,
        139,
        139
      ],
      "darkgoldenrod": [
        184,
        134,
        11
      ],
      "darkgray": [
        169,
        169,
        169
      ],
      "darkgreen": [
        0,
        100,
        0
      ],
      "darkgrey": [
        169,
        169,
        169
      ],
      "darkkhaki": [
        189,
        183,
        107
      ],
      "darkmagenta": [
        139,
        0,
        139
      ],
      "darkolivegreen": [
        85,
        107,
        47
      ],
      "darkorange": [
        255,
        140,
        0
      ],
      "darkorchid": [
        153,
        50,
        204
      ],
      "darkred": [
        139,
        0,
        0
      ],
      "darksalmon": [
        233,
        150,
        122
      ],
      "darkseagreen": [
        143,
        188,
        143
      ],
      "darkslateblue": [
        72,
        61,
        139
      ],
      "darkslategray": [
        47,
        79,
        79
      ],
      "darkslategrey": [
        47,
        79,
        79
      ],
      "darkturquoise": [
        0,
        206,
        209
      ],
      "darkviolet": [
        148,
        0,
        211
      ],
      "deeppink": [
        255,
        20,
        147
      ],
      "deepskyblue": [
        0,
        191,
        255
      ],
      "dimgray": [
        105,
        105,
        105
      ],
      "dimgrey": [
        105,
        105,
        105
      ],
      "dodgerblue": [
        30,
        144,
        255
      ],
      "firebrick": [
        178,
        34,
        34
      ],
      "floralwhite": [
        255,
        250,
        240
      ],
      "forestgreen": [
        34,
        139,
        34
      ],
      "fuchsia": [
        255,
        0,
        255
      ],
      "gainsboro": [
        220,
        220,
        220
      ],
      "ghostwhite": [
        248,
        248,
        255
      ],
      "gold": [
        255,
        215,
        0
      ],
      "goldenrod": [
        218,
        165,
        32
      ],
      "gray": [
        128,
        128,
        128
      ],
      "green": [
        0,
        128,
        0
      ],
      "greenyellow": [
        173,
        255,
        47
      ],
      "grey": [
        128,
        128,
        128
      ],
      "honeydew": [
        240,
        255,
        240
      ],
      "hotpink": [
        255,
        105,
        180
      ],
      "indianred": [
        205,
        92,
        92
      ],
      "indigo": [
        75,
        0,
        130
      ],
      "ivory": [
        255,
        255,
        240
      ],
      "khaki": [
        240,
        230,
        140
      ],
      "lavender": [
        230,
        230,
        250
      ],
      "lavenderblush": [
        255,
        240,
        245
      ],
      "lawngreen": [
        124,
        252,
        0
      ],
      "lemonchiffon": [
        255,
        250,
        205
      ],
      "lightblue": [
        173,
        216,
        230
      ],
      "lightcoral": [
        240,
        128,
        128
      ],
      "lightcyan": [
        224,
        255,
        255
      ],
      "lightgoldenrodyellow": [
        250,
        250,
        210
      ],
      "lightgray": [
        211,
        211,
        211
      ],
      "lightgreen": [
        144,
        238,
        144
      ],
      "lightgrey": [
        211,
        211,
        211
      ],
      "lightpink": [
        255,
        182,
        193
      ],
      "lightsalmon": [
        255,
        160,
        122
      ],
      "lightseagreen": [
        32,
        178,
        170
      ],
      "lightskyblue": [
        135,
        206,
        250
      ],
      "lightslategray": [
        119,
        136,
        153
      ],
      "lightslategrey": [
        119,
        136,
        153
      ],
      "lightsteelblue": [
        176,
        196,
        222
      ],
      "lightyellow": [
        255,
        255,
        224
      ],
      "lime": [
        0,
        255,
        0
      ],
      "limegreen": [
        50,
        205,
        50
      ],
      "linen": [
        250,
        240,
        230
      ],
      "magenta": [
        255,
        0,
        255
      ],
      "maroon": [
        128,
        0,
        0
      ],
      "mediumaquamarine": [
        102,
        205,
        170
      ],
      "mediumblue": [
        0,
        0,
        205
      ],
      "mediumorchid": [
        186,
        85,
        211
      ],
      "mediumpurple": [
        147,
        112,
        219
      ],
      "mediumseagreen": [
        60,
        179,
        113
      ],
      "mediumslateblue": [
        123,
        104,
        238
      ],
      "mediumspringgreen": [
        0,
        250,
        154
      ],
      "mediumturquoise": [
        72,
        209,
        204
      ],
      "mediumvioletred": [
        199,
        21,
        133
      ],
      "midnightblue": [
        25,
        25,
        112
      ],
      "mintcream": [
        245,
        255,
        250
      ],
      "mistyrose": [
        255,
        228,
        225
      ],
      "moccasin": [
        255,
        228,
        181
      ],
      "navajowhite": [
        255,
        222,
        173
      ],
      "navy": [
        0,
        0,
        128
      ],
      "oldlace": [
        253,
        245,
        230
      ],
      "olive": [
        128,
        128,
        0
      ],
      "olivedrab": [
        107,
        142,
        35
      ],
      "orange": [
        255,
        165,
        0
      ],
      "orangered": [
        255,
        69,
        0
      ],
      "orchid": [
        218,
        112,
        214
      ],
      "palegoldenrod": [
        238,
        232,
        170
      ],
      "palegreen": [
        152,
        251,
        152
      ],
      "paleturquoise": [
        175,
        238,
        238
      ],
      "palevioletred": [
        219,
        112,
        147
      ],
      "papayawhip": [
        255,
        239,
        213
      ],
      "peachpuff": [
        255,
        218,
        185
      ],
      "peru": [
        205,
        133,
        63
      ],
      "pink": [
        255,
        192,
        203
      ],
      "plum": [
        221,
        160,
        221
      ],
      "powderblue": [
        176,
        224,
        230
      ],
      "purple": [
        128,
        0,
        128
      ],
      "rebeccapurple": [
        102,
        51,
        153
      ],
      "red": [
        255,
        0,
        0
      ],
      "rosybrown": [
        188,
        143,
        143
      ],
      "royalblue": [
        65,
        105,
        225
      ],
      "saddlebrown": [
        139,
        69,
        19
      ],
      "salmon": [
        250,
        128,
        114
      ],
      "sandybrown": [
        244,
        164,
        96
      ],
      "seagreen": [
        46,
        139,
        87
      ],
      "seashell": [
        255,
        245,
        238
      ],
      "sienna": [
        160,
        82,
        45
      ],
      "silver": [
        192,
        192,
        192
      ],
      "skyblue": [
        135,
        206,
        235
      ],
      "slateblue": [
        106,
        90,
        205
      ],
      "slategray": [
        112,
        128,
        144
      ],
      "slategrey": [
        112,
        128,
        144
      ],
      "snow": [
        255,
        250,
        250
      ],
      "springgreen": [
        0,
        255,
        127
      ],
      "steelblue": [
        70,
        130,
        180
      ],
      "tan": [
        210,
        180,
        140
      ],
      "teal": [
        0,
        128,
        128
      ],
      "thistle": [
        216,
        191,
        216
      ],
      "tomato": [
        255,
        99,
        71
      ],
      "turquoise": [
        64,
        224,
        208
      ],
      "violet": [
        238,
        130,
        238
      ],
      "wheat": [
        245,
        222,
        179
      ],
      "white": [
        255,
        255,
        255
      ],
      "whitesmoke": [
        245,
        245,
        245
      ],
      "yellow": [
        255,
        255,
        0
      ],
      "yellowgreen": [
        154,
        205,
        50
      ]
    };
  }
});

// node_modules/@babel/highlight/node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/@babel/highlight/node_modules/color-convert/conversions.js"(exports, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (key in cssKeywords) {
      if (cssKeywords.hasOwnProperty(key)) {
        reverseKeywords[cssKeywords[key]] = key;
      }
    }
    var key;
    var convert = module2.exports = {
      rgb: {
        channels: 3,
        labels: "rgb"
      },
      hsl: {
        channels: 3,
        labels: "hsl"
      },
      hsv: {
        channels: 3,
        labels: "hsv"
      },
      hwb: {
        channels: 3,
        labels: "hwb"
      },
      cmyk: {
        channels: 4,
        labels: "cmyk"
      },
      xyz: {
        channels: 3,
        labels: "xyz"
      },
      lab: {
        channels: 3,
        labels: "lab"
      },
      lch: {
        channels: 3,
        labels: "lch"
      },
      hex: {
        channels: 1,
        labels: [
          "hex"
        ]
      },
      keyword: {
        channels: 1,
        labels: [
          "keyword"
        ]
      },
      ansi16: {
        channels: 1,
        labels: [
          "ansi16"
        ]
      },
      ansi256: {
        channels: 1,
        labels: [
          "ansi256"
        ]
      },
      hcg: {
        channels: 3,
        labels: [
          "h",
          "c",
          "g"
        ]
      },
      apple: {
        channels: 3,
        labels: [
          "r16",
          "g16",
          "b16"
        ]
      },
      gray: {
        channels: 1,
        labels: [
          "gray"
        ]
      }
    };
    for (model in convert) {
      if (convert.hasOwnProperty(model)) {
        if (!("channels" in convert[model])) {
          throw new Error("missing channels property: " + model);
        }
        if (!("labels" in convert[model])) {
          throw new Error("missing channel labels property: " + model);
        }
        if (convert[model].labels.length !== convert[model].channels) {
          throw new Error("channel and label counts mismatch: " + model);
        }
        channels = convert[model].channels;
        labels = convert[model].labels;
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], "channels", {
          value: channels
        });
        Object.defineProperty(convert[model], "labels", {
          value: labels
        });
      }
    }
    var channels;
    var labels;
    var model;
    convert.rgb.hsl = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var min = Math.min(r, g, b);
      var max = Math.max(r, g, b);
      var delta = max - min;
      var h;
      var s;
      var l;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [
        h,
        s * 100,
        l * 100
      ];
    };
    convert.rgb.hsv = function(rgb) {
      var rdif;
      var gdif;
      var bdif;
      var h;
      var s;
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var v = Math.max(r, g, b);
      var diff = v - Math.min(r, g, b);
      var diffc = /* @__PURE__ */ __name(function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      }, "diffc");
      if (diff === 0) {
        h = s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      var r = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      var h = convert.rgb.hsl(rgb)[0];
      var w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [
        h,
        w * 100,
        b * 100
      ];
    };
    convert.rgb.cmyk = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var c;
      var m;
      var y;
      var k;
      k = Math.min(1 - r, 1 - g, 1 - b);
      c = (1 - r - k) / (1 - k) || 0;
      m = (1 - g - k) / (1 - k) || 0;
      y = (1 - b - k) / (1 - k) || 0;
      return [
        c * 100,
        m * 100,
        y * 100,
        k * 100
      ];
    };
    function comparativeDistance(x, y) {
      return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
    }
    __name(comparativeDistance, "comparativeDistance");
    convert.rgb.keyword = function(rgb) {
      var reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      var currentClosestDistance = Infinity;
      var currentClosestKeyword;
      for (var keyword in cssKeywords) {
        if (cssKeywords.hasOwnProperty(keyword)) {
          var value = cssKeywords[keyword];
          var distance = comparativeDistance(rgb, value);
          if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
          }
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      var z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [
        x * 100,
        y * 100,
        z * 100
      ];
    };
    convert.rgb.lab = function(rgb) {
      var xyz = convert.rgb.xyz(rgb);
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l;
      var a;
      var b;
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
      l = 116 * y - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);
      return [
        l,
        a,
        b
      ];
    };
    convert.hsl.rgb = function(hsl) {
      var h = hsl[0] / 360;
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var t1;
      var t2;
      var t3;
      var rgb;
      var val;
      if (s === 0) {
        val = l * 255;
        return [
          val,
          val,
          val
        ];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      t1 = 2 * l - t2;
      rgb = [
        0,
        0,
        0
      ];
      for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      var h = hsl[0];
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var smin = s;
      var lmin = Math.max(l, 0.01);
      var sv;
      var v;
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      v = (l + s) / 2;
      sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [
        h,
        sv * 100,
        v * 100
      ];
    };
    convert.hsv.rgb = function(hsv) {
      var h = hsv[0] / 60;
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var hi = Math.floor(h) % 6;
      var f = h - Math.floor(h);
      var p = 255 * v * (1 - s);
      var q = 255 * v * (1 - s * f);
      var t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [
            v,
            t,
            p
          ];
        case 1:
          return [
            q,
            v,
            p
          ];
        case 2:
          return [
            p,
            v,
            t
          ];
        case 3:
          return [
            p,
            q,
            v
          ];
        case 4:
          return [
            t,
            p,
            v
          ];
        case 5:
          return [
            v,
            p,
            q
          ];
      }
    };
    convert.hsv.hsl = function(hsv) {
      var h = hsv[0];
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var vmin = Math.max(v, 0.01);
      var lmin;
      var sl;
      var l;
      l = (2 - s) * v;
      lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [
        h,
        sl * 100,
        l * 100
      ];
    };
    convert.hwb.rgb = function(hwb) {
      var h = hwb[0] / 360;
      var wh = hwb[1] / 100;
      var bl = hwb[2] / 100;
      var ratio = wh + bl;
      var i;
      var v;
      var f;
      var n;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      i = Math.floor(6 * h);
      v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      n = wh + f * (v - wh);
      var r;
      var g;
      var b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [
        r * 255,
        g * 255,
        b * 255
      ];
    };
    convert.cmyk.rgb = function(cmyk) {
      var c = cmyk[0] / 100;
      var m = cmyk[1] / 100;
      var y = cmyk[2] / 100;
      var k = cmyk[3] / 100;
      var r;
      var g;
      var b;
      r = 1 - Math.min(1, c * (1 - k) + k);
      g = 1 - Math.min(1, m * (1 - k) + k);
      b = 1 - Math.min(1, y * (1 - k) + k);
      return [
        r * 255,
        g * 255,
        b * 255
      ];
    };
    convert.xyz.rgb = function(xyz) {
      var x = xyz[0] / 100;
      var y = xyz[1] / 100;
      var z = xyz[2] / 100;
      var r;
      var g;
      var b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [
        r * 255,
        g * 255,
        b * 255
      ];
    };
    convert.xyz.lab = function(xyz) {
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l;
      var a;
      var b;
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
      l = 116 * y - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);
      return [
        l,
        a,
        b
      ];
    };
    convert.lab.xyz = function(lab) {
      var l = lab[0];
      var a = lab[1];
      var b = lab[2];
      var x;
      var y;
      var z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      var y2 = Math.pow(y, 3);
      var x2 = Math.pow(x, 3);
      var z2 = Math.pow(z, 3);
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [
        x,
        y,
        z
      ];
    };
    convert.lab.lch = function(lab) {
      var l = lab[0];
      var a = lab[1];
      var b = lab[2];
      var hr;
      var h;
      var c;
      hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      c = Math.sqrt(a * a + b * b);
      return [
        l,
        c,
        h
      ];
    };
    convert.lch.lab = function(lch) {
      var l = lch[0];
      var c = lch[1];
      var h = lch[2];
      var a;
      var b;
      var hr;
      hr = h / 360 * 2 * Math.PI;
      a = c * Math.cos(hr);
      b = c * Math.sin(hr);
      return [
        l,
        a,
        b
      ];
    };
    convert.rgb.ansi16 = function(args) {
      var r = args[0];
      var g = args[1];
      var b = args[2];
      var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2];
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      var ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      var r = args[0];
      var g = args[1];
      var b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      var ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      var color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [
          color,
          color,
          color
        ];
      }
      var mult = (~~(args > 50) + 1) * 0.5;
      var r = (color & 1) * mult * 255;
      var g = (color >> 1 & 1) * mult * 255;
      var b = (color >> 2 & 1) * mult * 255;
      return [
        r,
        g,
        b
      ];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        var c = (args - 232) * 10 + 8;
        return [
          c,
          c,
          c
        ];
      }
      args -= 16;
      var rem;
      var r = Math.floor(args / 36) / 5 * 255;
      var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      var b = rem % 6 / 5 * 255;
      return [
        r,
        g,
        b
      ];
    };
    convert.rgb.hex = function(args) {
      var integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      var string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [
          0,
          0,
          0
        ];
      }
      var colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map(function(char) {
          return char + char;
        }).join("");
      }
      var integer = parseInt(colorString, 16);
      var r = integer >> 16 & 255;
      var g = integer >> 8 & 255;
      var b = integer & 255;
      return [
        r,
        g,
        b
      ];
    };
    convert.rgb.hcg = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var max = Math.max(Math.max(r, g), b);
      var min = Math.min(Math.min(r, g), b);
      var chroma = max - min;
      var grayscale;
      var hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma + 4;
      }
      hue /= 6;
      hue %= 1;
      return [
        hue * 360,
        chroma * 100,
        grayscale * 100
      ];
    };
    convert.hsl.hcg = function(hsl) {
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var c = 1;
      var f = 0;
      if (l < 0.5) {
        c = 2 * s * l;
      } else {
        c = 2 * s * (1 - l);
      }
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [
        hsl[0],
        c * 100,
        f * 100
      ];
    };
    convert.hsv.hcg = function(hsv) {
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var c = s * v;
      var f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [
        hsv[0],
        c * 100,
        f * 100
      ];
    };
    convert.hcg.rgb = function(hcg) {
      var h = hcg[0] / 360;
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      if (c === 0) {
        return [
          g * 255,
          g * 255,
          g * 255
        ];
      }
      var pure = [
        0,
        0,
        0
      ];
      var hi = h % 1 * 6;
      var v = hi % 1;
      var w = 1 - v;
      var mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var v = c + g * (1 - c);
      var f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [
        hcg[0],
        f * 100,
        v * 100
      ];
    };
    convert.hcg.hsl = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var l = g * (1 - c) + 0.5 * c;
      var s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [
        hcg[0],
        s * 100,
        l * 100
      ];
    };
    convert.hcg.hwb = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var v = c + g * (1 - c);
      return [
        hcg[0],
        (v - c) * 100,
        (1 - v) * 100
      ];
    };
    convert.hwb.hcg = function(hwb) {
      var w = hwb[1] / 100;
      var b = hwb[2] / 100;
      var v = 1 - b;
      var c = v - w;
      var g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [
        hwb[0],
        c * 100,
        g * 100
      ];
    };
    convert.apple.rgb = function(apple) {
      return [
        apple[0] / 65535 * 255,
        apple[1] / 65535 * 255,
        apple[2] / 65535 * 255
      ];
    };
    convert.rgb.apple = function(rgb) {
      return [
        rgb[0] / 255 * 65535,
        rgb[1] / 255 * 65535,
        rgb[2] / 255 * 65535
      ];
    };
    convert.gray.rgb = function(args) {
      return [
        args[0] / 100 * 255,
        args[0] / 100 * 255,
        args[0] / 100 * 255
      ];
    };
    convert.gray.hsl = convert.gray.hsv = function(args) {
      return [
        0,
        0,
        args[0]
      ];
    };
    convert.gray.hwb = function(gray) {
      return [
        0,
        100,
        gray[0]
      ];
    };
    convert.gray.cmyk = function(gray) {
      return [
        0,
        0,
        0,
        gray[0]
      ];
    };
    convert.gray.lab = function(gray) {
      return [
        gray[0],
        0,
        0
      ];
    };
    convert.gray.hex = function(gray) {
      var val = Math.round(gray[0] / 100 * 255) & 255;
      var integer = (val << 16) + (val << 8) + val;
      var string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [
        val / 255 * 100
      ];
    };
  }
});

// node_modules/@babel/highlight/node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/@babel/highlight/node_modules/color-convert/route.js"(exports, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      var graph = {};
      var models = Object.keys(conversions);
      for (var len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    __name(buildGraph, "buildGraph");
    function deriveBFS(fromModel) {
      var graph = buildGraph();
      var queue = [
        fromModel
      ];
      graph[fromModel].distance = 0;
      while (queue.length) {
        var current = queue.pop();
        var adjacents = Object.keys(conversions[current]);
        for (var len = adjacents.length, i = 0; i < len; i++) {
          var adjacent = adjacents[i];
          var node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    __name(deriveBFS, "deriveBFS");
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    __name(link, "link");
    function wrapConversion(toModel, graph) {
      var path = [
        graph[toModel].parent,
        toModel
      ];
      var fn = conversions[graph[toModel].parent][toModel];
      var cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    __name(wrapConversion, "wrapConversion");
    module2.exports = function(fromModel) {
      var graph = deriveBFS(fromModel);
      var conversion = {};
      var models = Object.keys(graph);
      for (var len = models.length, i = 0; i < len; i++) {
        var toModel = models[i];
        var node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/@babel/highlight/node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/@babel/highlight/node_modules/color-convert/index.js"(exports, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      var wrappedFn = /* @__PURE__ */ __name(function(args) {
        if (args === void 0 || args === null) {
          return args;
        }
        if (arguments.length > 1) {
          args = Array.prototype.slice.call(arguments);
        }
        return fn(args);
      }, "wrappedFn");
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    __name(wrapRaw, "wrapRaw");
    function wrapRounded(fn) {
      var wrappedFn = /* @__PURE__ */ __name(function(args) {
        if (args === void 0 || args === null) {
          return args;
        }
        if (arguments.length > 1) {
          args = Array.prototype.slice.call(arguments);
        }
        var result = fn(args);
        if (typeof result === "object") {
          for (var len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      }, "wrappedFn");
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    __name(wrapRounded, "wrapRounded");
    models.forEach(function(fromModel) {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", {
        value: conversions[fromModel].channels
      });
      Object.defineProperty(convert[fromModel], "labels", {
        value: conversions[fromModel].labels
      });
      var routes = route(fromModel);
      var routeModels = Object.keys(routes);
      routeModels.forEach(function(toModel) {
        var fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// node_modules/@babel/highlight/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "node_modules/@babel/highlight/node_modules/ansi-styles/index.js"(exports, module2) {
    "use strict";
    var colorConvert = require_color_convert();
    var wrapAnsi16 = /* @__PURE__ */ __name((fn, offset) => function() {
      const code = fn.apply(colorConvert, arguments);
      return `\x1B[${code + offset}m`;
    }, "wrapAnsi16");
    var wrapAnsi256 = /* @__PURE__ */ __name((fn, offset) => function() {
      const code = fn.apply(colorConvert, arguments);
      return `\x1B[${38 + offset};5;${code}m`;
    }, "wrapAnsi256");
    var wrapAnsi16m = /* @__PURE__ */ __name((fn, offset) => function() {
      const rgb = fn.apply(colorConvert, arguments);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    }, "wrapAnsi16m");
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [
            0,
            0
          ],
          bold: [
            1,
            22
          ],
          dim: [
            2,
            22
          ],
          italic: [
            3,
            23
          ],
          underline: [
            4,
            24
          ],
          inverse: [
            7,
            27
          ],
          hidden: [
            8,
            28
          ],
          strikethrough: [
            9,
            29
          ]
        },
        color: {
          black: [
            30,
            39
          ],
          red: [
            31,
            39
          ],
          green: [
            32,
            39
          ],
          yellow: [
            33,
            39
          ],
          blue: [
            34,
            39
          ],
          magenta: [
            35,
            39
          ],
          cyan: [
            36,
            39
          ],
          white: [
            37,
            39
          ],
          gray: [
            90,
            39
          ],
          redBright: [
            91,
            39
          ],
          greenBright: [
            92,
            39
          ],
          yellowBright: [
            93,
            39
          ],
          blueBright: [
            94,
            39
          ],
          magentaBright: [
            95,
            39
          ],
          cyanBright: [
            96,
            39
          ],
          whiteBright: [
            97,
            39
          ]
        },
        bgColor: {
          bgBlack: [
            40,
            49
          ],
          bgRed: [
            41,
            49
          ],
          bgGreen: [
            42,
            49
          ],
          bgYellow: [
            43,
            49
          ],
          bgBlue: [
            44,
            49
          ],
          bgMagenta: [
            45,
            49
          ],
          bgCyan: [
            46,
            49
          ],
          bgWhite: [
            47,
            49
          ],
          bgBlackBright: [
            100,
            49
          ],
          bgRedBright: [
            101,
            49
          ],
          bgGreenBright: [
            102,
            49
          ],
          bgYellowBright: [
            103,
            49
          ],
          bgBlueBright: [
            104,
            49
          ],
          bgMagentaBright: [
            105,
            49
          ],
          bgCyanBright: [
            106,
            49
          ],
          bgWhiteBright: [
            107,
            49
          ]
        }
      };
      styles.color.grey = styles.color.gray;
      for (const groupName of Object.keys(styles)) {
        const group = styles[groupName];
        for (const styleName of Object.keys(group)) {
          const style = group[styleName];
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
        Object.defineProperty(styles, "codes", {
          value: codes,
          enumerable: false
        });
      }
      const ansi2ansi = /* @__PURE__ */ __name((n) => n, "ansi2ansi");
      const rgb2rgb = /* @__PURE__ */ __name((r, g, b) => [
        r,
        g,
        b
      ], "rgb2rgb");
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      styles.color.ansi = {
        ansi: wrapAnsi16(ansi2ansi, 0)
      };
      styles.color.ansi256 = {
        ansi256: wrapAnsi256(ansi2ansi, 0)
      };
      styles.color.ansi16m = {
        rgb: wrapAnsi16m(rgb2rgb, 0)
      };
      styles.bgColor.ansi = {
        ansi: wrapAnsi16(ansi2ansi, 10)
      };
      styles.bgColor.ansi256 = {
        ansi256: wrapAnsi256(ansi2ansi, 10)
      };
      styles.bgColor.ansi16m = {
        rgb: wrapAnsi16m(rgb2rgb, 10)
      };
      for (let key of Object.keys(colorConvert)) {
        if (typeof colorConvert[key] !== "object") {
          continue;
        }
        const suite = colorConvert[key];
        if (key === "ansi16") {
          key = "ansi";
        }
        if ("ansi16" in suite) {
          styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
          styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
        }
        if ("ansi256" in suite) {
          styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
          styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
        }
        if ("rgb" in suite) {
          styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
          styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
        }
      }
      return styles;
    }
    __name(assembleStyles, "assembleStyles");
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/@babel/highlight/node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/@babel/highlight/node_modules/has-flag/index.js"(exports, module2) {
    "use strict";
    module2.exports = (flag, argv) => {
      argv = argv || process.argv;
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const pos = argv.indexOf(prefix + flag);
      const terminatorPos = argv.indexOf("--");
      return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
    };
  }
});

// node_modules/@babel/highlight/node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/@babel/highlight/node_modules/supports-color/index.js"(exports, module2) {
    "use strict";
    var os = require("os");
    var hasFlag = require_has_flag();
    var env = process.env;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
      forceColor = false;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = true;
    }
    if ("FORCE_COLOR" in env) {
      forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    __name(translateLevel, "translateLevel");
    function supportsColor(stream) {
      if (forceColor === false) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (stream && !stream.isTTY && forceColor !== true) {
        return 0;
      }
      const min = forceColor ? 1 : 0;
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if ([
          "TRAVIS",
          "CIRCLECI",
          "APPVEYOR",
          "GITLAB_CI"
        ].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      if (env.TERM === "dumb") {
        return min;
      }
      return min;
    }
    __name(supportsColor, "supportsColor");
    function getSupportLevel(stream) {
      const level = supportsColor(stream);
      return translateLevel(level);
    }
    __name(getSupportLevel, "getSupportLevel");
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: getSupportLevel(process.stdout),
      stderr: getSupportLevel(process.stderr)
    };
  }
});

// node_modules/@babel/highlight/node_modules/chalk/templates.js
var require_templates = __commonJS({
  "node_modules/@babel/highlight/node_modules/chalk/templates.js"(exports, module2) {
    "use strict";
    var TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
    var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
    var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
    var ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;
    var ESCAPES = /* @__PURE__ */ new Map([
      [
        "n",
        "\n"
      ],
      [
        "r",
        "\r"
      ],
      [
        "t",
        "	"
      ],
      [
        "b",
        "\b"
      ],
      [
        "f",
        "\f"
      ],
      [
        "v",
        "\v"
      ],
      [
        "0",
        "\0"
      ],
      [
        "\\",
        "\\"
      ],
      [
        "e",
        "\x1B"
      ],
      [
        "a",
        "\x07"
      ]
    ]);
    function unescape(c) {
      if (c[0] === "u" && c.length === 5 || c[0] === "x" && c.length === 3) {
        return String.fromCharCode(parseInt(c.slice(1), 16));
      }
      return ESCAPES.get(c) || c;
    }
    __name(unescape, "unescape");
    function parseArguments(name, args) {
      const results = [];
      const chunks = args.trim().split(/\s*,\s*/g);
      let matches;
      for (const chunk of chunks) {
        if (!isNaN(chunk)) {
          results.push(Number(chunk));
        } else if (matches = chunk.match(STRING_REGEX)) {
          results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
        } else {
          throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
        }
      }
      return results;
    }
    __name(parseArguments, "parseArguments");
    function parseStyle(style) {
      STYLE_REGEX.lastIndex = 0;
      const results = [];
      let matches;
      while ((matches = STYLE_REGEX.exec(style)) !== null) {
        const name = matches[1];
        if (matches[2]) {
          const args = parseArguments(name, matches[2]);
          results.push([
            name
          ].concat(args));
        } else {
          results.push([
            name
          ]);
        }
      }
      return results;
    }
    __name(parseStyle, "parseStyle");
    function buildStyle(chalk, styles) {
      const enabled = {};
      for (const layer of styles) {
        for (const style of layer.styles) {
          enabled[style[0]] = layer.inverse ? null : style.slice(1);
        }
      }
      let current = chalk;
      for (const styleName of Object.keys(enabled)) {
        if (Array.isArray(enabled[styleName])) {
          if (!(styleName in current)) {
            throw new Error(`Unknown Chalk style: ${styleName}`);
          }
          if (enabled[styleName].length > 0) {
            current = current[styleName].apply(current, enabled[styleName]);
          } else {
            current = current[styleName];
          }
        }
      }
      return current;
    }
    __name(buildStyle, "buildStyle");
    module2.exports = (chalk, tmp) => {
      const styles = [];
      const chunks = [];
      let chunk = [];
      tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
        if (escapeChar) {
          chunk.push(unescape(escapeChar));
        } else if (style) {
          const str = chunk.join("");
          chunk = [];
          chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
          styles.push({
            inverse,
            styles: parseStyle(style)
          });
        } else if (close) {
          if (styles.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          chunks.push(buildStyle(chalk, styles)(chunk.join("")));
          chunk = [];
          styles.pop();
        } else {
          chunk.push(chr);
        }
      });
      chunks.push(chunk.join(""));
      if (styles.length > 0) {
        const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
        throw new Error(errMsg);
      }
      return chunks.join("");
    };
  }
});

// node_modules/@babel/highlight/node_modules/chalk/index.js
var require_chalk = __commonJS({
  "node_modules/@babel/highlight/node_modules/chalk/index.js"(exports, module2) {
    "use strict";
    var escapeStringRegexp = require_escape_string_regexp();
    var ansiStyles = require_ansi_styles();
    var stdoutColor = require_supports_color().stdout;
    var template = require_templates();
    var isSimpleWindowsTerm = process.platform === "win32" && !(process.env.TERM || "").toLowerCase().startsWith("xterm");
    var levelMapping = [
      "ansi",
      "ansi",
      "ansi256",
      "ansi16m"
    ];
    var skipModels = /* @__PURE__ */ new Set([
      "gray"
    ]);
    var styles = /* @__PURE__ */ Object.create(null);
    function applyOptions(obj, options) {
      options = options || {};
      const scLevel = stdoutColor ? stdoutColor.level : 0;
      obj.level = options.level === void 0 ? scLevel : options.level;
      obj.enabled = "enabled" in options ? options.enabled : obj.level > 0;
    }
    __name(applyOptions, "applyOptions");
    function Chalk(options) {
      if (!this || !(this instanceof Chalk) || this.template) {
        const chalk = {};
        applyOptions(chalk, options);
        chalk.template = function() {
          const args = [].slice.call(arguments);
          return chalkTag.apply(null, [
            chalk.template
          ].concat(args));
        };
        Object.setPrototypeOf(chalk, Chalk.prototype);
        Object.setPrototypeOf(chalk.template, chalk);
        chalk.template.constructor = Chalk;
        return chalk.template;
      }
      applyOptions(this, options);
    }
    __name(Chalk, "Chalk");
    if (isSimpleWindowsTerm) {
      ansiStyles.blue.open = "\x1B[94m";
    }
    for (const key of Object.keys(ansiStyles)) {
      ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
      styles[key] = {
        get() {
          const codes = ansiStyles[key];
          return build.call(this, this._styles ? this._styles.concat(codes) : [
            codes
          ], this._empty, key);
        }
      };
    }
    styles.visible = {
      get() {
        return build.call(this, this._styles || [], true, "visible");
      }
    };
    ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), "g");
    for (const model of Object.keys(ansiStyles.color.ansi)) {
      if (skipModels.has(model)) {
        continue;
      }
      styles[model] = {
        get() {
          const level = this.level;
          return function() {
            const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
            const codes = {
              open,
              close: ansiStyles.color.close,
              closeRe: ansiStyles.color.closeRe
            };
            return build.call(this, this._styles ? this._styles.concat(codes) : [
              codes
            ], this._empty, model);
          };
        }
      };
    }
    ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), "g");
    for (const model1 of Object.keys(ansiStyles.bgColor.ansi)) {
      if (skipModels.has(model1)) {
        continue;
      }
      const bgModel = "bg" + model1[0].toUpperCase() + model1.slice(1);
      styles[bgModel] = {
        get() {
          const level = this.level;
          return function() {
            const open = ansiStyles.bgColor[levelMapping[level]][model1].apply(null, arguments);
            const codes = {
              open,
              close: ansiStyles.bgColor.close,
              closeRe: ansiStyles.bgColor.closeRe
            };
            return build.call(this, this._styles ? this._styles.concat(codes) : [
              codes
            ], this._empty, model1);
          };
        }
      };
    }
    var proto = Object.defineProperties(() => {
    }, styles);
    function build(_styles, _empty, key) {
      const builder = /* @__PURE__ */ __name(function() {
        return applyStyle.apply(builder, arguments);
      }, "builder");
      builder._styles = _styles;
      builder._empty = _empty;
      const self = this;
      Object.defineProperty(builder, "level", {
        enumerable: true,
        get() {
          return self.level;
        },
        set(level) {
          self.level = level;
        }
      });
      Object.defineProperty(builder, "enabled", {
        enumerable: true,
        get() {
          return self.enabled;
        },
        set(enabled) {
          self.enabled = enabled;
        }
      });
      builder.hasGrey = this.hasGrey || key === "gray" || key === "grey";
      builder.__proto__ = proto;
      return builder;
    }
    __name(build, "build");
    function applyStyle() {
      const args = arguments;
      const argsLen = args.length;
      let str = String(arguments[0]);
      if (argsLen === 0) {
        return "";
      }
      if (argsLen > 1) {
        for (let a = 1; a < argsLen; a++) {
          str += " " + args[a];
        }
      }
      if (!this.enabled || this.level <= 0 || !str) {
        return this._empty ? "" : str;
      }
      const originalDim = ansiStyles.dim.open;
      if (isSimpleWindowsTerm && this.hasGrey) {
        ansiStyles.dim.open = "";
      }
      for (const code of this._styles.slice().reverse()) {
        str = code.open + str.replace(code.closeRe, code.open) + code.close;
        str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
      }
      ansiStyles.dim.open = originalDim;
      return str;
    }
    __name(applyStyle, "applyStyle");
    function chalkTag(chalk, strings) {
      if (!Array.isArray(strings)) {
        return [].slice.call(arguments, 1).join(" ");
      }
      const args = [].slice.call(arguments, 2);
      const parts = [
        strings.raw[0]
      ];
      for (let i = 1; i < strings.length; i++) {
        parts.push(String(args[i - 1]).replace(/[{}\\]/g, "\\$&"));
        parts.push(String(strings.raw[i]));
      }
      return template(chalk, parts.join(""));
    }
    __name(chalkTag, "chalkTag");
    Object.defineProperties(Chalk.prototype, styles);
    module2.exports = Chalk();
    module2.exports.supportsColor = stdoutColor;
    module2.exports.default = module2.exports;
  }
});

// node_modules/@babel/highlight/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@babel/highlight/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = highlight;
    exports.getChalk = getChalk;
    exports.shouldHighlight = shouldHighlight;
    var _jsTokens = require_js_tokens();
    var _helperValidatorIdentifier = require_lib();
    var _chalk = require_chalk();
    var sometimesKeywords = /* @__PURE__ */ new Set([
      "as",
      "async",
      "from",
      "get",
      "of",
      "set"
    ]);
    function getDefs(chalk) {
      return {
        keyword: chalk.cyan,
        capitalized: chalk.yellow,
        jsxIdentifier: chalk.yellow,
        punctuator: chalk.yellow,
        number: chalk.magenta,
        string: chalk.green,
        regex: chalk.magenta,
        comment: chalk.grey,
        invalid: chalk.white.bgRed.bold
      };
    }
    __name(getDefs, "getDefs");
    var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
    var BRACKET = /^[()[\]{}]$/;
    var tokenize;
    {
      const JSX_TAG = /^[a-z][\w-]*$/i;
      const getTokenType = /* @__PURE__ */ __name(function(token, offset, text) {
        if (token.type === "name") {
          if ((0, _helperValidatorIdentifier.isKeyword)(token.value) || (0, _helperValidatorIdentifier.isStrictReservedWord)(token.value, true) || sometimesKeywords.has(token.value)) {
            return "keyword";
          }
          if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.slice(offset - 2, offset) == "</")) {
            return "jsxIdentifier";
          }
          if (token.value[0] !== token.value[0].toLowerCase()) {
            return "capitalized";
          }
        }
        if (token.type === "punctuator" && BRACKET.test(token.value)) {
          return "bracket";
        }
        if (token.type === "invalid" && (token.value === "@" || token.value === "#")) {
          return "punctuator";
        }
        return token.type;
      }, "getTokenType");
      tokenize = /* @__PURE__ */ __name(function* (text) {
        let match;
        while (match = _jsTokens.default.exec(text)) {
          const token = _jsTokens.matchToToken(match);
          yield {
            type: getTokenType(token, match.index, text),
            value: token.value
          };
        }
      }, "tokenize");
    }
    function highlightTokens(defs, text) {
      let highlighted = "";
      for (const { type, value } of tokenize(text)) {
        const colorize = defs[type];
        if (colorize) {
          highlighted += value.split(NEWLINE).map((str) => colorize(str)).join("\n");
        } else {
          highlighted += value;
        }
      }
      return highlighted;
    }
    __name(highlightTokens, "highlightTokens");
    function shouldHighlight(options) {
      return !!_chalk.supportsColor || options.forceColor;
    }
    __name(shouldHighlight, "shouldHighlight");
    function getChalk(options) {
      return options.forceColor ? new _chalk.constructor({
        enabled: true,
        level: 1
      }) : _chalk;
    }
    __name(getChalk, "getChalk");
    function highlight(code, options = {}) {
      if (code !== "" && shouldHighlight(options)) {
        const chalk = getChalk(options);
        const defs = getDefs(chalk);
        return highlightTokens(defs, code);
      } else {
        return code;
      }
    }
    __name(highlight, "highlight");
  }
});

// node_modules/@babel/code-frame/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/@babel/code-frame/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.codeFrameColumns = codeFrameColumns;
    exports.default = _default;
    var _highlight = require_lib2();
    var deprecationWarningShown = false;
    function getDefs(chalk) {
      return {
        gutter: chalk.grey,
        marker: chalk.red.bold,
        message: chalk.red.bold
      };
    }
    __name(getDefs, "getDefs");
    var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
    function getMarkerLines(loc, source, opts) {
      const startLoc = Object.assign({
        column: 0,
        line: -1
      }, loc.start);
      const endLoc = Object.assign({}, startLoc, loc.end);
      const { linesAbove = 2, linesBelow = 3 } = opts || {};
      const startLine = startLoc.line;
      const startColumn = startLoc.column;
      const endLine = endLoc.line;
      const endColumn = endLoc.column;
      let start = Math.max(startLine - (linesAbove + 1), 0);
      let end = Math.min(source.length, endLine + linesBelow);
      if (startLine === -1) {
        start = 0;
      }
      if (endLine === -1) {
        end = source.length;
      }
      const lineDiff = endLine - startLine;
      const markerLines = {};
      if (lineDiff) {
        for (let i = 0; i <= lineDiff; i++) {
          const lineNumber = i + startLine;
          if (!startColumn) {
            markerLines[lineNumber] = true;
          } else if (i === 0) {
            const sourceLength = source[lineNumber - 1].length;
            markerLines[lineNumber] = [
              startColumn,
              sourceLength - startColumn + 1
            ];
          } else if (i === lineDiff) {
            markerLines[lineNumber] = [
              0,
              endColumn
            ];
          } else {
            const sourceLength1 = source[lineNumber - i].length;
            markerLines[lineNumber] = [
              0,
              sourceLength1
            ];
          }
        }
      } else {
        if (startColumn === endColumn) {
          if (startColumn) {
            markerLines[startLine] = [
              startColumn,
              0
            ];
          } else {
            markerLines[startLine] = true;
          }
        } else {
          markerLines[startLine] = [
            startColumn,
            endColumn - startColumn
          ];
        }
      }
      return {
        start,
        end,
        markerLines
      };
    }
    __name(getMarkerLines, "getMarkerLines");
    function codeFrameColumns(rawLines, loc, opts = {}) {
      const highlighted = (opts.highlightCode || opts.forceColor) && (0, _highlight.shouldHighlight)(opts);
      const chalk = (0, _highlight.getChalk)(opts);
      const defs = getDefs(chalk);
      const maybeHighlight = /* @__PURE__ */ __name((chalkFn, string) => {
        return highlighted ? chalkFn(string) : string;
      }, "maybeHighlight");
      const lines = rawLines.split(NEWLINE);
      const { start, end, markerLines } = getMarkerLines(loc, lines, opts);
      const hasColumns = loc.start && typeof loc.start.column === "number";
      const numberMaxWidth = String(end).length;
      const highlightedLines = highlighted ? (0, _highlight.default)(rawLines, opts) : rawLines;
      let frame = highlightedLines.split(NEWLINE, end).slice(start, end).map((line, index) => {
        const number = start + 1 + index;
        const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
        const gutter = ` ${paddedNumber} |`;
        const hasMarker = markerLines[number];
        const lastMarkerLine = !markerLines[number + 1];
        if (hasMarker) {
          let markerLine = "";
          if (Array.isArray(hasMarker)) {
            const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
            const numberOfMarkers = hasMarker[1] || 1;
            markerLine = [
              "\n ",
              maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")),
              " ",
              markerSpacing,
              maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)
            ].join("");
            if (lastMarkerLine && opts.message) {
              markerLine += " " + maybeHighlight(defs.message, opts.message);
            }
          }
          return [
            maybeHighlight(defs.marker, ">"),
            maybeHighlight(defs.gutter, gutter),
            line.length > 0 ? ` ${line}` : "",
            markerLine
          ].join("");
        } else {
          return ` ${maybeHighlight(defs.gutter, gutter)}${line.length > 0 ? ` ${line}` : ""}`;
        }
      }).join("\n");
      if (opts.message && !hasColumns) {
        frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}
${frame}`;
      }
      if (highlighted) {
        return chalk.reset(frame);
      } else {
        return frame;
      }
    }
    __name(codeFrameColumns, "codeFrameColumns");
    function _default(rawLines, lineNumber, colNumber, opts = {}) {
      if (!deprecationWarningShown) {
        deprecationWarningShown = true;
        const message = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";
        if (process.emitWarning) {
          process.emitWarning(message, "DeprecationWarning");
        } else {
          const deprecationError = new Error(message);
          deprecationError.name = "DeprecationWarning";
          console.warn(new Error(message));
        }
      }
      colNumber = Math.max(colNumber, 0);
      const location = {
        start: {
          column: colNumber,
          line: lineNumber
        }
      };
      return codeFrameColumns(rawLines, location, opts);
    }
    __name(_default, "_default");
  }
});

// node_modules/parse-json/index.js
var require_parse_json = __commonJS({
  "node_modules/parse-json/index.js"(exports, module2) {
    "use strict";
    var errorEx = require_error_ex();
    var fallback = require_json_parse_even_better_errors();
    var { default: LinesAndColumns } = require_build();
    var { codeFrameColumns } = require_lib3();
    var JSONError = errorEx("JSONError", {
      fileName: errorEx.append("in %s"),
      codeFrame: errorEx.append("\n\n%s\n")
    });
    var parseJson = /* @__PURE__ */ __name((string, reviver, filename) => {
      if (typeof reviver === "string") {
        filename = reviver;
        reviver = null;
      }
      try {
        try {
          return JSON.parse(string, reviver);
        } catch (error) {
          fallback(string, reviver);
          throw error;
        }
      } catch (error1) {
        error1.message = error1.message.replace(/\n/g, "");
        const indexMatch = error1.message.match(/in JSON at position (\d+) while parsing/);
        const jsonError = new JSONError(error1);
        if (filename) {
          jsonError.fileName = filename;
        }
        if (indexMatch && indexMatch.length > 0) {
          const lines = new LinesAndColumns(string);
          const index = Number(indexMatch[1]);
          const location = lines.locationForIndex(index);
          const codeFrame = codeFrameColumns(string, {
            start: {
              line: location.line + 1,
              column: location.column + 1
            }
          }, {
            highlightCode: true
          });
          jsonError.codeFrame = codeFrame;
        }
        throw jsonError;
      }
    }, "parseJson");
    parseJson.JSONError = JSONError;
    module2.exports = parseJson;
  }
});

// node_modules/normalize-package-data/node_modules/semver/semver.js
var require_semver = __commonJS({
  "node_modules/normalize-package-data/node_modules/semver/semver.js"(exports, module2) {
    exports = module2.exports = SemVer;
    var debug;
    if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
      debug = /* @__PURE__ */ __name(function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("SEMVER");
        console.log.apply(console, args);
      }, "debug");
    } else {
      debug = /* @__PURE__ */ __name(function() {
      }, "debug");
    }
    exports.SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var re = exports.re = [];
    var src = exports.src = [];
    var R = 0;
    var NUMERICIDENTIFIER = R++;
    src[NUMERICIDENTIFIER] = "0|[1-9]\\d*";
    var NUMERICIDENTIFIERLOOSE = R++;
    src[NUMERICIDENTIFIERLOOSE] = "[0-9]+";
    var NONNUMERICIDENTIFIER = R++;
    src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    var MAINVERSION = R++;
    src[MAINVERSION] = "(" + src[NUMERICIDENTIFIER] + ")\\.(" + src[NUMERICIDENTIFIER] + ")\\.(" + src[NUMERICIDENTIFIER] + ")";
    var MAINVERSIONLOOSE = R++;
    src[MAINVERSIONLOOSE] = "(" + src[NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[NUMERICIDENTIFIERLOOSE] + ")";
    var PRERELEASEIDENTIFIER = R++;
    src[PRERELEASEIDENTIFIER] = "(?:" + src[NUMERICIDENTIFIER] + "|" + src[NONNUMERICIDENTIFIER] + ")";
    var PRERELEASEIDENTIFIERLOOSE = R++;
    src[PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[NUMERICIDENTIFIERLOOSE] + "|" + src[NONNUMERICIDENTIFIER] + ")";
    var PRERELEASE = R++;
    src[PRERELEASE] = "(?:-(" + src[PRERELEASEIDENTIFIER] + "(?:\\." + src[PRERELEASEIDENTIFIER] + ")*))";
    var PRERELEASELOOSE = R++;
    src[PRERELEASELOOSE] = "(?:-?(" + src[PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[PRERELEASEIDENTIFIERLOOSE] + ")*))";
    var BUILDIDENTIFIER = R++;
    src[BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
    var BUILD = R++;
    src[BUILD] = "(?:\\+(" + src[BUILDIDENTIFIER] + "(?:\\." + src[BUILDIDENTIFIER] + ")*))";
    var FULL = R++;
    var FULLPLAIN = "v?" + src[MAINVERSION] + src[PRERELEASE] + "?" + src[BUILD] + "?";
    src[FULL] = "^" + FULLPLAIN + "$";
    var LOOSEPLAIN = "[v=\\s]*" + src[MAINVERSIONLOOSE] + src[PRERELEASELOOSE] + "?" + src[BUILD] + "?";
    var LOOSE = R++;
    src[LOOSE] = "^" + LOOSEPLAIN + "$";
    var GTLT = R++;
    src[GTLT] = "((?:<|>)?=?)";
    var XRANGEIDENTIFIERLOOSE = R++;
    src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
    var XRANGEIDENTIFIER = R++;
    src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + "|x|X|\\*";
    var XRANGEPLAIN = R++;
    src[XRANGEPLAIN] = "[v=\\s]*(" + src[XRANGEIDENTIFIER] + ")(?:\\.(" + src[XRANGEIDENTIFIER] + ")(?:\\.(" + src[XRANGEIDENTIFIER] + ")(?:" + src[PRERELEASE] + ")?" + src[BUILD] + "?)?)?";
    var XRANGEPLAINLOOSE = R++;
    src[XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[XRANGEIDENTIFIERLOOSE] + ")(?:" + src[PRERELEASELOOSE] + ")?" + src[BUILD] + "?)?)?";
    var XRANGE = R++;
    src[XRANGE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAIN] + "$";
    var XRANGELOOSE = R++;
    src[XRANGELOOSE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAINLOOSE] + "$";
    var COERCE = R++;
    src[COERCE] = "(?:^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
    var LONETILDE = R++;
    src[LONETILDE] = "(?:~>?)";
    var TILDETRIM = R++;
    src[TILDETRIM] = "(\\s*)" + src[LONETILDE] + "\\s+";
    re[TILDETRIM] = new RegExp(src[TILDETRIM], "g");
    var tildeTrimReplace = "$1~";
    var TILDE = R++;
    src[TILDE] = "^" + src[LONETILDE] + src[XRANGEPLAIN] + "$";
    var TILDELOOSE = R++;
    src[TILDELOOSE] = "^" + src[LONETILDE] + src[XRANGEPLAINLOOSE] + "$";
    var LONECARET = R++;
    src[LONECARET] = "(?:\\^)";
    var CARETTRIM = R++;
    src[CARETTRIM] = "(\\s*)" + src[LONECARET] + "\\s+";
    re[CARETTRIM] = new RegExp(src[CARETTRIM], "g");
    var caretTrimReplace = "$1^";
    var CARET = R++;
    src[CARET] = "^" + src[LONECARET] + src[XRANGEPLAIN] + "$";
    var CARETLOOSE = R++;
    src[CARETLOOSE] = "^" + src[LONECARET] + src[XRANGEPLAINLOOSE] + "$";
    var COMPARATORLOOSE = R++;
    src[COMPARATORLOOSE] = "^" + src[GTLT] + "\\s*(" + LOOSEPLAIN + ")$|^$";
    var COMPARATOR = R++;
    src[COMPARATOR] = "^" + src[GTLT] + "\\s*(" + FULLPLAIN + ")$|^$";
    var COMPARATORTRIM = R++;
    src[COMPARATORTRIM] = "(\\s*)" + src[GTLT] + "\\s*(" + LOOSEPLAIN + "|" + src[XRANGEPLAIN] + ")";
    re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], "g");
    var comparatorTrimReplace = "$1$2$3";
    var HYPHENRANGE = R++;
    src[HYPHENRANGE] = "^\\s*(" + src[XRANGEPLAIN] + ")\\s+-\\s+(" + src[XRANGEPLAIN] + ")\\s*$";
    var HYPHENRANGELOOSE = R++;
    src[HYPHENRANGELOOSE] = "^\\s*(" + src[XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[XRANGEPLAINLOOSE] + ")\\s*$";
    var STAR = R++;
    src[STAR] = "(<|>)?=?\\s*\\*";
    for (i = 0; i < R; i++) {
      debug(i, src[i]);
      if (!re[i]) {
        re[i] = new RegExp(src[i]);
      }
    }
    var i;
    exports.parse = parse;
    function parse(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== "string") {
        return null;
      }
      if (version.length > MAX_LENGTH) {
        return null;
      }
      var r = options.loose ? re[LOOSE] : re[FULL];
      if (!r.test(version)) {
        return null;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        return null;
      }
    }
    __name(parse, "parse");
    exports.valid = valid;
    function valid(version, options) {
      var v = parse(version, options);
      return v ? v.version : null;
    }
    __name(valid, "valid");
    exports.clean = clean;
    function clean(version, options) {
      var s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }
    __name(clean, "clean");
    exports.SemVer = SemVer;
    function SemVer(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        if (version.loose === options.loose) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError("Invalid Version: " + version);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
      }
      if (!(this instanceof SemVer)) {
        return new SemVer(version, options);
      }
      debug("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL]);
      if (!m) {
        throw new TypeError("Invalid Version: " + version);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map(function(id) {
          if (/^[0-9]+$/.test(id)) {
            var num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    __name(SemVer, "SemVer");
    SemVer.prototype.format = function() {
      this.version = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease.length) {
        this.version += "-" + this.prerelease.join(".");
      }
      return this.version;
    };
    SemVer.prototype.toString = function() {
      return this.version;
    };
    SemVer.prototype.compare = function(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return this.compareMain(other) || this.comparePre(other);
    };
    SemVer.prototype.compareMain = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    };
    SemVer.prototype.comparePre = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      var i2 = 0;
      do {
        var a = this.prerelease[i2];
        var b = other.prerelease[i2];
        debug("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer.prototype.inc = function(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier);
          this.inc("pre", identifier);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier);
          }
          this.inc("pre", identifier);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [
              0
            ];
          } else {
            var i2 = this.prerelease.length;
            while (--i2 >= 0) {
              if (typeof this.prerelease[i2] === "number") {
                this.prerelease[i2]++;
                i2 = -2;
              }
            }
            if (i2 === -1) {
              this.prerelease.push(0);
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [
                  identifier,
                  0
                ];
              }
            } else {
              this.prerelease = [
                identifier,
                0
              ];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: " + release);
      }
      this.format();
      this.raw = this.version;
      return this;
    };
    exports.inc = inc;
    function inc(version, release, loose, identifier) {
      if (typeof loose === "string") {
        identifier = loose;
        loose = void 0;
      }
      try {
        return new SemVer(version, loose).inc(release, identifier).version;
      } catch (er) {
        return null;
      }
    }
    __name(inc, "inc");
    exports.diff = diff;
    function diff(version1, version2) {
      if (eq(version1, version2)) {
        return null;
      } else {
        var v1 = parse(version1);
        var v2 = parse(version2);
        var prefix = "";
        if (v1.prerelease.length || v2.prerelease.length) {
          prefix = "pre";
          var defaultResult = "prerelease";
        }
        for (var key in v1) {
          if (key === "major" || key === "minor" || key === "patch") {
            if (v1[key] !== v2[key]) {
              return prefix + key;
            }
          }
        }
        return defaultResult;
      }
    }
    __name(diff, "diff");
    exports.compareIdentifiers = compareIdentifiers;
    var numeric = /^[0-9]+$/;
    function compareIdentifiers(a, b) {
      var anum = numeric.test(a);
      var bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }
    __name(compareIdentifiers, "compareIdentifiers");
    exports.rcompareIdentifiers = rcompareIdentifiers;
    function rcompareIdentifiers(a, b) {
      return compareIdentifiers(b, a);
    }
    __name(rcompareIdentifiers, "rcompareIdentifiers");
    exports.major = major;
    function major(a, loose) {
      return new SemVer(a, loose).major;
    }
    __name(major, "major");
    exports.minor = minor;
    function minor(a, loose) {
      return new SemVer(a, loose).minor;
    }
    __name(minor, "minor");
    exports.patch = patch;
    function patch(a, loose) {
      return new SemVer(a, loose).patch;
    }
    __name(patch, "patch");
    exports.compare = compare;
    function compare(a, b, loose) {
      return new SemVer(a, loose).compare(new SemVer(b, loose));
    }
    __name(compare, "compare");
    exports.compareLoose = compareLoose;
    function compareLoose(a, b) {
      return compare(a, b, true);
    }
    __name(compareLoose, "compareLoose");
    exports.rcompare = rcompare;
    function rcompare(a, b, loose) {
      return compare(b, a, loose);
    }
    __name(rcompare, "rcompare");
    exports.sort = sort;
    function sort(list, loose) {
      return list.sort(function(a, b) {
        return exports.compare(a, b, loose);
      });
    }
    __name(sort, "sort");
    exports.rsort = rsort;
    function rsort(list, loose) {
      return list.sort(function(a, b) {
        return exports.rcompare(a, b, loose);
      });
    }
    __name(rsort, "rsort");
    exports.gt = gt;
    function gt(a, b, loose) {
      return compare(a, b, loose) > 0;
    }
    __name(gt, "gt");
    exports.lt = lt;
    function lt(a, b, loose) {
      return compare(a, b, loose) < 0;
    }
    __name(lt, "lt");
    exports.eq = eq;
    function eq(a, b, loose) {
      return compare(a, b, loose) === 0;
    }
    __name(eq, "eq");
    exports.neq = neq;
    function neq(a, b, loose) {
      return compare(a, b, loose) !== 0;
    }
    __name(neq, "neq");
    exports.gte = gte;
    function gte(a, b, loose) {
      return compare(a, b, loose) >= 0;
    }
    __name(gte, "gte");
    exports.lte = lte;
    function lte(a, b, loose) {
      return compare(a, b, loose) <= 0;
    }
    __name(lte, "lte");
    exports.cmp = cmp;
    function cmp(a, op, b, loose) {
      switch (op) {
        case "===":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a === b;
        case "!==":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError("Invalid operator: " + op);
      }
    }
    __name(cmp, "cmp");
    exports.Comparator = Comparator;
    function Comparator(comp, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      if (!(this instanceof Comparator)) {
        return new Comparator(comp, options);
      }
      debug("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug("comp", this);
    }
    __name(Comparator, "Comparator");
    var ANY = {};
    Comparator.prototype.parse = function(comp) {
      var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
      var m = comp.match(r);
      if (!m) {
        throw new TypeError("Invalid comparator: " + comp);
      }
      this.operator = m[1];
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    };
    Comparator.prototype.toString = function() {
      return this.value;
    };
    Comparator.prototype.test = function(version) {
      debug("Comparator.test", version, this.options.loose);
      if (this.semver === ANY) {
        return true;
      }
      if (typeof version === "string") {
        version = new SemVer(version, this.options);
      }
      return cmp(version, this.operator, this.semver, this.options);
    };
    Comparator.prototype.intersects = function(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      var rangeTmp;
      if (this.operator === "") {
        rangeTmp = new Range(comp.value, options);
        return satisfies(this.value, rangeTmp, options);
      } else if (comp.operator === "") {
        rangeTmp = new Range(this.value, options);
        return satisfies(comp.semver, rangeTmp, options);
      }
      var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
      var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
      var sameSemVer = this.semver.version === comp.semver.version;
      var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
      var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && (this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<");
      var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && (this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">");
      return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
    };
    exports.Range = Range;
    function Range(range, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range(range.raw, options);
        }
      }
      if (range instanceof Comparator) {
        return new Range(range.value, options);
      }
      if (!(this instanceof Range)) {
        return new Range(range, options);
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range;
      this.set = range.split(/\s*\|\|\s*/).map(function(range2) {
        return this.parseRange(range2.trim());
      }, this).filter(function(c) {
        return c.length;
      });
      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: " + range);
      }
      this.format();
    }
    __name(Range, "Range");
    Range.prototype.format = function() {
      this.range = this.set.map(function(comps) {
        return comps.join(" ").trim();
      }).join("||").trim();
      return this.range;
    };
    Range.prototype.toString = function() {
      return this.range;
    };
    Range.prototype.parseRange = function(range) {
      var loose = this.options.loose;
      range = range.trim();
      var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
      range = range.replace(hr, hyphenReplace);
      debug("hyphen replace", range);
      range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
      debug("comparator trim", range, re[COMPARATORTRIM]);
      range = range.replace(re[TILDETRIM], tildeTrimReplace);
      range = range.replace(re[CARETTRIM], caretTrimReplace);
      range = range.split(/\s+/).join(" ");
      var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
      var set = range.split(" ").map(function(comp) {
        return parseComparator(comp, this.options);
      }, this).join(" ").split(/\s+/);
      if (this.options.loose) {
        set = set.filter(function(comp) {
          return !!comp.match(compRe);
        });
      }
      set = set.map(function(comp) {
        return new Comparator(comp, this.options);
      }, this);
      return set;
    };
    Range.prototype.intersects = function(range, options) {
      if (!(range instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(thisComparators) {
        return thisComparators.every(function(thisComparator) {
          return range.set.some(function(rangeComparators) {
            return rangeComparators.every(function(rangeComparator) {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    };
    exports.toComparators = toComparators;
    function toComparators(range, options) {
      return new Range(range, options).set.map(function(comp) {
        return comp.map(function(c) {
          return c.value;
        }).join(" ").trim().split(" ");
      });
    }
    __name(toComparators, "toComparators");
    function parseComparator(comp, options) {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    }
    __name(parseComparator, "parseComparator");
    function isX(id) {
      return !id || id.toLowerCase() === "x" || id === "*";
    }
    __name(isX, "isX");
    function replaceTildes(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceTilde(comp2, options);
      }).join(" ");
    }
    __name(replaceTildes, "replaceTildes");
    function replaceTilde(comp, options) {
      var r = options.loose ? re[TILDELOOSE] : re[TILDE];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug("tilde", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
        }
        debug("tilde return", ret);
        return ret;
      });
    }
    __name(replaceTilde, "replaceTilde");
    function replaceCarets(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceCaret(comp2, options);
      }).join(" ");
    }
    __name(replaceCarets, "replaceCarets");
    function replaceCaret(comp, options) {
      debug("caret", comp, options);
      var r = options.loose ? re[CARETLOOSE] : re[CARET];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug("caret", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          if (M === "0") {
            ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
          } else {
            ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
          }
        }
        debug("caret return", ret);
        return ret;
      });
    }
    __name(replaceCaret, "replaceCaret");
    function replaceXRanges(comp, options) {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map(function(comp2) {
        return replaceXRange(comp2, options);
      }).join(" ");
    }
    __name(replaceXRanges, "replaceXRanges");
    function replaceXRange(comp, options) {
      comp = comp.trim();
      var r = options.loose ? re[XRANGELOOSE] : re[XRANGE];
      return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        var xM = isX(M);
        var xm = xM || isX(m);
        var xp = xm || isX(p);
        var anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          ret = gtlt + M + "." + m + "." + p;
        } else if (xm) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (xp) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        }
        debug("xRange return", ret);
        return ret;
      });
    }
    __name(replaceXRange, "replaceXRange");
    function replaceStars(comp, options) {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[STAR], "");
    }
    __name(replaceStars, "replaceStars");
    function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = ">=" + fM + ".0.0";
      } else if (isX(fp)) {
        from = ">=" + fM + "." + fm + ".0";
      } else {
        from = ">=" + from;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = "<" + (+tM + 1) + ".0.0";
      } else if (isX(tp)) {
        to = "<" + tM + "." + (+tm + 1) + ".0";
      } else if (tpr) {
        to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
      } else {
        to = "<=" + to;
      }
      return (from + " " + to).trim();
    }
    __name(hyphenReplace, "hyphenReplace");
    Range.prototype.test = function(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        version = new SemVer(version, this.options);
      }
      for (var i2 = 0; i2 < this.set.length; i2++) {
        if (testSet(this.set[i2], version, this.options)) {
          return true;
        }
      }
      return false;
    };
    function testSet(set, version, options) {
      for (var i2 = 0; i2 < set.length; i2++) {
        if (!set[i2].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (i2 = 0; i2 < set.length; i2++) {
          debug(set[i2].semver);
          if (set[i2].semver === ANY) {
            continue;
          }
          if (set[i2].semver.prerelease.length > 0) {
            var allowed = set[i2].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }
    __name(testSet, "testSet");
    exports.satisfies = satisfies;
    function satisfies(version, range, options) {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    }
    __name(satisfies, "satisfies");
    exports.maxSatisfying = maxSatisfying;
    function maxSatisfying(versions, range, options) {
      var max = null;
      var maxSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    }
    __name(maxSatisfying, "maxSatisfying");
    exports.minSatisfying = minSatisfying;
    function minSatisfying(versions, range, options) {
      var min = null;
      var minSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    }
    __name(minSatisfying, "minSatisfying");
    exports.minVersion = minVersion;
    function minVersion(range, loose) {
      range = new Range(range, loose);
      var minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        comparators.forEach(function(comparator) {
          var compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!minver || gt(minver, compver)) {
                minver = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error("Unexpected operation: " + comparator.operator);
          }
        });
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }
    __name(minVersion, "minVersion");
    exports.validRange = validRange;
    function validRange(range, options) {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }
    __name(validRange, "validRange");
    exports.ltr = ltr;
    function ltr(version, range, options) {
      return outside(version, range, "<", options);
    }
    __name(ltr, "ltr");
    exports.gtr = gtr;
    function gtr(version, range, options) {
      return outside(version, range, ">", options);
    }
    __name(gtr, "gtr");
    exports.outside = outside;
    function outside(version, range, hilo, options) {
      version = new SemVer(version, options);
      range = new Range(range, options);
      var gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        var high = null;
        var low = null;
        comparators.forEach(function(comparator) {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    }
    __name(outside, "outside");
    exports.prerelease = prerelease;
    function prerelease(version, options) {
      var parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }
    __name(prerelease, "prerelease");
    exports.intersects = intersects;
    function intersects(r1, r2, options) {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2);
    }
    __name(intersects, "intersects");
    exports.coerce = coerce;
    function coerce(version) {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== "string") {
        return null;
      }
      var match = version.match(re[COERCE]);
      if (match == null) {
        return null;
      }
      return parse(match[1] + "." + (match[2] || "0") + "." + (match[3] || "0"));
    }
    __name(coerce, "coerce");
  }
});

// node_modules/spdx-license-ids/index.json
var require_spdx_license_ids = __commonJS({
  "node_modules/spdx-license-ids/index.json"(exports, module2) {
    module2.exports = [
      "0BSD",
      "AAL",
      "ADSL",
      "AFL-1.1",
      "AFL-1.2",
      "AFL-2.0",
      "AFL-2.1",
      "AFL-3.0",
      "AGPL-1.0-only",
      "AGPL-1.0-or-later",
      "AGPL-3.0-only",
      "AGPL-3.0-or-later",
      "AMDPLPA",
      "AML",
      "AMPAS",
      "ANTLR-PD",
      "ANTLR-PD-fallback",
      "APAFML",
      "APL-1.0",
      "APSL-1.0",
      "APSL-1.1",
      "APSL-1.2",
      "APSL-2.0",
      "Abstyles",
      "Adobe-2006",
      "Adobe-Glyph",
      "Afmparse",
      "Aladdin",
      "Apache-1.0",
      "Apache-1.1",
      "Apache-2.0",
      "App-s2p",
      "Arphic-1999",
      "Artistic-1.0",
      "Artistic-1.0-Perl",
      "Artistic-1.0-cl8",
      "Artistic-2.0",
      "BSD-1-Clause",
      "BSD-2-Clause",
      "BSD-2-Clause-Patent",
      "BSD-2-Clause-Views",
      "BSD-3-Clause",
      "BSD-3-Clause-Attribution",
      "BSD-3-Clause-Clear",
      "BSD-3-Clause-LBNL",
      "BSD-3-Clause-Modification",
      "BSD-3-Clause-No-Military-License",
      "BSD-3-Clause-No-Nuclear-License",
      "BSD-3-Clause-No-Nuclear-License-2014",
      "BSD-3-Clause-No-Nuclear-Warranty",
      "BSD-3-Clause-Open-MPI",
      "BSD-4-Clause",
      "BSD-4-Clause-Shortened",
      "BSD-4-Clause-UC",
      "BSD-Protection",
      "BSD-Source-Code",
      "BSL-1.0",
      "BUSL-1.1",
      "Baekmuk",
      "Bahyph",
      "Barr",
      "Beerware",
      "BitTorrent-1.0",
      "BitTorrent-1.1",
      "Bitstream-Vera",
      "BlueOak-1.0.0",
      "Borceux",
      "C-UDA-1.0",
      "CAL-1.0",
      "CAL-1.0-Combined-Work-Exception",
      "CATOSL-1.1",
      "CC-BY-1.0",
      "CC-BY-2.0",
      "CC-BY-2.5",
      "CC-BY-2.5-AU",
      "CC-BY-3.0",
      "CC-BY-3.0-AT",
      "CC-BY-3.0-DE",
      "CC-BY-3.0-IGO",
      "CC-BY-3.0-NL",
      "CC-BY-3.0-US",
      "CC-BY-4.0",
      "CC-BY-NC-1.0",
      "CC-BY-NC-2.0",
      "CC-BY-NC-2.5",
      "CC-BY-NC-3.0",
      "CC-BY-NC-3.0-DE",
      "CC-BY-NC-4.0",
      "CC-BY-NC-ND-1.0",
      "CC-BY-NC-ND-2.0",
      "CC-BY-NC-ND-2.5",
      "CC-BY-NC-ND-3.0",
      "CC-BY-NC-ND-3.0-DE",
      "CC-BY-NC-ND-3.0-IGO",
      "CC-BY-NC-ND-4.0",
      "CC-BY-NC-SA-1.0",
      "CC-BY-NC-SA-2.0",
      "CC-BY-NC-SA-2.0-FR",
      "CC-BY-NC-SA-2.0-UK",
      "CC-BY-NC-SA-2.5",
      "CC-BY-NC-SA-3.0",
      "CC-BY-NC-SA-3.0-DE",
      "CC-BY-NC-SA-3.0-IGO",
      "CC-BY-NC-SA-4.0",
      "CC-BY-ND-1.0",
      "CC-BY-ND-2.0",
      "CC-BY-ND-2.5",
      "CC-BY-ND-3.0",
      "CC-BY-ND-3.0-DE",
      "CC-BY-ND-4.0",
      "CC-BY-SA-1.0",
      "CC-BY-SA-2.0",
      "CC-BY-SA-2.0-UK",
      "CC-BY-SA-2.1-JP",
      "CC-BY-SA-2.5",
      "CC-BY-SA-3.0",
      "CC-BY-SA-3.0-AT",
      "CC-BY-SA-3.0-DE",
      "CC-BY-SA-4.0",
      "CC-PDDC",
      "CC0-1.0",
      "CDDL-1.0",
      "CDDL-1.1",
      "CDL-1.0",
      "CDLA-Permissive-1.0",
      "CDLA-Permissive-2.0",
      "CDLA-Sharing-1.0",
      "CECILL-1.0",
      "CECILL-1.1",
      "CECILL-2.0",
      "CECILL-2.1",
      "CECILL-B",
      "CECILL-C",
      "CERN-OHL-1.1",
      "CERN-OHL-1.2",
      "CERN-OHL-P-2.0",
      "CERN-OHL-S-2.0",
      "CERN-OHL-W-2.0",
      "CNRI-Jython",
      "CNRI-Python",
      "CNRI-Python-GPL-Compatible",
      "COIL-1.0",
      "CPAL-1.0",
      "CPL-1.0",
      "CPOL-1.02",
      "CUA-OPL-1.0",
      "Caldera",
      "ClArtistic",
      "Community-Spec-1.0",
      "Condor-1.1",
      "Crossword",
      "CrystalStacker",
      "Cube",
      "D-FSL-1.0",
      "DL-DE-BY-2.0",
      "DOC",
      "DRL-1.0",
      "DSDP",
      "Dotseqn",
      "ECL-1.0",
      "ECL-2.0",
      "EFL-1.0",
      "EFL-2.0",
      "EPICS",
      "EPL-1.0",
      "EPL-2.0",
      "EUDatagrid",
      "EUPL-1.0",
      "EUPL-1.1",
      "EUPL-1.2",
      "Elastic-2.0",
      "Entessa",
      "ErlPL-1.1",
      "Eurosym",
      "FDK-AAC",
      "FSFAP",
      "FSFUL",
      "FSFULLR",
      "FTL",
      "Fair",
      "Frameworx-1.0",
      "FreeBSD-DOC",
      "FreeImage",
      "GD",
      "GFDL-1.1-invariants-only",
      "GFDL-1.1-invariants-or-later",
      "GFDL-1.1-no-invariants-only",
      "GFDL-1.1-no-invariants-or-later",
      "GFDL-1.1-only",
      "GFDL-1.1-or-later",
      "GFDL-1.2-invariants-only",
      "GFDL-1.2-invariants-or-later",
      "GFDL-1.2-no-invariants-only",
      "GFDL-1.2-no-invariants-or-later",
      "GFDL-1.2-only",
      "GFDL-1.2-or-later",
      "GFDL-1.3-invariants-only",
      "GFDL-1.3-invariants-or-later",
      "GFDL-1.3-no-invariants-only",
      "GFDL-1.3-no-invariants-or-later",
      "GFDL-1.3-only",
      "GFDL-1.3-or-later",
      "GL2PS",
      "GLWTPL",
      "GPL-1.0-only",
      "GPL-1.0-or-later",
      "GPL-2.0-only",
      "GPL-2.0-or-later",
      "GPL-3.0-only",
      "GPL-3.0-or-later",
      "Giftware",
      "Glide",
      "Glulxe",
      "HPND",
      "HPND-sell-variant",
      "HTMLTIDY",
      "HaskellReport",
      "Hippocratic-2.1",
      "IBM-pibs",
      "ICU",
      "IJG",
      "IPA",
      "IPL-1.0",
      "ISC",
      "ImageMagick",
      "Imlib2",
      "Info-ZIP",
      "Intel",
      "Intel-ACPI",
      "Interbase-1.0",
      "JPNIC",
      "JSON",
      "Jam",
      "JasPer-2.0",
      "LAL-1.2",
      "LAL-1.3",
      "LGPL-2.0-only",
      "LGPL-2.0-or-later",
      "LGPL-2.1-only",
      "LGPL-2.1-or-later",
      "LGPL-3.0-only",
      "LGPL-3.0-or-later",
      "LGPLLR",
      "LPL-1.0",
      "LPL-1.02",
      "LPPL-1.0",
      "LPPL-1.1",
      "LPPL-1.2",
      "LPPL-1.3a",
      "LPPL-1.3c",
      "LZMA-SDK-9.11-to-9.20",
      "LZMA-SDK-9.22",
      "Latex2e",
      "Leptonica",
      "LiLiQ-P-1.1",
      "LiLiQ-R-1.1",
      "LiLiQ-Rplus-1.1",
      "Libpng",
      "Linux-OpenIB",
      "Linux-man-pages-copyleft",
      "MIT",
      "MIT-0",
      "MIT-CMU",
      "MIT-Modern-Variant",
      "MIT-advertising",
      "MIT-enna",
      "MIT-feh",
      "MIT-open-group",
      "MITNFA",
      "MPL-1.0",
      "MPL-1.1",
      "MPL-2.0",
      "MPL-2.0-no-copyleft-exception",
      "MS-LPL",
      "MS-PL",
      "MS-RL",
      "MTLL",
      "MakeIndex",
      "Minpack",
      "MirOS",
      "Motosoto",
      "MulanPSL-1.0",
      "MulanPSL-2.0",
      "Multics",
      "Mup",
      "NAIST-2003",
      "NASA-1.3",
      "NBPL-1.0",
      "NCGL-UK-2.0",
      "NCSA",
      "NGPL",
      "NICTA-1.0",
      "NIST-PD",
      "NIST-PD-fallback",
      "NLOD-1.0",
      "NLOD-2.0",
      "NLPL",
      "NOSL",
      "NPL-1.0",
      "NPL-1.1",
      "NPOSL-3.0",
      "NRL",
      "NTP",
      "NTP-0",
      "Naumen",
      "Net-SNMP",
      "NetCDF",
      "Newsletr",
      "Nokia",
      "Noweb",
      "O-UDA-1.0",
      "OCCT-PL",
      "OCLC-2.0",
      "ODC-By-1.0",
      "ODbL-1.0",
      "OFL-1.0",
      "OFL-1.0-RFN",
      "OFL-1.0-no-RFN",
      "OFL-1.1",
      "OFL-1.1-RFN",
      "OFL-1.1-no-RFN",
      "OGC-1.0",
      "OGDL-Taiwan-1.0",
      "OGL-Canada-2.0",
      "OGL-UK-1.0",
      "OGL-UK-2.0",
      "OGL-UK-3.0",
      "OGTSL",
      "OLDAP-1.1",
      "OLDAP-1.2",
      "OLDAP-1.3",
      "OLDAP-1.4",
      "OLDAP-2.0",
      "OLDAP-2.0.1",
      "OLDAP-2.1",
      "OLDAP-2.2",
      "OLDAP-2.2.1",
      "OLDAP-2.2.2",
      "OLDAP-2.3",
      "OLDAP-2.4",
      "OLDAP-2.5",
      "OLDAP-2.6",
      "OLDAP-2.7",
      "OLDAP-2.8",
      "OML",
      "OPL-1.0",
      "OPUBL-1.0",
      "OSET-PL-2.1",
      "OSL-1.0",
      "OSL-1.1",
      "OSL-2.0",
      "OSL-2.1",
      "OSL-3.0",
      "OpenSSL",
      "PDDL-1.0",
      "PHP-3.0",
      "PHP-3.01",
      "PSF-2.0",
      "Parity-6.0.0",
      "Parity-7.0.0",
      "Plexus",
      "PolyForm-Noncommercial-1.0.0",
      "PolyForm-Small-Business-1.0.0",
      "PostgreSQL",
      "Python-2.0",
      "Python-2.0.1",
      "QPL-1.0",
      "Qhull",
      "RHeCos-1.1",
      "RPL-1.1",
      "RPL-1.5",
      "RPSL-1.0",
      "RSA-MD",
      "RSCPL",
      "Rdisc",
      "Ruby",
      "SAX-PD",
      "SCEA",
      "SGI-B-1.0",
      "SGI-B-1.1",
      "SGI-B-2.0",
      "SHL-0.5",
      "SHL-0.51",
      "SISSL",
      "SISSL-1.2",
      "SMLNJ",
      "SMPPL",
      "SNIA",
      "SPL-1.0",
      "SSH-OpenSSH",
      "SSH-short",
      "SSPL-1.0",
      "SWL",
      "Saxpath",
      "SchemeReport",
      "Sendmail",
      "Sendmail-8.23",
      "SimPL-2.0",
      "Sleepycat",
      "Spencer-86",
      "Spencer-94",
      "Spencer-99",
      "SugarCRM-1.1.3",
      "TAPR-OHL-1.0",
      "TCL",
      "TCP-wrappers",
      "TMate",
      "TORQUE-1.1",
      "TOSL",
      "TU-Berlin-1.0",
      "TU-Berlin-2.0",
      "UCL-1.0",
      "UPL-1.0",
      "Unicode-DFS-2015",
      "Unicode-DFS-2016",
      "Unicode-TOU",
      "Unlicense",
      "VOSTROM",
      "VSL-1.0",
      "Vim",
      "W3C",
      "W3C-19980720",
      "W3C-20150513",
      "WTFPL",
      "Watcom-1.0",
      "Wsuipa",
      "X11",
      "X11-distribute-modifications-variant",
      "XFree86-1.1",
      "XSkat",
      "Xerox",
      "Xnet",
      "YPL-1.0",
      "YPL-1.1",
      "ZPL-1.1",
      "ZPL-2.0",
      "ZPL-2.1",
      "Zed",
      "Zend-2.0",
      "Zimbra-1.3",
      "Zimbra-1.4",
      "Zlib",
      "blessing",
      "bzip2-1.0.6",
      "copyleft-next-0.3.0",
      "copyleft-next-0.3.1",
      "curl",
      "diffmark",
      "dvipdfm",
      "eGenix",
      "etalab-2.0",
      "gSOAP-1.3b",
      "gnuplot",
      "iMatix",
      "libpng-2.0",
      "libselinux-1.0",
      "libtiff",
      "mpi-permissive",
      "mpich2",
      "mplus",
      "psfrag",
      "psutils",
      "xinetd",
      "xpp",
      "zlib-acknowledgement"
    ];
  }
});

// node_modules/spdx-license-ids/deprecated.json
var require_deprecated = __commonJS({
  "node_modules/spdx-license-ids/deprecated.json"(exports, module2) {
    module2.exports = [
      "AGPL-1.0",
      "AGPL-3.0",
      "BSD-2-Clause-FreeBSD",
      "BSD-2-Clause-NetBSD",
      "GFDL-1.1",
      "GFDL-1.2",
      "GFDL-1.3",
      "GPL-1.0",
      "GPL-2.0",
      "GPL-2.0-with-GCC-exception",
      "GPL-2.0-with-autoconf-exception",
      "GPL-2.0-with-bison-exception",
      "GPL-2.0-with-classpath-exception",
      "GPL-2.0-with-font-exception",
      "GPL-3.0",
      "GPL-3.0-with-GCC-exception",
      "GPL-3.0-with-autoconf-exception",
      "LGPL-2.0",
      "LGPL-2.1",
      "LGPL-3.0",
      "Nunit",
      "StandardML-NJ",
      "bzip2-1.0.5",
      "eCos-2.0",
      "wxWindows"
    ];
  }
});

// node_modules/spdx-exceptions/index.json
var require_spdx_exceptions = __commonJS({
  "node_modules/spdx-exceptions/index.json"(exports, module2) {
    module2.exports = [
      "389-exception",
      "Autoconf-exception-2.0",
      "Autoconf-exception-3.0",
      "Bison-exception-2.2",
      "Bootloader-exception",
      "Classpath-exception-2.0",
      "CLISP-exception-2.0",
      "DigiRule-FOSS-exception",
      "eCos-exception-2.0",
      "Fawkes-Runtime-exception",
      "FLTK-exception",
      "Font-exception-2.0",
      "freertos-exception-2.0",
      "GCC-exception-2.0",
      "GCC-exception-3.1",
      "gnu-javamail-exception",
      "GPL-3.0-linking-exception",
      "GPL-3.0-linking-source-exception",
      "GPL-CC-1.0",
      "i2p-gpl-java-exception",
      "Libtool-exception",
      "Linux-syscall-note",
      "LLVM-exception",
      "LZMA-exception",
      "mif-exception",
      "Nokia-Qt-exception-1.1",
      "OCaml-LGPL-linking-exception",
      "OCCT-exception-1.0",
      "OpenJDK-assembly-exception-1.0",
      "openvpn-openssl-exception",
      "PS-or-PDF-font-exception-20170817",
      "Qt-GPL-exception-1.0",
      "Qt-LGPL-exception-1.1",
      "Qwt-exception-1.0",
      "Swift-exception",
      "u-boot-exception-2.0",
      "Universal-FOSS-exception-1.0",
      "WxWindows-exception-3.1"
    ];
  }
});

// node_modules/spdx-expression-parse/scan.js
var require_scan = __commonJS({
  "node_modules/spdx-expression-parse/scan.js"(exports, module2) {
    "use strict";
    var licenses = [].concat(require_spdx_license_ids()).concat(require_deprecated());
    var exceptions = require_spdx_exceptions();
    module2.exports = function(source) {
      var index = 0;
      function hasMore() {
        return index < source.length;
      }
      __name(hasMore, "hasMore");
      function read(value) {
        if (value instanceof RegExp) {
          var chars = source.slice(index);
          var match = chars.match(value);
          if (match) {
            index += match[0].length;
            return match[0];
          }
        } else {
          if (source.indexOf(value, index) === index) {
            index += value.length;
            return value;
          }
        }
      }
      __name(read, "read");
      function skipWhitespace() {
        read(/[ ]*/);
      }
      __name(skipWhitespace, "skipWhitespace");
      function operator() {
        var string;
        var possibilities = [
          "WITH",
          "AND",
          "OR",
          "(",
          ")",
          ":",
          "+"
        ];
        for (var i = 0; i < possibilities.length; i++) {
          string = read(possibilities[i]);
          if (string) {
            break;
          }
        }
        if (string === "+" && index > 1 && source[index - 2] === " ") {
          throw new Error("Space before `+`");
        }
        return string && {
          type: "OPERATOR",
          string
        };
      }
      __name(operator, "operator");
      function idstring() {
        return read(/[A-Za-z0-9-.]+/);
      }
      __name(idstring, "idstring");
      function expectIdstring() {
        var string = idstring();
        if (!string) {
          throw new Error("Expected idstring at offset " + index);
        }
        return string;
      }
      __name(expectIdstring, "expectIdstring");
      function documentRef() {
        if (read("DocumentRef-")) {
          var string = expectIdstring();
          return {
            type: "DOCUMENTREF",
            string
          };
        }
      }
      __name(documentRef, "documentRef");
      function licenseRef() {
        if (read("LicenseRef-")) {
          var string = expectIdstring();
          return {
            type: "LICENSEREF",
            string
          };
        }
      }
      __name(licenseRef, "licenseRef");
      function identifier() {
        var begin = index;
        var string = idstring();
        if (licenses.indexOf(string) !== -1) {
          return {
            type: "LICENSE",
            string
          };
        } else if (exceptions.indexOf(string) !== -1) {
          return {
            type: "EXCEPTION",
            string
          };
        }
        index = begin;
      }
      __name(identifier, "identifier");
      function parseToken() {
        return operator() || documentRef() || licenseRef() || identifier();
      }
      __name(parseToken, "parseToken");
      var tokens = [];
      while (hasMore()) {
        skipWhitespace();
        if (!hasMore()) {
          break;
        }
        var token = parseToken();
        if (!token) {
          throw new Error("Unexpected `" + source[index] + "` at offset " + index);
        }
        tokens.push(token);
      }
      return tokens;
    };
  }
});

// node_modules/spdx-expression-parse/parse.js
var require_parse = __commonJS({
  "node_modules/spdx-expression-parse/parse.js"(exports, module2) {
    "use strict";
    module2.exports = function(tokens) {
      var index = 0;
      function hasMore() {
        return index < tokens.length;
      }
      __name(hasMore, "hasMore");
      function token() {
        return hasMore() ? tokens[index] : null;
      }
      __name(token, "token");
      function next() {
        if (!hasMore()) {
          throw new Error();
        }
        index++;
      }
      __name(next, "next");
      function parseOperator(operator) {
        var t = token();
        if (t && t.type === "OPERATOR" && operator === t.string) {
          next();
          return t.string;
        }
      }
      __name(parseOperator, "parseOperator");
      function parseWith() {
        if (parseOperator("WITH")) {
          var t = token();
          if (t && t.type === "EXCEPTION") {
            next();
            return t.string;
          }
          throw new Error("Expected exception after `WITH`");
        }
      }
      __name(parseWith, "parseWith");
      function parseLicenseRef() {
        var begin = index;
        var string = "";
        var t = token();
        if (t.type === "DOCUMENTREF") {
          next();
          string += "DocumentRef-" + t.string + ":";
          if (!parseOperator(":")) {
            throw new Error("Expected `:` after `DocumentRef-...`");
          }
        }
        t = token();
        if (t.type === "LICENSEREF") {
          next();
          string += "LicenseRef-" + t.string;
          return {
            license: string
          };
        }
        index = begin;
      }
      __name(parseLicenseRef, "parseLicenseRef");
      function parseLicense() {
        var t = token();
        if (t && t.type === "LICENSE") {
          next();
          var node2 = {
            license: t.string
          };
          if (parseOperator("+")) {
            node2.plus = true;
          }
          var exception = parseWith();
          if (exception) {
            node2.exception = exception;
          }
          return node2;
        }
      }
      __name(parseLicense, "parseLicense");
      function parseParenthesizedExpression() {
        var left = parseOperator("(");
        if (!left) {
          return;
        }
        var expr = parseExpression();
        if (!parseOperator(")")) {
          throw new Error("Expected `)`");
        }
        return expr;
      }
      __name(parseParenthesizedExpression, "parseParenthesizedExpression");
      function parseAtom() {
        return parseParenthesizedExpression() || parseLicenseRef() || parseLicense();
      }
      __name(parseAtom, "parseAtom");
      function makeBinaryOpParser(operator, nextParser) {
        return /* @__PURE__ */ __name(function parseBinaryOp() {
          var left = nextParser();
          if (!left) {
            return;
          }
          if (!parseOperator(operator)) {
            return left;
          }
          var right = parseBinaryOp();
          if (!right) {
            throw new Error("Expected expression");
          }
          return {
            left,
            conjunction: operator.toLowerCase(),
            right
          };
        }, "parseBinaryOp");
      }
      __name(makeBinaryOpParser, "makeBinaryOpParser");
      var parseAnd = makeBinaryOpParser("AND", parseAtom);
      var parseExpression = makeBinaryOpParser("OR", parseAnd);
      var node = parseExpression();
      if (!node || hasMore()) {
        throw new Error("Syntax error");
      }
      return node;
    };
  }
});

// node_modules/spdx-expression-parse/index.js
var require_spdx_expression_parse = __commonJS({
  "node_modules/spdx-expression-parse/index.js"(exports, module2) {
    "use strict";
    var scan = require_scan();
    var parse = require_parse();
    module2.exports = function(source) {
      return parse(scan(source));
    };
  }
});

// node_modules/spdx-correct/index.js
var require_spdx_correct = __commonJS({
  "node_modules/spdx-correct/index.js"(exports, module2) {
    var parse = require_spdx_expression_parse();
    var spdxLicenseIds = require_spdx_license_ids();
    function valid(string) {
      try {
        parse(string);
        return true;
      } catch (error) {
        return false;
      }
    }
    __name(valid, "valid");
    var transpositions = [
      [
        "APGL",
        "AGPL"
      ],
      [
        "Gpl",
        "GPL"
      ],
      [
        "GLP",
        "GPL"
      ],
      [
        "APL",
        "Apache"
      ],
      [
        "ISD",
        "ISC"
      ],
      [
        "GLP",
        "GPL"
      ],
      [
        "IST",
        "ISC"
      ],
      [
        "Claude",
        "Clause"
      ],
      [
        " or later",
        "+"
      ],
      [
        " International",
        ""
      ],
      [
        "GNU",
        "GPL"
      ],
      [
        "GUN",
        "GPL"
      ],
      [
        "+",
        ""
      ],
      [
        "GNU GPL",
        "GPL"
      ],
      [
        "GNU/GPL",
        "GPL"
      ],
      [
        "GNU GLP",
        "GPL"
      ],
      [
        "GNU General Public License",
        "GPL"
      ],
      [
        "Gnu public license",
        "GPL"
      ],
      [
        "GNU Public License",
        "GPL"
      ],
      [
        "GNU GENERAL PUBLIC LICENSE",
        "GPL"
      ],
      [
        "MTI",
        "MIT"
      ],
      [
        "Mozilla Public License",
        "MPL"
      ],
      [
        "Universal Permissive License",
        "UPL"
      ],
      [
        "WTH",
        "WTF"
      ],
      [
        "-License",
        ""
      ]
    ];
    var TRANSPOSED = 0;
    var CORRECT = 1;
    var transforms = [
      function(argument) {
        return argument.toUpperCase();
      },
      function(argument) {
        return argument.trim();
      },
      function(argument) {
        return argument.replace(/\./g, "");
      },
      function(argument) {
        return argument.replace(/\s+/g, "");
      },
      function(argument) {
        return argument.replace(/\s+/g, "-");
      },
      function(argument) {
        return argument.replace("v", "-");
      },
      function(argument) {
        return argument.replace(/,?\s*(\d)/, "-$1");
      },
      function(argument) {
        return argument.replace(/,?\s*(\d)/, "-$1.0");
      },
      function(argument) {
        return argument.replace(/,?\s*(V\.|v\.|V|v|Version|version)\s*(\d)/, "-$2");
      },
      function(argument) {
        return argument.replace(/,?\s*(V\.|v\.|V|v|Version|version)\s*(\d)/, "-$2.0");
      },
      function(argument) {
        return argument[0].toUpperCase() + argument.slice(1);
      },
      function(argument) {
        return argument.replace("/", "-");
      },
      function(argument) {
        return argument.replace(/\s*V\s*(\d)/, "-$1").replace(/(\d)$/, "$1.0");
      },
      function(argument) {
        if (argument.indexOf("3.0") !== -1) {
          return argument + "-or-later";
        } else {
          return argument + "-only";
        }
      },
      function(argument) {
        return argument + "only";
      },
      function(argument) {
        return argument.replace(/(\d)$/, "-$1.0");
      },
      function(argument) {
        return argument.replace(/(-| )?(\d)$/, "-$2-Clause");
      },
      function(argument) {
        return argument.replace(/(-| )clause(-| )(\d)/, "-$3-Clause");
      },
      function(argument) {
        return argument.replace(/\b(Modified|New|Revised)(-| )?BSD((-| )License)?/i, "BSD-3-Clause");
      },
      function(argument) {
        return argument.replace(/\bSimplified(-| )?BSD((-| )License)?/i, "BSD-2-Clause");
      },
      function(argument) {
        return argument.replace(/\b(Free|Net)(-| )?BSD((-| )License)?/i, "BSD-2-Clause-$1BSD");
      },
      function(argument) {
        return argument.replace(/\bClear(-| )?BSD((-| )License)?/i, "BSD-3-Clause-Clear");
      },
      function(argument) {
        return argument.replace(/\b(Old|Original)(-| )?BSD((-| )License)?/i, "BSD-4-Clause");
      },
      function(argument) {
        return "CC-" + argument;
      },
      function(argument) {
        return "CC-" + argument + "-4.0";
      },
      function(argument) {
        return argument.replace("Attribution", "BY").replace("NonCommercial", "NC").replace("NoDerivatives", "ND").replace(/ (\d)/, "-$1").replace(/ ?International/, "");
      },
      function(argument) {
        return "CC-" + argument.replace("Attribution", "BY").replace("NonCommercial", "NC").replace("NoDerivatives", "ND").replace(/ (\d)/, "-$1").replace(/ ?International/, "") + "-4.0";
      }
    ];
    var licensesWithVersions = spdxLicenseIds.map(function(id) {
      var match = /^(.*)-\d+\.\d+$/.exec(id);
      return match ? [
        match[0],
        match[1]
      ] : [
        id,
        null
      ];
    }).reduce(function(objectMap, item) {
      var key = item[1];
      objectMap[key] = objectMap[key] || [];
      objectMap[key].push(item[0]);
      return objectMap;
    }, {});
    var licensesWithOneVersion = Object.keys(licensesWithVersions).map(/* @__PURE__ */ __name(function makeEntries(key) {
      return [
        key,
        licensesWithVersions[key]
      ];
    }, "makeEntries")).filter(/* @__PURE__ */ __name(function identifySoleVersions(item) {
      return item[1].length === 1 && item[0] !== null && item[0] !== "APL";
    }, "identifySoleVersions")).map(/* @__PURE__ */ __name(function createLastResorts(item) {
      return [
        item[0],
        item[1][0]
      ];
    }, "createLastResorts"));
    licensesWithVersions = void 0;
    var lastResorts = [
      [
        "UNLI",
        "Unlicense"
      ],
      [
        "WTF",
        "WTFPL"
      ],
      [
        "2 CLAUSE",
        "BSD-2-Clause"
      ],
      [
        "2-CLAUSE",
        "BSD-2-Clause"
      ],
      [
        "3 CLAUSE",
        "BSD-3-Clause"
      ],
      [
        "3-CLAUSE",
        "BSD-3-Clause"
      ],
      [
        "AFFERO",
        "AGPL-3.0-or-later"
      ],
      [
        "AGPL",
        "AGPL-3.0-or-later"
      ],
      [
        "APACHE",
        "Apache-2.0"
      ],
      [
        "ARTISTIC",
        "Artistic-2.0"
      ],
      [
        "Affero",
        "AGPL-3.0-or-later"
      ],
      [
        "BEER",
        "Beerware"
      ],
      [
        "BOOST",
        "BSL-1.0"
      ],
      [
        "BSD",
        "BSD-2-Clause"
      ],
      [
        "CDDL",
        "CDDL-1.1"
      ],
      [
        "ECLIPSE",
        "EPL-1.0"
      ],
      [
        "FUCK",
        "WTFPL"
      ],
      [
        "GNU",
        "GPL-3.0-or-later"
      ],
      [
        "LGPL",
        "LGPL-3.0-or-later"
      ],
      [
        "GPLV1",
        "GPL-1.0-only"
      ],
      [
        "GPL-1",
        "GPL-1.0-only"
      ],
      [
        "GPLV2",
        "GPL-2.0-only"
      ],
      [
        "GPL-2",
        "GPL-2.0-only"
      ],
      [
        "GPL",
        "GPL-3.0-or-later"
      ],
      [
        "MIT +NO-FALSE-ATTRIBS",
        "MITNFA"
      ],
      [
        "MIT",
        "MIT"
      ],
      [
        "MPL",
        "MPL-2.0"
      ],
      [
        "X11",
        "X11"
      ],
      [
        "ZLIB",
        "Zlib"
      ]
    ].concat(licensesWithOneVersion);
    var SUBSTRING = 0;
    var IDENTIFIER = 1;
    var validTransformation = /* @__PURE__ */ __name(function(identifier) {
      for (var i = 0; i < transforms.length; i++) {
        var transformed = transforms[i](identifier).trim();
        if (transformed !== identifier && valid(transformed)) {
          return transformed;
        }
      }
      return null;
    }, "validTransformation");
    var validLastResort = /* @__PURE__ */ __name(function(identifier) {
      var upperCased = identifier.toUpperCase();
      for (var i = 0; i < lastResorts.length; i++) {
        var lastResort = lastResorts[i];
        if (upperCased.indexOf(lastResort[SUBSTRING]) > -1) {
          return lastResort[IDENTIFIER];
        }
      }
      return null;
    }, "validLastResort");
    var anyCorrection = /* @__PURE__ */ __name(function(identifier, check) {
      for (var i = 0; i < transpositions.length; i++) {
        var transposition = transpositions[i];
        var transposed = transposition[TRANSPOSED];
        if (identifier.indexOf(transposed) > -1) {
          var corrected = identifier.replace(transposed, transposition[CORRECT]);
          var checked = check(corrected);
          if (checked !== null) {
            return checked;
          }
        }
      }
      return null;
    }, "anyCorrection");
    module2.exports = function(identifier, options) {
      options = options || {};
      var upgrade = options.upgrade === void 0 ? true : !!options.upgrade;
      function postprocess(value) {
        return upgrade ? upgradeGPLs(value) : value;
      }
      __name(postprocess, "postprocess");
      var validArugment = typeof identifier === "string" && identifier.trim().length !== 0;
      if (!validArugment) {
        throw Error("Invalid argument. Expected non-empty string.");
      }
      identifier = identifier.trim();
      if (valid(identifier)) {
        return postprocess(identifier);
      }
      var noPlus = identifier.replace(/\+$/, "").trim();
      if (valid(noPlus)) {
        return postprocess(noPlus);
      }
      var transformed = validTransformation(identifier);
      if (transformed !== null) {
        return postprocess(transformed);
      }
      transformed = anyCorrection(identifier, function(argument) {
        if (valid(argument)) {
          return argument;
        }
        return validTransformation(argument);
      });
      if (transformed !== null) {
        return postprocess(transformed);
      }
      transformed = validLastResort(identifier);
      if (transformed !== null) {
        return postprocess(transformed);
      }
      transformed = anyCorrection(identifier, validLastResort);
      if (transformed !== null) {
        return postprocess(transformed);
      }
      return null;
    };
    function upgradeGPLs(value) {
      if ([
        "GPL-1.0",
        "LGPL-1.0",
        "AGPL-1.0",
        "GPL-2.0",
        "LGPL-2.0",
        "AGPL-2.0",
        "LGPL-2.1"
      ].indexOf(value) !== -1) {
        return value + "-only";
      } else if ([
        "GPL-1.0+",
        "GPL-2.0+",
        "GPL-3.0+",
        "LGPL-2.0+",
        "LGPL-2.1+",
        "LGPL-3.0+",
        "AGPL-1.0+",
        "AGPL-3.0+"
      ].indexOf(value) !== -1) {
        return value.replace(/\+$/, "-or-later");
      } else if ([
        "GPL-3.0",
        "LGPL-3.0",
        "AGPL-3.0"
      ].indexOf(value) !== -1) {
        return value + "-or-later";
      } else {
        return value;
      }
    }
    __name(upgradeGPLs, "upgradeGPLs");
  }
});

// node_modules/validate-npm-package-license/index.js
var require_validate_npm_package_license = __commonJS({
  "node_modules/validate-npm-package-license/index.js"(exports, module2) {
    var parse = require_spdx_expression_parse();
    var correct = require_spdx_correct();
    var genericWarning = 'license should be a valid SPDX license expression (without "LicenseRef"), "UNLICENSED", or "SEE LICENSE IN <filename>"';
    var fileReferenceRE = /^SEE LICEN[CS]E IN (.+)$/;
    function startsWith(prefix, string) {
      return string.slice(0, prefix.length) === prefix;
    }
    __name(startsWith, "startsWith");
    function usesLicenseRef(ast) {
      if (ast.hasOwnProperty("license")) {
        var license = ast.license;
        return startsWith("LicenseRef", license) || startsWith("DocumentRef", license);
      } else {
        return usesLicenseRef(ast.left) || usesLicenseRef(ast.right);
      }
    }
    __name(usesLicenseRef, "usesLicenseRef");
    module2.exports = function(argument) {
      var ast;
      try {
        ast = parse(argument);
      } catch (e) {
        var match;
        if (argument === "UNLICENSED" || argument === "UNLICENCED") {
          return {
            validForOldPackages: true,
            validForNewPackages: true,
            unlicensed: true
          };
        } else if (match = fileReferenceRE.exec(argument)) {
          return {
            validForOldPackages: true,
            validForNewPackages: true,
            inFile: match[1]
          };
        } else {
          var result = {
            validForOldPackages: false,
            validForNewPackages: false,
            warnings: [
              genericWarning
            ]
          };
          if (argument.trim().length !== 0) {
            var corrected = correct(argument);
            if (corrected) {
              result.warnings.push('license is similar to the valid expression "' + corrected + '"');
            }
          }
          return result;
        }
      }
      if (usesLicenseRef(ast)) {
        return {
          validForNewPackages: false,
          validForOldPackages: false,
          spdx: true,
          warnings: [
            genericWarning
          ]
        };
      } else {
        return {
          validForNewPackages: true,
          validForOldPackages: true,
          spdx: true
        };
      }
    };
  }
});

// node_modules/hosted-git-info/git-host-info.js
var require_git_host_info = __commonJS({
  "node_modules/hosted-git-info/git-host-info.js"(exports, module2) {
    "use strict";
    var gitHosts = module2.exports = {
      github: {
        "protocols": [
          "git",
          "http",
          "git+ssh",
          "git+https",
          "ssh",
          "https"
        ],
        "domain": "github.com",
        "treepath": "tree",
        "filetemplate": "https://{auth@}raw.githubusercontent.com/{user}/{project}/{committish}/{path}",
        "bugstemplate": "https://{domain}/{user}/{project}/issues",
        "gittemplate": "git://{auth@}{domain}/{user}/{project}.git{#committish}",
        "tarballtemplate": "https://codeload.{domain}/{user}/{project}/tar.gz/{committish}"
      },
      bitbucket: {
        "protocols": [
          "git+ssh",
          "git+https",
          "ssh",
          "https"
        ],
        "domain": "bitbucket.org",
        "treepath": "src",
        "tarballtemplate": "https://{domain}/{user}/{project}/get/{committish}.tar.gz"
      },
      gitlab: {
        "protocols": [
          "git+ssh",
          "git+https",
          "ssh",
          "https"
        ],
        "domain": "gitlab.com",
        "treepath": "tree",
        "bugstemplate": "https://{domain}/{user}/{project}/issues",
        "httpstemplate": "git+https://{auth@}{domain}/{user}/{projectPath}.git{#committish}",
        "tarballtemplate": "https://{domain}/{user}/{project}/repository/archive.tar.gz?ref={committish}",
        "pathmatch": /^[/]([^/]+)[/]((?!.*(\/-\/|\/repository\/archive\.tar\.gz\?=.*|\/repository\/[^/]+\/archive.tar.gz$)).*?)(?:[.]git|[/])?$/
      },
      gist: {
        "protocols": [
          "git",
          "git+ssh",
          "git+https",
          "ssh",
          "https"
        ],
        "domain": "gist.github.com",
        "pathmatch": /^[/](?:([^/]+)[/])?([a-z0-9]{32,})(?:[.]git)?$/,
        "filetemplate": "https://gist.githubusercontent.com/{user}/{project}/raw{/committish}/{path}",
        "bugstemplate": "https://{domain}/{project}",
        "gittemplate": "git://{domain}/{project}.git{#committish}",
        "sshtemplate": "git@{domain}:/{project}.git{#committish}",
        "sshurltemplate": "git+ssh://git@{domain}/{project}.git{#committish}",
        "browsetemplate": "https://{domain}/{project}{/committish}",
        "browsefiletemplate": "https://{domain}/{project}{/committish}{#path}",
        "docstemplate": "https://{domain}/{project}{/committish}",
        "httpstemplate": "git+https://{domain}/{project}.git{#committish}",
        "shortcuttemplate": "{type}:{project}{#committish}",
        "pathtemplate": "{project}{#committish}",
        "tarballtemplate": "https://codeload.github.com/gist/{project}/tar.gz/{committish}",
        "hashformat": function(fragment) {
          return "file-" + formatHashFragment(fragment);
        }
      }
    };
    var gitHostDefaults = {
      "sshtemplate": "git@{domain}:{user}/{project}.git{#committish}",
      "sshurltemplate": "git+ssh://git@{domain}/{user}/{project}.git{#committish}",
      "browsetemplate": "https://{domain}/{user}/{project}{/tree/committish}",
      "browsefiletemplate": "https://{domain}/{user}/{project}/{treepath}/{committish}/{path}{#fragment}",
      "docstemplate": "https://{domain}/{user}/{project}{/tree/committish}#readme",
      "httpstemplate": "git+https://{auth@}{domain}/{user}/{project}.git{#committish}",
      "filetemplate": "https://{domain}/{user}/{project}/raw/{committish}/{path}",
      "shortcuttemplate": "{type}:{user}/{project}{#committish}",
      "pathtemplate": "{user}/{project}{#committish}",
      "pathmatch": /^[/]([^/]+)[/]([^/]+?)(?:[.]git|[/])?$/,
      "hashformat": formatHashFragment
    };
    Object.keys(gitHosts).forEach(function(name) {
      Object.keys(gitHostDefaults).forEach(function(key) {
        if (gitHosts[name][key])
          return;
        gitHosts[name][key] = gitHostDefaults[key];
      });
      gitHosts[name].protocols_re = RegExp("^(" + gitHosts[name].protocols.map(function(protocol) {
        return protocol.replace(/([\\+*{}()[\]$^|])/g, "\\$1");
      }).join("|") + "):$");
    });
    function formatHashFragment(fragment) {
      return fragment.toLowerCase().replace(/^\W+|\/|\W+$/g, "").replace(/\W+/g, "-");
    }
    __name(formatHashFragment, "formatHashFragment");
  }
});

// node_modules/hosted-git-info/git-host.js
var require_git_host = __commonJS({
  "node_modules/hosted-git-info/git-host.js"(exports, module2) {
    "use strict";
    var gitHosts = require_git_host_info();
    var extend = Object.assign || /* @__PURE__ */ __name(function _extend(target, source) {
      if (source === null || typeof source !== "object")
        return target;
      var keys = Object.keys(source);
      var i = keys.length;
      while (i--) {
        target[keys[i]] = source[keys[i]];
      }
      return target;
    }, "_extend");
    module2.exports = GitHost;
    function GitHost(type, user, auth, project, committish, defaultRepresentation, opts) {
      var gitHostInfo = this;
      gitHostInfo.type = type;
      Object.keys(gitHosts[type]).forEach(function(key) {
        gitHostInfo[key] = gitHosts[type][key];
      });
      gitHostInfo.user = user;
      gitHostInfo.auth = auth;
      gitHostInfo.project = project;
      gitHostInfo.committish = committish;
      gitHostInfo.default = defaultRepresentation;
      gitHostInfo.opts = opts || {};
    }
    __name(GitHost, "GitHost");
    GitHost.prototype.hash = function() {
      return this.committish ? "#" + this.committish : "";
    };
    GitHost.prototype._fill = function(template, opts) {
      if (!template)
        return;
      var vars = extend({}, opts);
      vars.path = vars.path ? vars.path.replace(/^[/]+/g, "") : "";
      opts = extend(extend({}, this.opts), opts);
      var self = this;
      Object.keys(this).forEach(function(key) {
        if (self[key] != null && vars[key] == null)
          vars[key] = self[key];
      });
      var rawAuth = vars.auth;
      var rawcommittish = vars.committish;
      var rawFragment = vars.fragment;
      var rawPath = vars.path;
      var rawProject = vars.project;
      Object.keys(vars).forEach(function(key) {
        var value = vars[key];
        if ((key === "path" || key === "project") && typeof value === "string") {
          vars[key] = value.split("/").map(function(pathComponent) {
            return encodeURIComponent(pathComponent);
          }).join("/");
        } else {
          vars[key] = encodeURIComponent(value);
        }
      });
      vars["auth@"] = rawAuth ? rawAuth + "@" : "";
      vars["#fragment"] = rawFragment ? "#" + this.hashformat(rawFragment) : "";
      vars.fragment = vars.fragment ? vars.fragment : "";
      vars["#path"] = rawPath ? "#" + this.hashformat(rawPath) : "";
      vars["/path"] = vars.path ? "/" + vars.path : "";
      vars.projectPath = rawProject.split("/").map(encodeURIComponent).join("/");
      if (opts.noCommittish) {
        vars["#committish"] = "";
        vars["/tree/committish"] = "";
        vars["/committish"] = "";
        vars.committish = "";
      } else {
        vars["#committish"] = rawcommittish ? "#" + rawcommittish : "";
        vars["/tree/committish"] = vars.committish ? "/" + vars.treepath + "/" + vars.committish : "";
        vars["/committish"] = vars.committish ? "/" + vars.committish : "";
        vars.committish = vars.committish || "master";
      }
      var res = template;
      Object.keys(vars).forEach(function(key) {
        res = res.replace(new RegExp("[{]" + key + "[}]", "g"), vars[key]);
      });
      if (opts.noGitPlus) {
        return res.replace(/^git[+]/, "");
      } else {
        return res;
      }
    };
    GitHost.prototype.ssh = function(opts) {
      return this._fill(this.sshtemplate, opts);
    };
    GitHost.prototype.sshurl = function(opts) {
      return this._fill(this.sshurltemplate, opts);
    };
    GitHost.prototype.browse = function(P, F, opts) {
      if (typeof P === "string") {
        if (typeof F !== "string") {
          opts = F;
          F = null;
        }
        return this._fill(this.browsefiletemplate, extend({
          fragment: F,
          path: P
        }, opts));
      } else {
        return this._fill(this.browsetemplate, P);
      }
    };
    GitHost.prototype.docs = function(opts) {
      return this._fill(this.docstemplate, opts);
    };
    GitHost.prototype.bugs = function(opts) {
      return this._fill(this.bugstemplate, opts);
    };
    GitHost.prototype.https = function(opts) {
      return this._fill(this.httpstemplate, opts);
    };
    GitHost.prototype.git = function(opts) {
      return this._fill(this.gittemplate, opts);
    };
    GitHost.prototype.shortcut = function(opts) {
      return this._fill(this.shortcuttemplate, opts);
    };
    GitHost.prototype.path = function(opts) {
      return this._fill(this.pathtemplate, opts);
    };
    GitHost.prototype.tarball = function(opts_) {
      var opts = extend({}, opts_, {
        noCommittish: false
      });
      return this._fill(this.tarballtemplate, opts);
    };
    GitHost.prototype.file = function(P, opts) {
      return this._fill(this.filetemplate, extend({
        path: P
      }, opts));
    };
    GitHost.prototype.getDefaultRepresentation = function() {
      return this.default;
    };
    GitHost.prototype.toString = function(opts) {
      if (this.default && typeof this[this.default] === "function")
        return this[this.default](opts);
      return this.sshurl(opts);
    };
  }
});

// node_modules/hosted-git-info/index.js
var require_hosted_git_info = __commonJS({
  "node_modules/hosted-git-info/index.js"(exports, module2) {
    "use strict";
    var url = require("url");
    var gitHosts = require_git_host_info();
    var GitHost = module2.exports = require_git_host();
    var protocolToRepresentationMap = {
      "git+ssh:": "sshurl",
      "git+https:": "https",
      "ssh:": "sshurl",
      "git:": "git"
    };
    function protocolToRepresentation(protocol) {
      return protocolToRepresentationMap[protocol] || protocol.slice(0, -1);
    }
    __name(protocolToRepresentation, "protocolToRepresentation");
    var authProtocols = {
      "git:": true,
      "https:": true,
      "git+https:": true,
      "http:": true,
      "git+http:": true
    };
    var cache = {};
    module2.exports.fromUrl = function(giturl, opts) {
      if (typeof giturl !== "string")
        return;
      var key = giturl + JSON.stringify(opts || {});
      if (!(key in cache)) {
        cache[key] = fromUrl(giturl, opts);
      }
      return cache[key];
    };
    function fromUrl(giturl, opts) {
      if (giturl == null || giturl === "")
        return;
      var url2 = fixupUnqualifiedGist(isGitHubShorthand(giturl) ? "github:" + giturl : giturl);
      var parsed = parseGitUrl(url2);
      var shortcutMatch = url2.match(/^([^:]+):(?:[^@]+@)?(?:([^/]*)\/)?([^#]+)/);
      var matches = Object.keys(gitHosts).map(function(gitHostName) {
        try {
          var gitHostInfo = gitHosts[gitHostName];
          var auth = null;
          if (parsed.auth && authProtocols[parsed.protocol]) {
            auth = parsed.auth;
          }
          var committish = parsed.hash ? decodeURIComponent(parsed.hash.substr(1)) : null;
          var user = null;
          var project = null;
          var defaultRepresentation = null;
          if (shortcutMatch && shortcutMatch[1] === gitHostName) {
            user = shortcutMatch[2] && decodeURIComponent(shortcutMatch[2]);
            project = decodeURIComponent(shortcutMatch[3].replace(/\.git$/, ""));
            defaultRepresentation = "shortcut";
          } else {
            if (parsed.host && parsed.host !== gitHostInfo.domain && parsed.host.replace(/^www[.]/, "") !== gitHostInfo.domain)
              return;
            if (!gitHostInfo.protocols_re.test(parsed.protocol))
              return;
            if (!parsed.path)
              return;
            var pathmatch = gitHostInfo.pathmatch;
            var matched = parsed.path.match(pathmatch);
            if (!matched)
              return;
            if (matched[1] !== null && matched[1] !== void 0) {
              user = decodeURIComponent(matched[1].replace(/^:/, ""));
            }
            project = decodeURIComponent(matched[2]);
            defaultRepresentation = protocolToRepresentation(parsed.protocol);
          }
          return new GitHost(gitHostName, user, auth, project, committish, defaultRepresentation, opts);
        } catch (ex) {
          if (ex instanceof URIError) {
          } else
            throw ex;
        }
      }).filter(function(gitHostInfo) {
        return gitHostInfo;
      });
      if (matches.length !== 1)
        return;
      return matches[0];
    }
    __name(fromUrl, "fromUrl");
    function isGitHubShorthand(arg) {
      return /^[^:@%/\s.-][^:@%/\s]*[/][^:@\s/%]+(?:#.*)?$/.test(arg);
    }
    __name(isGitHubShorthand, "isGitHubShorthand");
    function fixupUnqualifiedGist(giturl) {
      var parsed = url.parse(giturl);
      if (parsed.protocol === "gist:" && parsed.host && !parsed.path) {
        return parsed.protocol + "/" + parsed.host;
      } else {
        return giturl;
      }
    }
    __name(fixupUnqualifiedGist, "fixupUnqualifiedGist");
    function parseGitUrl(giturl) {
      var matched = giturl.match(/^([^@]+)@([^:/]+):[/]?((?:[^/]+[/])?[^/]+?)(?:[.]git)?(#.*)?$/);
      if (!matched) {
        var legacy = url.parse(giturl);
        if (legacy.auth && typeof url.URL === "function") {
          var authmatch = giturl.match(/[^@]+@[^:/]+/);
          if (authmatch) {
            var whatwg = new url.URL(authmatch[0]);
            legacy.auth = whatwg.username || "";
            if (whatwg.password)
              legacy.auth += ":" + whatwg.password;
          }
        }
        return legacy;
      }
      return {
        protocol: "git+ssh:",
        slashes: true,
        auth: matched[1],
        host: matched[2],
        port: null,
        hostname: matched[2],
        hash: matched[4],
        search: null,
        query: null,
        pathname: "/" + matched[3],
        path: "/" + matched[3],
        href: "git+ssh://" + matched[1] + "@" + matched[2] + "/" + matched[3] + (matched[4] || "")
      };
    }
    __name(parseGitUrl, "parseGitUrl");
  }
});

// node_modules/resolve/lib/homedir.js
var require_homedir = __commonJS({
  "node_modules/resolve/lib/homedir.js"(exports, module2) {
    "use strict";
    var os = require("os");
    module2.exports = os.homedir || /* @__PURE__ */ __name(function homedir() {
      var home = process.env.HOME;
      var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
      if (process.platform === "win32") {
        return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
      }
      if (process.platform === "darwin") {
        return home || (user ? "/Users/" + user : null);
      }
      if (process.platform === "linux") {
        return home || (process.getuid() === 0 ? "/root" : user ? "/home/" + user : null);
      }
      return home || null;
    }, "homedir");
  }
});

// node_modules/resolve/lib/caller.js
var require_caller = __commonJS({
  "node_modules/resolve/lib/caller.js"(exports, module2) {
    module2.exports = function() {
      var origPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack2) {
        return stack2;
      };
      var stack = new Error().stack;
      Error.prepareStackTrace = origPrepareStackTrace;
      return stack[2].getFileName();
    };
  }
});

// node_modules/path-parse/index.js
var require_path_parse = __commonJS({
  "node_modules/path-parse/index.js"(exports, module2) {
    "use strict";
    var isWindows = process.platform === "win32";
    var splitWindowsRe = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;
    var win32 = {};
    function win32SplitPath(filename) {
      return splitWindowsRe.exec(filename).slice(1);
    }
    __name(win32SplitPath, "win32SplitPath");
    win32.parse = function(pathString) {
      if (typeof pathString !== "string") {
        throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
      }
      var allParts = win32SplitPath(pathString);
      if (!allParts || allParts.length !== 5) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[1],
        dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
        base: allParts[2],
        ext: allParts[4],
        name: allParts[3]
      };
    };
    var splitPathRe = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
    var posix = {};
    function posixSplitPath(filename) {
      return splitPathRe.exec(filename).slice(1);
    }
    __name(posixSplitPath, "posixSplitPath");
    posix.parse = function(pathString) {
      if (typeof pathString !== "string") {
        throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
      }
      var allParts = posixSplitPath(pathString);
      if (!allParts || allParts.length !== 5) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[1],
        dir: allParts[0].slice(0, -1),
        base: allParts[2],
        ext: allParts[4],
        name: allParts[3]
      };
    };
    if (isWindows)
      module2.exports = win32.parse;
    else
      module2.exports = posix.parse;
    module2.exports.posix = posix.parse;
    module2.exports.win32 = win32.parse;
  }
});

// node_modules/resolve/lib/node-modules-paths.js
var require_node_modules_paths = __commonJS({
  "node_modules/resolve/lib/node-modules-paths.js"(exports, module2) {
    var path = require("path");
    var parse = path.parse || require_path_parse();
    var getNodeModulesDirs = /* @__PURE__ */ __name(function getNodeModulesDirs2(absoluteStart, modules) {
      var prefix = "/";
      if (/^([A-Za-z]:)/.test(absoluteStart)) {
        prefix = "";
      } else if (/^\\\\/.test(absoluteStart)) {
        prefix = "\\\\";
      }
      var paths = [
        absoluteStart
      ];
      var parsed = parse(absoluteStart);
      while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse(parsed.dir);
      }
      return paths.reduce(function(dirs, aPath) {
        return dirs.concat(modules.map(function(moduleDir) {
          return path.resolve(prefix, aPath, moduleDir);
        }));
      }, []);
    }, "getNodeModulesDirs");
    module2.exports = /* @__PURE__ */ __name(function nodeModulesPaths(start, opts, request) {
      var modules = opts && opts.moduleDirectory ? [].concat(opts.moduleDirectory) : [
        "node_modules"
      ];
      if (opts && typeof opts.paths === "function") {
        return opts.paths(request, start, function() {
          return getNodeModulesDirs(start, modules);
        }, opts);
      }
      var dirs = getNodeModulesDirs(start, modules);
      return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
    }, "nodeModulesPaths");
  }
});

// node_modules/resolve/lib/normalize-options.js
var require_normalize_options = __commonJS({
  "node_modules/resolve/lib/normalize-options.js"(exports, module2) {
    module2.exports = function(x, opts) {
      return opts || {};
    };
  }
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "node_modules/function-bind/implementation.js"(exports, module2) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var slice = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = "[object Function]";
    module2.exports = /* @__PURE__ */ __name(function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slice.call(arguments, 1);
      var bound;
      var binder = /* @__PURE__ */ __name(function() {
        if (this instanceof bound) {
          var result = target.apply(this, args.concat(slice.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return this;
        } else {
          return target.apply(that, args.concat(slice.call(arguments)));
        }
      }, "binder");
      var boundLength = Math.max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs.push("$" + i);
      }
      bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = /* @__PURE__ */ __name(function Empty2() {
        }, "Empty");
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    }, "bind");
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports, module2) {
    "use strict";
    var implementation = require_implementation();
    module2.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/has/src/index.js
var require_src = __commonJS({
  "node_modules/has/src/index.js"(exports, module2) {
    "use strict";
    var bind = require_function_bind();
    module2.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
  }
});

// node_modules/is-core-module/core.json
var require_core = __commonJS({
  "node_modules/is-core-module/core.json"(exports, module2) {
    module2.exports = {
      assert: true,
      "node:assert": [">= 14.18 && < 15", ">= 16"],
      "assert/strict": ">= 15",
      "node:assert/strict": ">= 16",
      async_hooks: ">= 8",
      "node:async_hooks": [">= 14.18 && < 15", ">= 16"],
      buffer_ieee754: ">= 0.5 && < 0.9.7",
      buffer: true,
      "node:buffer": [">= 14.18 && < 15", ">= 16"],
      child_process: true,
      "node:child_process": [">= 14.18 && < 15", ">= 16"],
      cluster: ">= 0.5",
      "node:cluster": [">= 14.18 && < 15", ">= 16"],
      console: true,
      "node:console": [">= 14.18 && < 15", ">= 16"],
      constants: true,
      "node:constants": [">= 14.18 && < 15", ">= 16"],
      crypto: true,
      "node:crypto": [">= 14.18 && < 15", ">= 16"],
      _debug_agent: ">= 1 && < 8",
      _debugger: "< 8",
      dgram: true,
      "node:dgram": [">= 14.18 && < 15", ">= 16"],
      diagnostics_channel: [">= 14.17 && < 15", ">= 15.1"],
      "node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
      dns: true,
      "node:dns": [">= 14.18 && < 15", ">= 16"],
      "dns/promises": ">= 15",
      "node:dns/promises": ">= 16",
      domain: ">= 0.7.12",
      "node:domain": [">= 14.18 && < 15", ">= 16"],
      events: true,
      "node:events": [">= 14.18 && < 15", ">= 16"],
      freelist: "< 6",
      fs: true,
      "node:fs": [">= 14.18 && < 15", ">= 16"],
      "fs/promises": [">= 10 && < 10.1", ">= 14"],
      "node:fs/promises": [">= 14.18 && < 15", ">= 16"],
      _http_agent: ">= 0.11.1",
      "node:_http_agent": [">= 14.18 && < 15", ">= 16"],
      _http_client: ">= 0.11.1",
      "node:_http_client": [">= 14.18 && < 15", ">= 16"],
      _http_common: ">= 0.11.1",
      "node:_http_common": [">= 14.18 && < 15", ">= 16"],
      _http_incoming: ">= 0.11.1",
      "node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
      _http_outgoing: ">= 0.11.1",
      "node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
      _http_server: ">= 0.11.1",
      "node:_http_server": [">= 14.18 && < 15", ">= 16"],
      http: true,
      "node:http": [">= 14.18 && < 15", ">= 16"],
      http2: ">= 8.8",
      "node:http2": [">= 14.18 && < 15", ">= 16"],
      https: true,
      "node:https": [">= 14.18 && < 15", ">= 16"],
      inspector: ">= 8",
      "node:inspector": [">= 14.18 && < 15", ">= 16"],
      _linklist: "< 8",
      module: true,
      "node:module": [">= 14.18 && < 15", ">= 16"],
      net: true,
      "node:net": [">= 14.18 && < 15", ">= 16"],
      "node-inspect/lib/_inspect": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
      os: true,
      "node:os": [">= 14.18 && < 15", ">= 16"],
      path: true,
      "node:path": [">= 14.18 && < 15", ">= 16"],
      "path/posix": ">= 15.3",
      "node:path/posix": ">= 16",
      "path/win32": ">= 15.3",
      "node:path/win32": ">= 16",
      perf_hooks: ">= 8.5",
      "node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
      process: ">= 1",
      "node:process": [">= 14.18 && < 15", ">= 16"],
      punycode: ">= 0.5",
      "node:punycode": [">= 14.18 && < 15", ">= 16"],
      querystring: true,
      "node:querystring": [">= 14.18 && < 15", ">= 16"],
      readline: true,
      "node:readline": [">= 14.18 && < 15", ">= 16"],
      "readline/promises": ">= 17",
      "node:readline/promises": ">= 17",
      repl: true,
      "node:repl": [">= 14.18 && < 15", ">= 16"],
      smalloc: ">= 0.11.5 && < 3",
      _stream_duplex: ">= 0.9.4",
      "node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
      _stream_transform: ">= 0.9.4",
      "node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
      _stream_wrap: ">= 1.4.1",
      "node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
      _stream_passthrough: ">= 0.9.4",
      "node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
      _stream_readable: ">= 0.9.4",
      "node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
      _stream_writable: ">= 0.9.4",
      "node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
      stream: true,
      "node:stream": [">= 14.18 && < 15", ">= 16"],
      "stream/consumers": ">= 16.7",
      "node:stream/consumers": ">= 16.7",
      "stream/promises": ">= 15",
      "node:stream/promises": ">= 16",
      "stream/web": ">= 16.5",
      "node:stream/web": ">= 16.5",
      string_decoder: true,
      "node:string_decoder": [">= 14.18 && < 15", ">= 16"],
      sys: [">= 0.4 && < 0.7", ">= 0.8"],
      "node:sys": [">= 14.18 && < 15", ">= 16"],
      "node:test": [">= 16.17 && < 17", ">= 18"],
      timers: true,
      "node:timers": [">= 14.18 && < 15", ">= 16"],
      "timers/promises": ">= 15",
      "node:timers/promises": ">= 16",
      _tls_common: ">= 0.11.13",
      "node:_tls_common": [">= 14.18 && < 15", ">= 16"],
      _tls_legacy: ">= 0.11.3 && < 10",
      _tls_wrap: ">= 0.11.3",
      "node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
      tls: true,
      "node:tls": [">= 14.18 && < 15", ">= 16"],
      trace_events: ">= 10",
      "node:trace_events": [">= 14.18 && < 15", ">= 16"],
      tty: true,
      "node:tty": [">= 14.18 && < 15", ">= 16"],
      url: true,
      "node:url": [">= 14.18 && < 15", ">= 16"],
      util: true,
      "node:util": [">= 14.18 && < 15", ">= 16"],
      "util/types": ">= 15.3",
      "node:util/types": ">= 16",
      "v8/tools/arguments": ">= 10 && < 12",
      "v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      v8: ">= 1",
      "node:v8": [">= 14.18 && < 15", ">= 16"],
      vm: true,
      "node:vm": [">= 14.18 && < 15", ">= 16"],
      wasi: ">= 13.4 && < 13.5",
      worker_threads: ">= 11.7",
      "node:worker_threads": [">= 14.18 && < 15", ">= 16"],
      zlib: ">= 0.5",
      "node:zlib": [">= 14.18 && < 15", ">= 16"]
    };
  }
});

// node_modules/is-core-module/index.js
var require_is_core_module = __commonJS({
  "node_modules/is-core-module/index.js"(exports, module2) {
    "use strict";
    var has = require_src();
    function specifierIncluded(current, specifier) {
      var nodeParts = current.split(".");
      var parts = specifier.split(" ");
      var op = parts.length > 1 ? parts[0] : "=";
      var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".");
      for (var i = 0; i < 3; ++i) {
        var cur = parseInt(nodeParts[i] || 0, 10);
        var ver = parseInt(versionParts[i] || 0, 10);
        if (cur === ver) {
          continue;
        }
        if (op === "<") {
          return cur < ver;
        }
        if (op === ">=") {
          return cur >= ver;
        }
        return false;
      }
      return op === ">=";
    }
    __name(specifierIncluded, "specifierIncluded");
    function matchesRange(current, range) {
      var specifiers = range.split(/ ?&& ?/);
      if (specifiers.length === 0) {
        return false;
      }
      for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(current, specifiers[i])) {
          return false;
        }
      }
      return true;
    }
    __name(matchesRange, "matchesRange");
    function versionIncluded(nodeVersion, specifierValue) {
      if (typeof specifierValue === "boolean") {
        return specifierValue;
      }
      var current = typeof nodeVersion === "undefined" ? process.versions && process.versions.node : nodeVersion;
      if (typeof current !== "string") {
        throw new TypeError(typeof nodeVersion === "undefined" ? "Unable to determine current node version" : "If provided, a valid node version is required");
      }
      if (specifierValue && typeof specifierValue === "object") {
        for (var i = 0; i < specifierValue.length; ++i) {
          if (matchesRange(current, specifierValue[i])) {
            return true;
          }
        }
        return false;
      }
      return matchesRange(current, specifierValue);
    }
    __name(versionIncluded, "versionIncluded");
    var data = require_core();
    module2.exports = /* @__PURE__ */ __name(function isCore(x, nodeVersion) {
      return has(data, x) && versionIncluded(nodeVersion, data[x]);
    }, "isCore");
  }
});

// node_modules/resolve/lib/async.js
var require_async = __commonJS({
  "node_modules/resolve/lib/async.js"(exports, module2) {
    var fs = require("fs");
    var getHomedir = require_homedir();
    var path = require("path");
    var caller = require_caller();
    var nodeModulesPaths = require_node_modules_paths();
    var normalizeOptions = require_normalize_options();
    var isCore = require_is_core_module();
    var realpathFS = process.platform !== "win32" && fs.realpath && typeof fs.realpath.native === "function" ? fs.realpath.native : fs.realpath;
    var homedir = getHomedir();
    var defaultPaths = /* @__PURE__ */ __name(function() {
      return [
        path.join(homedir, ".node_modules"),
        path.join(homedir, ".node_libraries")
      ];
    }, "defaultPaths");
    var defaultIsFile = /* @__PURE__ */ __name(function isFile(file, cb) {
      fs.stat(file, function(err, stat) {
        if (!err) {
          return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === "ENOENT" || err.code === "ENOTDIR")
          return cb(null, false);
        return cb(err);
      });
    }, "isFile");
    var defaultIsDir = /* @__PURE__ */ __name(function isDirectory(dir, cb) {
      fs.stat(dir, function(err, stat) {
        if (!err) {
          return cb(null, stat.isDirectory());
        }
        if (err.code === "ENOENT" || err.code === "ENOTDIR")
          return cb(null, false);
        return cb(err);
      });
    }, "isDirectory");
    var defaultRealpath = /* @__PURE__ */ __name(function realpath(x, cb) {
      realpathFS(x, function(realpathErr, realPath) {
        if (realpathErr && realpathErr.code !== "ENOENT")
          cb(realpathErr);
        else
          cb(null, realpathErr ? x : realPath);
      });
    }, "realpath");
    var maybeRealpath = /* @__PURE__ */ __name(function maybeRealpath2(realpath, x, opts, cb) {
      if (opts && opts.preserveSymlinks === false) {
        realpath(x, cb);
      } else {
        cb(null, x);
      }
    }, "maybeRealpath");
    var defaultReadPackage = /* @__PURE__ */ __name(function defaultReadPackage2(readFile, pkgfile, cb) {
      readFile(pkgfile, function(readFileErr, body) {
        if (readFileErr)
          cb(readFileErr);
        else {
          try {
            var pkg = JSON.parse(body);
            cb(null, pkg);
          } catch (jsonErr) {
            cb(null);
          }
        }
      });
    }, "defaultReadPackage");
    var getPackageCandidates = /* @__PURE__ */ __name(function getPackageCandidates2(x, start, opts) {
      var dirs = nodeModulesPaths(start, opts, x);
      for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
      }
      return dirs;
    }, "getPackageCandidates");
    module2.exports = /* @__PURE__ */ __name(function resolve(x, options, callback) {
      var cb = callback;
      var opts = options;
      if (typeof options === "function") {
        cb = opts;
        opts = {};
      }
      if (typeof x !== "string") {
        var err = new TypeError("Path must be a string.");
        return process.nextTick(function() {
          cb(err);
        });
      }
      opts = normalizeOptions(x, opts);
      var isFile = opts.isFile || defaultIsFile;
      var isDirectory = opts.isDirectory || defaultIsDir;
      var readFile = opts.readFile || fs.readFile;
      var realpath = opts.realpath || defaultRealpath;
      var readPackage = opts.readPackage || defaultReadPackage;
      if (opts.readFile && opts.readPackage) {
        var conflictErr = new TypeError("`readFile` and `readPackage` are mutually exclusive.");
        return process.nextTick(function() {
          cb(conflictErr);
        });
      }
      var packageIterator = opts.packageIterator;
      var extensions = opts.extensions || [
        ".js"
      ];
      var includeCoreModules = opts.includeCoreModules !== false;
      var basedir = opts.basedir || path.dirname(caller());
      var parent = opts.filename || basedir;
      opts.paths = opts.paths || defaultPaths();
      var absoluteStart = path.resolve(basedir);
      maybeRealpath(realpath, absoluteStart, opts, function(err2, realStart) {
        if (err2)
          cb(err2);
        else
          init(realStart);
      });
      var res;
      function init(basedir2) {
        if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
          res = path.resolve(basedir2, x);
          if (x === "." || x === ".." || x.slice(-1) === "/")
            res += "/";
          if (/\/$/.test(x) && res === basedir2) {
            loadAsDirectory(res, opts.package, onfile);
          } else
            loadAsFile(res, opts.package, onfile);
        } else if (includeCoreModules && isCore(x)) {
          return cb(null, x);
        } else
          loadNodeModules(x, basedir2, function(err2, n, pkg) {
            if (err2)
              cb(err2);
            else if (n) {
              return maybeRealpath(realpath, n, opts, function(err3, realN) {
                if (err3) {
                  cb(err3);
                } else {
                  cb(null, realN, pkg);
                }
              });
            } else {
              var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
              moduleError.code = "MODULE_NOT_FOUND";
              cb(moduleError);
            }
          });
      }
      __name(init, "init");
      function onfile(err2, m, pkg) {
        if (err2)
          cb(err2);
        else if (m)
          cb(null, m, pkg);
        else
          loadAsDirectory(res, function(err3, d, pkg2) {
            if (err3)
              cb(err3);
            else if (d) {
              maybeRealpath(realpath, d, opts, function(err4, realD) {
                if (err4) {
                  cb(err4);
                } else {
                  cb(null, realD, pkg2);
                }
              });
            } else {
              var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
              moduleError.code = "MODULE_NOT_FOUND";
              cb(moduleError);
            }
          });
      }
      __name(onfile, "onfile");
      function loadAsFile(x2, thePackage, callback2) {
        var loadAsFilePackage = thePackage;
        var cb2 = callback2;
        if (typeof loadAsFilePackage === "function") {
          cb2 = loadAsFilePackage;
          loadAsFilePackage = void 0;
        }
        var exts = [
          ""
        ].concat(extensions);
        load(exts, x2, loadAsFilePackage);
        function load(exts2, x3, loadPackage) {
          if (exts2.length === 0)
            return cb2(null, void 0, loadPackage);
          var file = x3 + exts2[0];
          var pkg = loadPackage;
          if (pkg)
            onpkg(null, pkg);
          else
            loadpkg(path.dirname(file), onpkg);
          function onpkg(err2, pkg_, dir) {
            pkg = pkg_;
            if (err2)
              return cb2(err2);
            if (dir && pkg && opts.pathFilter) {
              var rfile = path.relative(dir, file);
              var rel = rfile.slice(0, rfile.length - exts2[0].length);
              var r = opts.pathFilter(pkg, x3, rel);
              if (r)
                return load([
                  ""
                ].concat(extensions.slice()), path.resolve(dir, r), pkg);
            }
            isFile(file, onex);
          }
          __name(onpkg, "onpkg");
          function onex(err2, ex) {
            if (err2)
              return cb2(err2);
            if (ex)
              return cb2(null, file, pkg);
            load(exts2.slice(1), x3, pkg);
          }
          __name(onex, "onex");
        }
        __name(load, "load");
      }
      __name(loadAsFile, "loadAsFile");
      function loadpkg(dir, cb2) {
        if (dir === "" || dir === "/")
          return cb2(null);
        if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
          return cb2(null);
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir))
          return cb2(null);
        maybeRealpath(realpath, dir, opts, function(unwrapErr, pkgdir) {
          if (unwrapErr)
            return loadpkg(path.dirname(dir), cb2);
          var pkgfile = path.join(pkgdir, "package.json");
          isFile(pkgfile, function(err2, ex) {
            if (!ex)
              return loadpkg(path.dirname(dir), cb2);
            readPackage(readFile, pkgfile, function(err3, pkgParam) {
              if (err3)
                cb2(err3);
              var pkg = pkgParam;
              if (pkg && opts.packageFilter) {
                pkg = opts.packageFilter(pkg, pkgfile);
              }
              cb2(null, pkg, dir);
            });
          });
        });
      }
      __name(loadpkg, "loadpkg");
      function loadAsDirectory(x2, loadAsDirectoryPackage, callback2) {
        var cb2 = callback2;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === "function") {
          cb2 = fpkg;
          fpkg = opts.package;
        }
        maybeRealpath(realpath, x2, opts, function(unwrapErr, pkgdir) {
          if (unwrapErr)
            return cb2(unwrapErr);
          var pkgfile = path.join(pkgdir, "package.json");
          isFile(pkgfile, function(err2, ex) {
            if (err2)
              return cb2(err2);
            if (!ex)
              return loadAsFile(path.join(x2, "index"), fpkg, cb2);
            readPackage(readFile, pkgfile, function(err3, pkgParam) {
              if (err3)
                return cb2(err3);
              var pkg = pkgParam;
              if (pkg && opts.packageFilter) {
                pkg = opts.packageFilter(pkg, pkgfile);
              }
              if (pkg && pkg.main) {
                if (typeof pkg.main !== "string") {
                  var mainError = new TypeError("package \u201C" + pkg.name + "\u201D `main` must be a string");
                  mainError.code = "INVALID_PACKAGE_MAIN";
                  return cb2(mainError);
                }
                if (pkg.main === "." || pkg.main === "./") {
                  pkg.main = "index";
                }
                loadAsFile(path.resolve(x2, pkg.main), pkg, function(err4, m, pkg2) {
                  if (err4)
                    return cb2(err4);
                  if (m)
                    return cb2(null, m, pkg2);
                  if (!pkg2)
                    return loadAsFile(path.join(x2, "index"), pkg2, cb2);
                  var dir = path.resolve(x2, pkg2.main);
                  loadAsDirectory(dir, pkg2, function(err5, n, pkg3) {
                    if (err5)
                      return cb2(err5);
                    if (n)
                      return cb2(null, n, pkg3);
                    loadAsFile(path.join(x2, "index"), pkg3, cb2);
                  });
                });
                return;
              }
              loadAsFile(path.join(x2, "/index"), pkg, cb2);
            });
          });
        });
      }
      __name(loadAsDirectory, "loadAsDirectory");
      function processDirs(cb2, dirs) {
        if (dirs.length === 0)
          return cb2(null, void 0);
        var dir = dirs[0];
        isDirectory(path.dirname(dir), isdir);
        function isdir(err2, isdir2) {
          if (err2)
            return cb2(err2);
          if (!isdir2)
            return processDirs(cb2, dirs.slice(1));
          loadAsFile(dir, opts.package, onfile2);
        }
        __name(isdir, "isdir");
        function onfile2(err2, m, pkg) {
          if (err2)
            return cb2(err2);
          if (m)
            return cb2(null, m, pkg);
          loadAsDirectory(dir, opts.package, ondir);
        }
        __name(onfile2, "onfile");
        function ondir(err2, n, pkg) {
          if (err2)
            return cb2(err2);
          if (n)
            return cb2(null, n, pkg);
          processDirs(cb2, dirs.slice(1));
        }
        __name(ondir, "ondir");
      }
      __name(processDirs, "processDirs");
      function loadNodeModules(x2, start, cb2) {
        var thunk = /* @__PURE__ */ __name(function() {
          return getPackageCandidates(x2, start, opts);
        }, "thunk");
        processDirs(cb2, packageIterator ? packageIterator(x2, start, thunk, opts) : thunk());
      }
      __name(loadNodeModules, "loadNodeModules");
    }, "resolve");
  }
});

// node_modules/resolve/lib/core.json
var require_core2 = __commonJS({
  "node_modules/resolve/lib/core.json"(exports, module2) {
    module2.exports = {
      assert: true,
      "node:assert": [">= 14.18 && < 15", ">= 16"],
      "assert/strict": ">= 15",
      "node:assert/strict": ">= 16",
      async_hooks: ">= 8",
      "node:async_hooks": [">= 14.18 && < 15", ">= 16"],
      buffer_ieee754: ">= 0.5 && < 0.9.7",
      buffer: true,
      "node:buffer": [">= 14.18 && < 15", ">= 16"],
      child_process: true,
      "node:child_process": [">= 14.18 && < 15", ">= 16"],
      cluster: ">= 0.5",
      "node:cluster": [">= 14.18 && < 15", ">= 16"],
      console: true,
      "node:console": [">= 14.18 && < 15", ">= 16"],
      constants: true,
      "node:constants": [">= 14.18 && < 15", ">= 16"],
      crypto: true,
      "node:crypto": [">= 14.18 && < 15", ">= 16"],
      _debug_agent: ">= 1 && < 8",
      _debugger: "< 8",
      dgram: true,
      "node:dgram": [">= 14.18 && < 15", ">= 16"],
      diagnostics_channel: [">= 14.17 && < 15", ">= 15.1"],
      "node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
      dns: true,
      "node:dns": [">= 14.18 && < 15", ">= 16"],
      "dns/promises": ">= 15",
      "node:dns/promises": ">= 16",
      domain: ">= 0.7.12",
      "node:domain": [">= 14.18 && < 15", ">= 16"],
      events: true,
      "node:events": [">= 14.18 && < 15", ">= 16"],
      freelist: "< 6",
      fs: true,
      "node:fs": [">= 14.18 && < 15", ">= 16"],
      "fs/promises": [">= 10 && < 10.1", ">= 14"],
      "node:fs/promises": [">= 14.18 && < 15", ">= 16"],
      _http_agent: ">= 0.11.1",
      "node:_http_agent": [">= 14.18 && < 15", ">= 16"],
      _http_client: ">= 0.11.1",
      "node:_http_client": [">= 14.18 && < 15", ">= 16"],
      _http_common: ">= 0.11.1",
      "node:_http_common": [">= 14.18 && < 15", ">= 16"],
      _http_incoming: ">= 0.11.1",
      "node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
      _http_outgoing: ">= 0.11.1",
      "node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
      _http_server: ">= 0.11.1",
      "node:_http_server": [">= 14.18 && < 15", ">= 16"],
      http: true,
      "node:http": [">= 14.18 && < 15", ">= 16"],
      http2: ">= 8.8",
      "node:http2": [">= 14.18 && < 15", ">= 16"],
      https: true,
      "node:https": [">= 14.18 && < 15", ">= 16"],
      inspector: ">= 8",
      "node:inspector": [">= 14.18 && < 15", ">= 16"],
      _linklist: "< 8",
      module: true,
      "node:module": [">= 14.18 && < 15", ">= 16"],
      net: true,
      "node:net": [">= 14.18 && < 15", ">= 16"],
      "node-inspect/lib/_inspect": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
      os: true,
      "node:os": [">= 14.18 && < 15", ">= 16"],
      path: true,
      "node:path": [">= 14.18 && < 15", ">= 16"],
      "path/posix": ">= 15.3",
      "node:path/posix": ">= 16",
      "path/win32": ">= 15.3",
      "node:path/win32": ">= 16",
      perf_hooks: ">= 8.5",
      "node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
      process: ">= 1",
      "node:process": [">= 14.18 && < 15", ">= 16"],
      punycode: ">= 0.5",
      "node:punycode": [">= 14.18 && < 15", ">= 16"],
      querystring: true,
      "node:querystring": [">= 14.18 && < 15", ">= 16"],
      readline: true,
      "node:readline": [">= 14.18 && < 15", ">= 16"],
      "readline/promises": ">= 17",
      "node:readline/promises": ">= 17",
      repl: true,
      "node:repl": [">= 14.18 && < 15", ">= 16"],
      smalloc: ">= 0.11.5 && < 3",
      _stream_duplex: ">= 0.9.4",
      "node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
      _stream_transform: ">= 0.9.4",
      "node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
      _stream_wrap: ">= 1.4.1",
      "node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
      _stream_passthrough: ">= 0.9.4",
      "node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
      _stream_readable: ">= 0.9.4",
      "node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
      _stream_writable: ">= 0.9.4",
      "node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
      stream: true,
      "node:stream": [">= 14.18 && < 15", ">= 16"],
      "stream/consumers": ">= 16.7",
      "node:stream/consumers": ">= 16.7",
      "stream/promises": ">= 15",
      "node:stream/promises": ">= 16",
      "stream/web": ">= 16.5",
      "node:stream/web": ">= 16.5",
      string_decoder: true,
      "node:string_decoder": [">= 14.18 && < 15", ">= 16"],
      sys: [">= 0.4 && < 0.7", ">= 0.8"],
      "node:sys": [">= 14.18 && < 15", ">= 16"],
      "node:test": ">= 18",
      timers: true,
      "node:timers": [">= 14.18 && < 15", ">= 16"],
      "timers/promises": ">= 15",
      "node:timers/promises": ">= 16",
      _tls_common: ">= 0.11.13",
      "node:_tls_common": [">= 14.18 && < 15", ">= 16"],
      _tls_legacy: ">= 0.11.3 && < 10",
      _tls_wrap: ">= 0.11.3",
      "node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
      tls: true,
      "node:tls": [">= 14.18 && < 15", ">= 16"],
      trace_events: ">= 10",
      "node:trace_events": [">= 14.18 && < 15", ">= 16"],
      tty: true,
      "node:tty": [">= 14.18 && < 15", ">= 16"],
      url: true,
      "node:url": [">= 14.18 && < 15", ">= 16"],
      util: true,
      "node:util": [">= 14.18 && < 15", ">= 16"],
      "util/types": ">= 15.3",
      "node:util/types": ">= 16",
      "v8/tools/arguments": ">= 10 && < 12",
      "v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      v8: ">= 1",
      "node:v8": [">= 14.18 && < 15", ">= 16"],
      vm: true,
      "node:vm": [">= 14.18 && < 15", ">= 16"],
      wasi: ">= 13.4 && < 13.5",
      worker_threads: ">= 11.7",
      "node:worker_threads": [">= 14.18 && < 15", ">= 16"],
      zlib: ">= 0.5",
      "node:zlib": [">= 14.18 && < 15", ">= 16"]
    };
  }
});

// node_modules/resolve/lib/core.js
var require_core3 = __commonJS({
  "node_modules/resolve/lib/core.js"(exports, module2) {
    var current = process.versions && process.versions.node && process.versions.node.split(".") || [];
    function specifierIncluded(specifier) {
      var parts = specifier.split(" ");
      var op = parts.length > 1 ? parts[0] : "=";
      var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".");
      for (var i = 0; i < 3; ++i) {
        var cur = parseInt(current[i] || 0, 10);
        var ver = parseInt(versionParts[i] || 0, 10);
        if (cur === ver) {
          continue;
        }
        if (op === "<") {
          return cur < ver;
        } else if (op === ">=") {
          return cur >= ver;
        }
        return false;
      }
      return op === ">=";
    }
    __name(specifierIncluded, "specifierIncluded");
    function matchesRange(range) {
      var specifiers = range.split(/ ?&& ?/);
      if (specifiers.length === 0) {
        return false;
      }
      for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(specifiers[i])) {
          return false;
        }
      }
      return true;
    }
    __name(matchesRange, "matchesRange");
    function versionIncluded(specifierValue) {
      if (typeof specifierValue === "boolean") {
        return specifierValue;
      }
      if (specifierValue && typeof specifierValue === "object") {
        for (var i = 0; i < specifierValue.length; ++i) {
          if (matchesRange(specifierValue[i])) {
            return true;
          }
        }
        return false;
      }
      return matchesRange(specifierValue);
    }
    __name(versionIncluded, "versionIncluded");
    var data = require_core2();
    var core = {};
    for (mod in data) {
      if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core[mod] = versionIncluded(data[mod]);
      }
    }
    var mod;
    module2.exports = core;
  }
});

// node_modules/resolve/lib/is-core.js
var require_is_core = __commonJS({
  "node_modules/resolve/lib/is-core.js"(exports, module2) {
    var isCoreModule = require_is_core_module();
    module2.exports = /* @__PURE__ */ __name(function isCore(x) {
      return isCoreModule(x);
    }, "isCore");
  }
});

// node_modules/resolve/lib/sync.js
var require_sync = __commonJS({
  "node_modules/resolve/lib/sync.js"(exports, module2) {
    var isCore = require_is_core_module();
    var fs = require("fs");
    var path = require("path");
    var getHomedir = require_homedir();
    var caller = require_caller();
    var nodeModulesPaths = require_node_modules_paths();
    var normalizeOptions = require_normalize_options();
    var realpathFS = process.platform !== "win32" && fs.realpathSync && typeof fs.realpathSync.native === "function" ? fs.realpathSync.native : fs.realpathSync;
    var homedir = getHomedir();
    var defaultPaths = /* @__PURE__ */ __name(function() {
      return [
        path.join(homedir, ".node_modules"),
        path.join(homedir, ".node_libraries")
      ];
    }, "defaultPaths");
    var defaultIsFile = /* @__PURE__ */ __name(function isFile(file) {
      try {
        var stat = fs.statSync(file, {
          throwIfNoEntry: false
        });
      } catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR"))
          return false;
        throw e;
      }
      return !!stat && (stat.isFile() || stat.isFIFO());
    }, "isFile");
    var defaultIsDir = /* @__PURE__ */ __name(function isDirectory(dir) {
      try {
        var stat = fs.statSync(dir, {
          throwIfNoEntry: false
        });
      } catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR"))
          return false;
        throw e;
      }
      return !!stat && stat.isDirectory();
    }, "isDirectory");
    var defaultRealpathSync = /* @__PURE__ */ __name(function realpathSync(x) {
      try {
        return realpathFS(x);
      } catch (realpathErr) {
        if (realpathErr.code !== "ENOENT") {
          throw realpathErr;
        }
      }
      return x;
    }, "realpathSync");
    var maybeRealpathSync = /* @__PURE__ */ __name(function maybeRealpathSync2(realpathSync, x, opts) {
      if (opts && opts.preserveSymlinks === false) {
        return realpathSync(x);
      }
      return x;
    }, "maybeRealpathSync");
    var defaultReadPackageSync = /* @__PURE__ */ __name(function defaultReadPackageSync2(readFileSync, pkgfile) {
      var body = readFileSync(pkgfile);
      try {
        var pkg = JSON.parse(body);
        return pkg;
      } catch (jsonErr) {
      }
    }, "defaultReadPackageSync");
    var getPackageCandidates = /* @__PURE__ */ __name(function getPackageCandidates2(x, start, opts) {
      var dirs = nodeModulesPaths(start, opts, x);
      for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
      }
      return dirs;
    }, "getPackageCandidates");
    module2.exports = /* @__PURE__ */ __name(function resolveSync(x, options) {
      if (typeof x !== "string") {
        throw new TypeError("Path must be a string.");
      }
      var opts = normalizeOptions(x, options);
      var isFile = opts.isFile || defaultIsFile;
      var readFileSync = opts.readFileSync || fs.readFileSync;
      var isDirectory = opts.isDirectory || defaultIsDir;
      var realpathSync = opts.realpathSync || defaultRealpathSync;
      var readPackageSync = opts.readPackageSync || defaultReadPackageSync;
      if (opts.readFileSync && opts.readPackageSync) {
        throw new TypeError("`readFileSync` and `readPackageSync` are mutually exclusive.");
      }
      var packageIterator = opts.packageIterator;
      var extensions = opts.extensions || [
        ".js"
      ];
      var includeCoreModules = opts.includeCoreModules !== false;
      var basedir = opts.basedir || path.dirname(caller());
      var parent = opts.filename || basedir;
      opts.paths = opts.paths || defaultPaths();
      var absoluteStart = maybeRealpathSync(realpathSync, path.resolve(basedir), opts);
      if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        var res = path.resolve(absoluteStart, x);
        if (x === "." || x === ".." || x.slice(-1) === "/")
          res += "/";
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m)
          return maybeRealpathSync(realpathSync, m, opts);
      } else if (includeCoreModules && isCore(x)) {
        return x;
      } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n)
          return maybeRealpathSync(realpathSync, n, opts);
      }
      var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
      err.code = "MODULE_NOT_FOUND";
      throw err;
      function loadAsFileSync(x2) {
        var pkg = loadpkg(path.dirname(x2));
        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
          var rfile = path.relative(pkg.dir, x2);
          var r = opts.pathFilter(pkg.pkg, x2, rfile);
          if (r) {
            x2 = path.resolve(pkg.dir, r);
          }
        }
        if (isFile(x2)) {
          return x2;
        }
        for (var i = 0; i < extensions.length; i++) {
          var file = x2 + extensions[i];
          if (isFile(file)) {
            return file;
          }
        }
      }
      __name(loadAsFileSync, "loadAsFileSync");
      function loadpkg(dir) {
        if (dir === "" || dir === "/")
          return;
        if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
          return;
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir))
          return;
        var pkgfile = path.join(maybeRealpathSync(realpathSync, dir, opts), "package.json");
        if (!isFile(pkgfile)) {
          return loadpkg(path.dirname(dir));
        }
        var pkg = readPackageSync(readFileSync, pkgfile);
        if (pkg && opts.packageFilter) {
          pkg = opts.packageFilter(pkg, dir);
        }
        return {
          pkg,
          dir
        };
      }
      __name(loadpkg, "loadpkg");
      function loadAsDirectorySync(x2) {
        var pkgfile = path.join(maybeRealpathSync(realpathSync, x2, opts), "/package.json");
        if (isFile(pkgfile)) {
          try {
            var pkg = readPackageSync(readFileSync, pkgfile);
          } catch (e) {
          }
          if (pkg && opts.packageFilter) {
            pkg = opts.packageFilter(pkg, x2);
          }
          if (pkg && pkg.main) {
            if (typeof pkg.main !== "string") {
              var mainError = new TypeError("package \u201C" + pkg.name + "\u201D `main` must be a string");
              mainError.code = "INVALID_PACKAGE_MAIN";
              throw mainError;
            }
            if (pkg.main === "." || pkg.main === "./") {
              pkg.main = "index";
            }
            try {
              var m2 = loadAsFileSync(path.resolve(x2, pkg.main));
              if (m2)
                return m2;
              var n2 = loadAsDirectorySync(path.resolve(x2, pkg.main));
              if (n2)
                return n2;
            } catch (e1) {
            }
          }
        }
        return loadAsFileSync(path.join(x2, "/index"));
      }
      __name(loadAsDirectorySync, "loadAsDirectorySync");
      function loadNodeModulesSync(x2, start) {
        var thunk = /* @__PURE__ */ __name(function() {
          return getPackageCandidates(x2, start, opts);
        }, "thunk");
        var dirs = packageIterator ? packageIterator(x2, start, thunk, opts) : thunk();
        for (var i = 0; i < dirs.length; i++) {
          var dir = dirs[i];
          if (isDirectory(path.dirname(dir))) {
            var m2 = loadAsFileSync(dir);
            if (m2)
              return m2;
            var n2 = loadAsDirectorySync(dir);
            if (n2)
              return n2;
          }
        }
      }
      __name(loadNodeModulesSync, "loadNodeModulesSync");
    }, "resolveSync");
  }
});

// node_modules/resolve/index.js
var require_resolve = __commonJS({
  "node_modules/resolve/index.js"(exports, module2) {
    var async = require_async();
    async.core = require_core3();
    async.isCore = require_is_core();
    async.sync = require_sync();
    module2.exports = async;
  }
});

// node_modules/normalize-package-data/lib/extract_description.js
var require_extract_description = __commonJS({
  "node_modules/normalize-package-data/lib/extract_description.js"(exports, module2) {
    module2.exports = extractDescription;
    function extractDescription(d) {
      if (!d)
        return;
      if (d === "ERROR: No README data found!")
        return;
      d = d.trim().split("\n");
      for (var s = 0; d[s] && d[s].trim().match(/^(#|$)/); s++)
        ;
      var l = d.length;
      for (var e = s + 1; e < l && d[e].trim(); e++)
        ;
      return d.slice(s, e).join(" ").trim();
    }
    __name(extractDescription, "extractDescription");
  }
});

// node_modules/normalize-package-data/lib/typos.json
var require_typos = __commonJS({
  "node_modules/normalize-package-data/lib/typos.json"(exports, module2) {
    module2.exports = {
      topLevel: {
        dependancies: "dependencies",
        dependecies: "dependencies",
        depdenencies: "dependencies",
        devEependencies: "devDependencies",
        depends: "dependencies",
        "dev-dependencies": "devDependencies",
        devDependences: "devDependencies",
        devDepenencies: "devDependencies",
        devdependencies: "devDependencies",
        repostitory: "repository",
        repo: "repository",
        prefereGlobal: "preferGlobal",
        hompage: "homepage",
        hampage: "homepage",
        autohr: "author",
        autor: "author",
        contributers: "contributors",
        publicationConfig: "publishConfig",
        script: "scripts"
      },
      bugs: { web: "url", name: "url" },
      script: { server: "start", tests: "test" }
    };
  }
});

// node_modules/normalize-package-data/lib/fixer.js
var require_fixer = __commonJS({
  "node_modules/normalize-package-data/lib/fixer.js"(exports, module2) {
    var semver = require_semver();
    var validateLicense = require_validate_npm_package_license();
    var hostedGitInfo = require_hosted_git_info();
    var isBuiltinModule = require_resolve().isCore;
    var depTypes = [
      "dependencies",
      "devDependencies",
      "optionalDependencies"
    ];
    var extractDescription = require_extract_description();
    var url = require("url");
    var typos = require_typos();
    var fixer = module2.exports = {
      warn: function() {
      },
      fixRepositoryField: function(data) {
        if (data.repositories) {
          this.warn("repositories");
          data.repository = data.repositories[0];
        }
        if (!data.repository)
          return this.warn("missingRepository");
        if (typeof data.repository === "string") {
          data.repository = {
            type: "git",
            url: data.repository
          };
        }
        var r = data.repository.url || "";
        if (r) {
          var hosted = hostedGitInfo.fromUrl(r);
          if (hosted) {
            r = data.repository.url = hosted.getDefaultRepresentation() == "shortcut" ? hosted.https() : hosted.toString();
          }
        }
        if (r.match(/github.com\/[^\/]+\/[^\/]+\.git\.git$/)) {
          this.warn("brokenGitUrl", r);
        }
      },
      fixTypos: function(data) {
        Object.keys(typos.topLevel).forEach(function(d) {
          if (data.hasOwnProperty(d)) {
            this.warn("typo", d, typos.topLevel[d]);
          }
        }, this);
      },
      fixScriptsField: function(data) {
        if (!data.scripts)
          return;
        if (typeof data.scripts !== "object") {
          this.warn("nonObjectScripts");
          delete data.scripts;
          return;
        }
        Object.keys(data.scripts).forEach(function(k) {
          if (typeof data.scripts[k] !== "string") {
            this.warn("nonStringScript");
            delete data.scripts[k];
          } else if (typos.script[k] && !data.scripts[typos.script[k]]) {
            this.warn("typo", k, typos.script[k], "scripts");
          }
        }, this);
      },
      fixFilesField: function(data) {
        var files = data.files;
        if (files && !Array.isArray(files)) {
          this.warn("nonArrayFiles");
          delete data.files;
        } else if (data.files) {
          data.files = data.files.filter(function(file) {
            if (!file || typeof file !== "string") {
              this.warn("invalidFilename", file);
              return false;
            } else {
              return true;
            }
          }, this);
        }
      },
      fixBinField: function(data) {
        if (!data.bin)
          return;
        if (typeof data.bin === "string") {
          var b = {};
          var match;
          if (match = data.name.match(/^@[^/]+[/](.*)$/)) {
            b[match[1]] = data.bin;
          } else {
            b[data.name] = data.bin;
          }
          data.bin = b;
        }
      },
      fixManField: function(data) {
        if (!data.man)
          return;
        if (typeof data.man === "string") {
          data.man = [
            data.man
          ];
        }
      },
      fixBundleDependenciesField: function(data) {
        var bdd = "bundledDependencies";
        var bd = "bundleDependencies";
        if (data[bdd] && !data[bd]) {
          data[bd] = data[bdd];
          delete data[bdd];
        }
        if (data[bd] && !Array.isArray(data[bd])) {
          this.warn("nonArrayBundleDependencies");
          delete data[bd];
        } else if (data[bd]) {
          data[bd] = data[bd].filter(function(bd2) {
            if (!bd2 || typeof bd2 !== "string") {
              this.warn("nonStringBundleDependency", bd2);
              return false;
            } else {
              if (!data.dependencies) {
                data.dependencies = {};
              }
              if (!data.dependencies.hasOwnProperty(bd2)) {
                this.warn("nonDependencyBundleDependency", bd2);
                data.dependencies[bd2] = "*";
              }
              return true;
            }
          }, this);
        }
      },
      fixDependencies: function(data, strict) {
        var loose = !strict;
        objectifyDeps(data, this.warn);
        addOptionalDepsToDeps(data, this.warn);
        this.fixBundleDependenciesField(data);
        [
          "dependencies",
          "devDependencies"
        ].forEach(function(deps) {
          if (!(deps in data))
            return;
          if (!data[deps] || typeof data[deps] !== "object") {
            this.warn("nonObjectDependencies", deps);
            delete data[deps];
            return;
          }
          Object.keys(data[deps]).forEach(function(d) {
            var r = data[deps][d];
            if (typeof r !== "string") {
              this.warn("nonStringDependency", d, JSON.stringify(r));
              delete data[deps][d];
            }
            var hosted = hostedGitInfo.fromUrl(data[deps][d]);
            if (hosted)
              data[deps][d] = hosted.toString();
          }, this);
        }, this);
      },
      fixModulesField: function(data) {
        if (data.modules) {
          this.warn("deprecatedModules");
          delete data.modules;
        }
      },
      fixKeywordsField: function(data) {
        if (typeof data.keywords === "string") {
          data.keywords = data.keywords.split(/,\s+/);
        }
        if (data.keywords && !Array.isArray(data.keywords)) {
          delete data.keywords;
          this.warn("nonArrayKeywords");
        } else if (data.keywords) {
          data.keywords = data.keywords.filter(function(kw) {
            if (typeof kw !== "string" || !kw) {
              this.warn("nonStringKeyword");
              return false;
            } else {
              return true;
            }
          }, this);
        }
      },
      fixVersionField: function(data, strict) {
        var loose = !strict;
        if (!data.version) {
          data.version = "";
          return true;
        }
        if (!semver.valid(data.version, loose)) {
          throw new Error('Invalid version: "' + data.version + '"');
        }
        data.version = semver.clean(data.version, loose);
        return true;
      },
      fixPeople: function(data) {
        modifyPeople(data, unParsePerson);
        modifyPeople(data, parsePerson);
      },
      fixNameField: function(data, options) {
        if (typeof options === "boolean")
          options = {
            strict: options
          };
        else if (typeof options === "undefined")
          options = {};
        var strict = options.strict;
        if (!data.name && !strict) {
          data.name = "";
          return;
        }
        if (typeof data.name !== "string") {
          throw new Error("name field must be a string.");
        }
        if (!strict)
          data.name = data.name.trim();
        ensureValidName(data.name, strict, options.allowLegacyCase);
        if (isBuiltinModule(data.name))
          this.warn("conflictingName", data.name);
      },
      fixDescriptionField: function(data) {
        if (data.description && typeof data.description !== "string") {
          this.warn("nonStringDescription");
          delete data.description;
        }
        if (data.readme && !data.description)
          data.description = extractDescription(data.readme);
        if (data.description === void 0)
          delete data.description;
        if (!data.description)
          this.warn("missingDescription");
      },
      fixReadmeField: function(data) {
        if (!data.readme) {
          this.warn("missingReadme");
          data.readme = "ERROR: No README data found!";
        }
      },
      fixBugsField: function(data) {
        if (!data.bugs && data.repository && data.repository.url) {
          var hosted = hostedGitInfo.fromUrl(data.repository.url);
          if (hosted && hosted.bugs()) {
            data.bugs = {
              url: hosted.bugs()
            };
          }
        } else if (data.bugs) {
          var emailRe = /^.+@.*\..+$/;
          if (typeof data.bugs == "string") {
            if (emailRe.test(data.bugs))
              data.bugs = {
                email: data.bugs
              };
            else if (url.parse(data.bugs).protocol)
              data.bugs = {
                url: data.bugs
              };
            else
              this.warn("nonEmailUrlBugsString");
          } else {
            bugsTypos(data.bugs, this.warn);
            var oldBugs = data.bugs;
            data.bugs = {};
            if (oldBugs.url) {
              if (typeof oldBugs.url == "string" && url.parse(oldBugs.url).protocol)
                data.bugs.url = oldBugs.url;
              else
                this.warn("nonUrlBugsUrlField");
            }
            if (oldBugs.email) {
              if (typeof oldBugs.email == "string" && emailRe.test(oldBugs.email))
                data.bugs.email = oldBugs.email;
              else
                this.warn("nonEmailBugsEmailField");
            }
          }
          if (!data.bugs.email && !data.bugs.url) {
            delete data.bugs;
            this.warn("emptyNormalizedBugs");
          }
        }
      },
      fixHomepageField: function(data) {
        if (!data.homepage && data.repository && data.repository.url) {
          var hosted = hostedGitInfo.fromUrl(data.repository.url);
          if (hosted && hosted.docs())
            data.homepage = hosted.docs();
        }
        if (!data.homepage)
          return;
        if (typeof data.homepage !== "string") {
          this.warn("nonUrlHomepage");
          return delete data.homepage;
        }
        if (!url.parse(data.homepage).protocol) {
          data.homepage = "http://" + data.homepage;
        }
      },
      fixLicenseField: function(data) {
        if (!data.license) {
          return this.warn("missingLicense");
        } else {
          if (typeof data.license !== "string" || data.license.length < 1 || data.license.trim() === "") {
            this.warn("invalidLicense");
          } else {
            if (!validateLicense(data.license).validForNewPackages)
              this.warn("invalidLicense");
          }
        }
      }
    };
    function isValidScopedPackageName(spec) {
      if (spec.charAt(0) !== "@")
        return false;
      var rest = spec.slice(1).split("/");
      if (rest.length !== 2)
        return false;
      return rest[0] && rest[1] && rest[0] === encodeURIComponent(rest[0]) && rest[1] === encodeURIComponent(rest[1]);
    }
    __name(isValidScopedPackageName, "isValidScopedPackageName");
    function isCorrectlyEncodedName(spec) {
      return !spec.match(/[\/@\s\+%:]/) && spec === encodeURIComponent(spec);
    }
    __name(isCorrectlyEncodedName, "isCorrectlyEncodedName");
    function ensureValidName(name, strict, allowLegacyCase) {
      if (name.charAt(0) === "." || !(isValidScopedPackageName(name) || isCorrectlyEncodedName(name)) || strict && !allowLegacyCase && name !== name.toLowerCase() || name.toLowerCase() === "node_modules" || name.toLowerCase() === "favicon.ico") {
        throw new Error("Invalid name: " + JSON.stringify(name));
      }
    }
    __name(ensureValidName, "ensureValidName");
    function modifyPeople(data, fn) {
      if (data.author)
        data.author = fn(data.author);
      [
        "maintainers",
        "contributors"
      ].forEach(function(set) {
        if (!Array.isArray(data[set]))
          return;
        data[set] = data[set].map(fn);
      });
      return data;
    }
    __name(modifyPeople, "modifyPeople");
    function unParsePerson(person) {
      if (typeof person === "string")
        return person;
      var name = person.name || "";
      var u = person.url || person.web;
      var url2 = u ? " (" + u + ")" : "";
      var e = person.email || person.mail;
      var email = e ? " <" + e + ">" : "";
      return name + email + url2;
    }
    __name(unParsePerson, "unParsePerson");
    function parsePerson(person) {
      if (typeof person !== "string")
        return person;
      var name = person.match(/^([^\(<]+)/);
      var url2 = person.match(/\(([^\)]+)\)/);
      var email = person.match(/<([^>]+)>/);
      var obj = {};
      if (name && name[0].trim())
        obj.name = name[0].trim();
      if (email)
        obj.email = email[1];
      if (url2)
        obj.url = url2[1];
      return obj;
    }
    __name(parsePerson, "parsePerson");
    function addOptionalDepsToDeps(data, warn) {
      var o = data.optionalDependencies;
      if (!o)
        return;
      var d = data.dependencies || {};
      Object.keys(o).forEach(function(k) {
        d[k] = o[k];
      });
      data.dependencies = d;
    }
    __name(addOptionalDepsToDeps, "addOptionalDepsToDeps");
    function depObjectify(deps, type, warn) {
      if (!deps)
        return {};
      if (typeof deps === "string") {
        deps = deps.trim().split(/[\n\r\s\t ,]+/);
      }
      if (!Array.isArray(deps))
        return deps;
      warn("deprecatedArrayDependencies", type);
      var o = {};
      deps.filter(function(d) {
        return typeof d === "string";
      }).forEach(function(d) {
        d = d.trim().split(/(:?[@\s><=])/);
        var dn = d.shift();
        var dv = d.join("");
        dv = dv.trim();
        dv = dv.replace(/^@/, "");
        o[dn] = dv;
      });
      return o;
    }
    __name(depObjectify, "depObjectify");
    function objectifyDeps(data, warn) {
      depTypes.forEach(function(type) {
        if (!data[type])
          return;
        data[type] = depObjectify(data[type], type, warn);
      });
    }
    __name(objectifyDeps, "objectifyDeps");
    function bugsTypos(bugs, warn) {
      if (!bugs)
        return;
      Object.keys(bugs).forEach(function(k) {
        if (typos.bugs[k]) {
          warn("typo", k, typos.bugs[k], "bugs");
          bugs[typos.bugs[k]] = bugs[k];
          delete bugs[k];
        }
      });
    }
    __name(bugsTypos, "bugsTypos");
  }
});

// node_modules/normalize-package-data/lib/warning_messages.json
var require_warning_messages = __commonJS({
  "node_modules/normalize-package-data/lib/warning_messages.json"(exports, module2) {
    module2.exports = {
      repositories: "'repositories' (plural) Not supported. Please pick one as the 'repository' field",
      missingRepository: "No repository field.",
      brokenGitUrl: "Probably broken git url: %s",
      nonObjectScripts: "scripts must be an object",
      nonStringScript: "script values must be string commands",
      nonArrayFiles: "Invalid 'files' member",
      invalidFilename: "Invalid filename in 'files' list: %s",
      nonArrayBundleDependencies: "Invalid 'bundleDependencies' list. Must be array of package names",
      nonStringBundleDependency: "Invalid bundleDependencies member: %s",
      nonDependencyBundleDependency: "Non-dependency in bundleDependencies: %s",
      nonObjectDependencies: "%s field must be an object",
      nonStringDependency: "Invalid dependency: %s %s",
      deprecatedArrayDependencies: "specifying %s as array is deprecated",
      deprecatedModules: "modules field is deprecated",
      nonArrayKeywords: "keywords should be an array of strings",
      nonStringKeyword: "keywords should be an array of strings",
      conflictingName: "%s is also the name of a node core module.",
      nonStringDescription: "'description' field should be a string",
      missingDescription: "No description",
      missingReadme: "No README data",
      missingLicense: "No license field.",
      nonEmailUrlBugsString: "Bug string field must be url, email, or {email,url}",
      nonUrlBugsUrlField: "bugs.url field must be a string url. Deleted.",
      nonEmailBugsEmailField: "bugs.email field must be a string email. Deleted.",
      emptyNormalizedBugs: "Normalized value of bugs field is an empty object. Deleted.",
      nonUrlHomepage: "homepage field must be a string url. Deleted.",
      invalidLicense: "license should be a valid SPDX license expression",
      typo: "%s should probably be %s."
    };
  }
});

// node_modules/normalize-package-data/lib/make_warning.js
var require_make_warning = __commonJS({
  "node_modules/normalize-package-data/lib/make_warning.js"(exports, module2) {
    var util = require("util");
    var messages = require_warning_messages();
    module2.exports = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      var warningName = args.shift();
      if (warningName == "typo") {
        return makeTypoWarning.apply(null, args);
      } else {
        var msgTemplate = messages[warningName] ? messages[warningName] : warningName + ": '%s'";
        args.unshift(msgTemplate);
        return util.format.apply(null, args);
      }
    };
    function makeTypoWarning(providedName, probableName, field) {
      if (field) {
        providedName = field + "['" + providedName + "']";
        probableName = field + "['" + probableName + "']";
      }
      return util.format(messages.typo, providedName, probableName);
    }
    __name(makeTypoWarning, "makeTypoWarning");
  }
});

// node_modules/normalize-package-data/lib/normalize.js
var require_normalize = __commonJS({
  "node_modules/normalize-package-data/lib/normalize.js"(exports, module2) {
    module2.exports = normalize;
    var fixer = require_fixer();
    normalize.fixer = fixer;
    var makeWarning = require_make_warning();
    var fieldsToFix = [
      "name",
      "version",
      "description",
      "repository",
      "modules",
      "scripts",
      "files",
      "bin",
      "man",
      "bugs",
      "keywords",
      "readme",
      "homepage",
      "license"
    ];
    var otherThingsToFix = [
      "dependencies",
      "people",
      "typos"
    ];
    var thingsToFix = fieldsToFix.map(function(fieldName) {
      return ucFirst(fieldName) + "Field";
    });
    thingsToFix = thingsToFix.concat(otherThingsToFix);
    function normalize(data, warn, strict) {
      if (warn === true)
        warn = null, strict = true;
      if (!strict)
        strict = false;
      if (!warn || data.private)
        warn = /* @__PURE__ */ __name(function(msg) {
        }, "warn");
      if (data.scripts && data.scripts.install === "node-gyp rebuild" && !data.scripts.preinstall) {
        data.gypfile = true;
      }
      fixer.warn = function() {
        warn(makeWarning.apply(null, arguments));
      };
      thingsToFix.forEach(function(thingName) {
        fixer["fix" + ucFirst(thingName)](data, strict);
      });
      data._id = data.name + "@" + data.version;
    }
    __name(normalize, "normalize");
    function ucFirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    __name(ucFirst, "ucFirst");
  }
});

// node_modules/read-pkg/index.js
var require_read_pkg = __commonJS({
  "node_modules/read-pkg/index.js"(exports, module2) {
    "use strict";
    var { promisify } = require("util");
    var fs = require("fs");
    var path = require("path");
    var parseJson = require_parse_json();
    var readFileAsync = promisify(fs.readFile);
    module2.exports = (options) => __async(exports, null, function* () {
      options = __spreadValues({
        cwd: process.cwd(),
        normalize: true
      }, options);
      const filePath = path.resolve(options.cwd, "package.json");
      const json = parseJson(yield readFileAsync(filePath, "utf8"));
      if (options.normalize) {
        require_normalize()(json);
      }
      return json;
    });
    module2.exports.sync = (options) => {
      options = __spreadValues({
        cwd: process.cwd(),
        normalize: true
      }, options);
      const filePath = path.resolve(options.cwd, "package.json");
      const json = parseJson(fs.readFileSync(filePath, "utf8"));
      if (options.normalize) {
        require_normalize()(json);
      }
      return json;
    };
  }
});

// node_modules/read-pkg-up/index.js
var require_read_pkg_up = __commonJS({
  "node_modules/read-pkg-up/index.js"(exports, module2) {
    "use strict";
    var path = require("path");
    var findUp = require_find_up();
    var readPkg = require_read_pkg();
    module2.exports = (options) => __async(exports, null, function* () {
      const filePath = yield findUp("package.json", options);
      if (!filePath) {
        return;
      }
      return {
        packageJson: yield readPkg(__spreadProps(__spreadValues({}, options), {
          cwd: path.dirname(filePath)
        })),
        path: filePath
      };
    });
    module2.exports.sync = (options) => {
      const filePath = findUp.sync("package.json", options);
      if (!filePath) {
        return;
      }
      return {
        packageJson: readPkg.sync(__spreadProps(__spreadValues({}, options), {
          cwd: path.dirname(filePath)
        })),
        path: filePath
      };
    };
  }
});

// src/setup-page.ts
var setup_page_exports = {};
__export(setup_page_exports, {
  setupPage: () => setupPage
});
module.exports = __toCommonJS(setup_page_exports);
var import_read_pkg_up = __toESM(require_read_pkg_up());
var sanitizeURL = /* @__PURE__ */ __name((url) => {
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
}, "sanitizeURL");
var setupPage = /* @__PURE__ */ __name((page) => __async(void 0, null, function* () {
  const targetURL = new URL("iframe.html", process.env.TARGET_URL).toString();
  const viewMode = process.env.VIEW_MODE || "story";
  const renderedEvent = viewMode === "docs" ? "docsRendered" : "storyRendered";
  const { packageJson } = yield (0, import_read_pkg_up.default)();
  const { version: testRunnerVersion } = packageJson;
  const referenceURL = process.env.REFERENCE_URL && sanitizeURL(process.env.REFERENCE_URL);
  const debugPrintLimit = process.env.DEBUG_PRINT_LIMIT ? Number(process.env.DEBUG_PRINT_LIMIT) : 1e3;
  if ("TARGET_URL" in process.env && !process.env.TARGET_URL) {
    console.log(`Received TARGET_URL but with a falsy value: ${process.env.TARGET_URL}, will fallback to ${targetURL} instead.`);
  }
  yield page.goto(targetURL, {
    waitUntil: "load"
  }).catch((err) => {
    var _a;
    if ((_a = err.message) == null ? void 0 : _a.includes("ERR_CONNECTION_REFUSED")) {
      const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?

${err.message}`;
      throw new Error(errorMessage);
    }
    throw err;
  });
  yield page.exposeBinding("logToPage", (_, message) => console.log(message));
  yield page.addScriptTag({
    content: `
      // colorizes the console output
      const bold = (message) => \`\\u001b[1m\${message}\\u001b[22m\`;
      const magenta = (message) => \`\\u001b[35m\${message}\\u001b[39m\`;
      const blue = (message) => \`\\u001b[34m\${message}\\u001b[39m\`;
      const red = (message) => \`\\u001b[31m\${message}\\u001b[39m\`;
      const yellow = (message) => \`\\u001b[33m\${message}\\u001b[39m\`;
      
      // removes circular references from the object
      function serializer(replacer, cycleReplacer) {
        let stack = [],
          keys = [];

        if (cycleReplacer == null)
          cycleReplacer = function (_key, value) {
            if (stack[0] === value) return '[Circular]';
            return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
          };

        return function (key, value) {
          if (stack.length > 0) {
            let thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
          } else {
            stack.push(value);
          }

          return replacer == null ? value : replacer.call(this, key, value);
        };
      }

      function safeStringify(obj, replacer, spaces, cycleReplacer) {
        return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
      }

      function composeMessage(args) {
        if (typeof args === 'undefined') return "undefined";
        if (typeof args === 'string') return args;
        return safeStringify(args);
      }

      function truncate(input, limit) {
        if (input.length > limit) {
          return input.substring(0, limit) + '\u2026';
        }
        return input;
      }
      
      function addToUserAgent(extra) {
        const originalUserAgent = globalThis.navigator.userAgent;
        if (!originalUserAgent.includes(extra)) {
          Object.defineProperty(globalThis.navigator, 'userAgent', {
            get: function () {
              return [originalUserAgent, extra].join(' ');
            },
          });
        }
      };

      class StorybookTestRunnerError extends Error {
        constructor(storyId, errorMessage, logs = []) {
          super(errorMessage);
          this.name = 'StorybookTestRunnerError';
          const storyUrl = \`${referenceURL || targetURL}?path=/story/\${storyId}\`;
          const finalStoryUrl = \`\${storyUrl}&addonPanel=storybook/interactions/panel\`;
          const separator = '\\n\\n--------------------------------------------------';
          const extraLogs = logs.length > 0 ? separator + "\\n\\nBrowser logs:\\n\\n"+ logs.join('\\n\\n') : '';

          this.message = \`
An error occurred in the following story. Access the link for full output:
\${finalStoryUrl}

Message:
 \${truncate(errorMessage,${debugPrintLimit})}
\${extraLogs}\`;
        }
      }

      async function __throwError(storyId, errorMessage, logs) {
        throw new StorybookTestRunnerError(storyId, errorMessage, logs);
      }

      async function __waitForStorybook() {
        return new Promise((resolve, reject) => {

          const timeout = setTimeout(() => {
            reject();
          }, 10000);

          if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
            clearTimeout(timeout);
            return resolve();
          }

          const observer = new MutationObserver(mutations => {
            if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
              clearTimeout(timeout);
              resolve();
              observer.disconnect();
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      }

      async function __getContext(storyId) {
        return globalThis.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId });
      }

      async function __test(storyId) {
        try {
          await __waitForStorybook();
        } catch(err) {
          const message = \`Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL? Is the Storybook private (e.g. under authentication layers)?


HTML: \${document.body.innerHTML}\`;
          throw new StorybookTestRunnerError(storyId, message);
        }

        const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
        if(!channel) {
          throw new StorybookTestRunnerError(
            storyId,
            'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'
          );
        }
        
        addToUserAgent(\`(StorybookTestRunner@${testRunnerVersion})\`);

        // collect logs to show upon test error
        let logs = [];

        const spyOnConsole = (method, name) => {
          const originalFn = console[method];
          return function () {
            const message = [...arguments].map(composeMessage).join(', ');
            const prefix = \`\${bold(name)}: \`;
            logs.push(prefix + message);
            originalFn.apply(console, arguments);
          };
        };

        // console methods + color function for their prefix
        const spiedMethods = {
          log: blue,
          warn: yellow,
          error: red,
          trace: magenta,
          group: magenta,
          groupCollapsed: magenta,
        }
        
        Object.entries(spiedMethods).forEach(([method, color]) => {
          console[method] = spyOnConsole(method, color(method))
        })

        return new Promise((resolve, reject) => {
          channel.on('${renderedEvent}', () => resolve(document.getElementById('root')));
          channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
          channel.on('storyErrored', ({ description }) => reject(
            new StorybookTestRunnerError(storyId, description, logs))
          );
          channel.on('storyThrewException', (error) => reject(
            new StorybookTestRunnerError(storyId, error.message, logs))
          );
          channel.on('playFunctionThrewException', (error) => reject(
            new StorybookTestRunnerError(storyId, error.message, logs))
          );
          channel.on('storyMissing', (id) => id === storyId && reject(
            new StorybookTestRunnerError(storyId, 'The story was missing when trying to access it.', logs))
          );

          channel.emit('setCurrentStory', { storyId, viewMode: '${viewMode}' });
        });
      };
    `
  });
}), "setupPage");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setupPage
});
