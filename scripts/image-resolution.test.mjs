import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const core = vm.runInNewContext(readFileSync(new URL("../editor-core.js", import.meta.url), "utf8") + "; EditorCore");

test("quality warning considers cover crop and the actual destination", () => {
  assert.equal(core.imageResolution(2160, 2700, 1080, 1350).low, false);
  assert.equal(core.imageResolution(1920, 1080, 1080, 1350).low, false);
  assert.equal(core.imageResolution(1920, 1080, 1080, 1920).low, true);
  assert.equal(core.imageResolution(800, 600, 862, 488).low, false);
  assert.equal(core.imageResolution(192, 192, 862, 488).low, true);
  assert.equal(core.imageResolution(600, 750, 510, 637.5).low, false);
});
