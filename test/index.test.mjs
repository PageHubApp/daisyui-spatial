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

// Every override carries the `[data-daisyui="off"]` opt-out guard.
const OFF = String.raw`:where\(:not\(\[data-daisyui="off"\] \*\)\)`;

test("covers key DaisyUI selectors with spatial values, each behind the data-daisyui=off opt-out", () => {
  const selectors = ["btn", "card-body", "hero-content", "navbar", "footer", "textarea", "alert", "modal-box", "menu", "tabs", "toast", "progress"];
  for (const name of selectors) {
    expect(new RegExp(String.raw`\.${name}${OFF}\s*{[\s\S]*?}`), `missing selector override for .${name}`);
  }
  expect(new RegExp(String.raw`\.input${OFF},\s*[\r\n]+\s*\.select${OFF}\s*{`), "missing .input, .select override");
});

test("uses spatial variables throughout overrides", () => {
  const varUsages = (css.match(/var\(--space-[a-z-]+\)/g) || []).length;
  assert.ok(varUsages >= 25, `expected at least 25 spatial var usages, found ${varUsages}`);

  const densityUsages = (css.match(/var\(--spacing-density\)/g) || []).length;
  assert.ok(densityUsages >= 8, `expected at least 8 density usages, found ${densityUsages}`);
});
