# Type Scale

Type Scale is a typography system tool for creating, previewing, and exporting
responsive type scales. It includes controls for font families, scale ratios,
fluid typography, line height, letter spacing, semantic names, and export
formats for design and development workflows.

## Features

- Generate modular type scales from a base size and scale ratio.
- Preview static and fluid typography across viewport ranges.
- Protect smaller text sizes when large ratios would make them too small.
- Customize line height, letter spacing, semantic names, and preview text.
- Export typography tokens for CSS, SCSS, JSON, iOS, Android, Flutter, React
  Native, and Figma.
- Includes additional generators for color palettes, border radius, shadows,
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

Google Fonts are intentionally loaded from Google-hosted URLs. SEO metadata
currently points to `https://typescale.com/`; that URL can be replaced when the
new production address is ready.
