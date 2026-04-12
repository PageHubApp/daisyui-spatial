# @pagehub/daisyui-spatial

Density-scaled spatial tokens for DaisyUI 5.

This package provides:
- Fluid spacing tokens (`--space-xs` → `--space-xl`) driven by viewport width.
- A single global density control (`--spacing-density`) to tighten or loosen UI rhythm.
- DaisyUI component spacing overrides mapped to those tokens.

## Install

```bash
npm install @pagehub/daisyui-spatial
```

Peer dependency:
- `daisyui >= 5.0.0`

## Usage

Import DaisyUI first, then spatial:

```css
@import "daisyui";
@import "@pagehub/daisyui-spatial";
```

Set density globally:

```css
:root {
  --spacing-density: 1;   /* default */
}
```

Suggested ranges:
- `0.25` minimal
- `1` default
- `2.5` ultra-spacious

## Token Utilities

The package exports `@theme inline` tokens that map to utility classes:
- `py-space-xl`, `gap-space-md`, `px-space-sm`
- `px-container-x`, `gap-section`, `gap-container`
- `rounded-box`, `rounded-field`, `rounded-selector`

## Required Host Variables

For best results, define these variables in your host theme/system:
- `--container-padding-x`
- `--container-padding-y`
- `--section-gap`
- `--container-gap`
- `--content-width`
- `--radius-box`
- `--radius-field`
- `--radius-selector`

If these are missing, classes that rely on them may collapse to empty computed values.

## What Gets Overridden

The stylesheet remaps spacing on common DaisyUI primitives, including:
- `btn`, `card-body`, `hero-content`, `navbar`, `footer`
- `input`, `select`, `textarea`, `alert`, `modal-box`
- `menu`, `tabs`, `toast`, `progress`, `chat-bubble`, and more

All overrides are designed to scale with `--spacing-density`.

## Development

Run package tests:

```bash
pnpm --filter @pagehub/daisyui-spatial test
```

These tests verify token presence, density scaling contract, and key selector coverage.
