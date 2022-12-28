import {
  transformPlaywright
} from "../chunk-M6FZVPDI.mjs";
import "../chunk-EJBUYBQQ.mjs";
import "../chunk-WVWPZALW.mjs";
import "../chunk-7P5FXBEF.mjs";
import "../chunk-XHBBCDN7.mjs";
import "../chunk-Z7JFROLK.mjs";
import "../chunk-VFZNZQRC.mjs";
import "../chunk-RYEG5IZ6.mjs";
import "../chunk-VZ65GJNG.mjs";
import "../chunk-2M227QDY.mjs";
import {
  __name
} from "../chunk-AIG2NDDY.mjs";

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
