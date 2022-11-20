import {
  transformPlaywright
} from "../chunk-7PHEBI6W.mjs";
import "../chunk-EJBUYBQQ.mjs";
import "../chunk-3PCGZATC.mjs";
import "../chunk-TR4TBT53.mjs";
import "../chunk-BDLBAL3M.mjs";
import "../chunk-BZ454Q7N.mjs";
import "../chunk-X55CJN5W.mjs";
import "../chunk-6J2TR5JU.mjs";
import "../chunk-JVSXUXAE.mjs";
import "../chunk-ICZWPBDQ.mjs";
import {
  __name
} from "../chunk-2RV4EXUL.mjs";

// src/playwright/index.ts
import { transformSync as swcTransform } from "@swc/core";
var process = /* @__PURE__ */ __name((src, filename, config) => {
  const csfTest = transformPlaywright(src, filename);
  const result = swcTransform(csfTest, {
    filename,
    module: {
      type: "commonjs"
    }
  });
  return result ? result.code : src;
}, "process");
export {
  process
};
