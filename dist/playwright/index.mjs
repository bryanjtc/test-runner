import {
  transformPlaywright
} from "../chunk-TFZNTRD5.mjs";
import "../chunk-EJBUYBQQ.mjs";
import "../chunk-GF2YUQZN.mjs";
import "../chunk-DZYMMINJ.mjs";
import "../chunk-XHBBCDN7.mjs";
import "../chunk-Z7JFROLK.mjs";
import "../chunk-VFZNZQRC.mjs";
import "../chunk-UOPJUKPN.mjs";
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
