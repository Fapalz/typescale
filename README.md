# Type Scale

Use the tool here: [Type Scale](https://fapalz.github.io/typescale/)

Type Scale is a browser-based toolkit for building practical design-system
tokens. It helps designers and developers create typography scales, preview how
they behave across real layouts, and export the result for web, mobile, and
design-tool workflows.

The main tool focuses on type scale generation: choose a font family, base size,
scale ratio, units, line height, letter spacing, semantic names, and fluid
typography strategy. The app also includes supporting generators for color
palettes, nested border radius, shadows, and icon sizing.

## Features

- Build modular type scales from a base size and ratio.
- Generate responsive `clamp()` values with centered, mobile-first, and
  desktop-first fluid strategies.
- Protect small text sizes when large ratios would make captions too small.
- Preview typography in device views and real-world page templates.
- Edit semantic token names and export production-ready typography tokens.
- Export CSS, SCSS, JSON, iOS Swift, Android Kotlin, Flutter Dart, React Native,
  Design Tokens, Figma, and CLI config formats.
- Create supporting tokens for color palettes, nested border radius, shadows,
  and icon sizes.

## Development

Install dependencies:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Build the production bundle:

```sh
npm run build
```

The Vite build is written to `dist/`.

## Project Structure

- `src/` - React source, styles, data, and utility functions.
- `src/index.html` - Vite HTML entry file with metadata.
- `src/tools/` - Main tool screens and modals.
- `src/components/` - Shared UI components.
