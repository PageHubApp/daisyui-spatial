import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const cssPath = resolve(process.cwd(), "src/index.css");
const css = readFileSync(cssPath, "utf8");

function expect(pattern, message) {
  assert.match(css, pattern, message);
}

test("defines spatial token bridge in @theme inline", () => {
  expect(/@theme\s+inline\s*{/, "missing @theme inline block");
  expect(/--spacing-space-xs:\s*var\(--space-xs\);/, "missing --spacing-space-xs bridge");
  expect(/--spacing-space-sm:\s*var\(--space-sm\);/, "missing --spacing-space-sm bridge");
  expect(/--spacing-space-md:\s*var\(--space-md\);/, "missing --spacing-space-md bridge");
  expect(/--spacing-space-lg:\s*var\(--space-lg\);/, "missing --spacing-space-lg bridge");
  expect(/--spacing-space-xl:\s*var\(--space-xl\);/, "missing --spacing-space-xl bridge");
  expect(/--spacing-container-x:\s*var\(--container-padding-x\);/, "missing --spacing-container-x bridge");
  expect(/--spacing-container-y:\s*var\(--container-padding-y\);/, "missing --spacing-container-y bridge");
  expect(/--spacing-section:\s*var\(--section-gap\);/, "missing --spacing-section bridge");
  expect(/--spacing-container:\s*var\(--container-gap\);/, "missing --spacing-container bridge");
  expect(/--max-width-page:\s*var\(--content-width\);/, "missing --max-width-page bridge");
});

test("defines density-scaled root spacing vars", () => {
  expect(/:root\s*{[\s\S]*--spacing-density:\s*1;/, "missing --spacing-density default");

  const names = ["xs", "sm", "md", "lg", "xl"];
  for (const size of names) {
    expect(
      new RegExp(`--space-${size}:\\s*calc\\(clamp\\([^)]+\\)\\s*\\*\\s*var\\(--spacing-density\\)\\);`),
      `missing density-scaled --space-${size} clamp token`,
    );
  }
});

test("covers key DaisyUI selectors with spatial values", () => {
  const selectorPatterns = [
    /\.btn\s*{[\s\S]*?}/,
    /\.card-body\s*{[\s\S]*?}/,
    /\.hero-content\s*{[\s\S]*?}/,
    /\.navbar\s*{[\s\S]*?}/,
    /\.footer\s*{[\s\S]*?}/,
    /\.input,\s*[\r\n]+\s*\.select\s*{[\s\S]*?}/,
    /\.textarea\s*{[\s\S]*?}/,
    /\.alert\s*{[\s\S]*?}/,
    /\.modal-box\s*{[\s\S]*?}/,
    /\.menu\s*{[\s\S]*?}/,
    /\.tabs\s*{[\s\S]*?}/,
    /\.toast\s*{[\s\S]*?}/,
    /\.progress\s*{[\s\S]*?}/,
  ];

  for (const pattern of selectorPatterns) {
    expect(pattern, `missing selector override for pattern: ${pattern}`);
  }
});

test("uses spatial variables throughout overrides", () => {
  const varUsages = (css.match(/var\(--space-[a-z-]+\)/g) || []).length;
  assert.ok(varUsages >= 25, `expected at least 25 spatial var usages, found ${varUsages}`);

  const densityUsages = (css.match(/var\(--spacing-density\)/g) || []).length;
  assert.ok(densityUsages >= 8, `expected at least 8 density usages, found ${densityUsages}`);
});
