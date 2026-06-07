import { tonalSteps } from "../data/paletteData.js";

export function createPalette(name, hue, saturation) {
  const steps = tonalSteps.map(({ step, lightness, usage }) => {
    const rgb = hslToRgb(hue, saturation, lightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const luminance = relativeLuminance(rgb.r, rgb.g, rgb.b);
    const contrastWhite = contrastRatio(luminance, 1);
    const contrastBlack = contrastRatio(luminance, 0);

    return {
      step,
      lightness,
      hex,
      rgb,
      hsl: { h: hue, s: saturation, l: lightness },
      contrastWhite: Math.round(contrastWhite * 100) / 100,
      contrastBlack: Math.round(contrastBlack * 100) / 100,
      usage,
    };
  });

  return {
    id: `${slugify(name)}-${Date.now()}`,
    name,
    hue,
    saturation,
    steps,
  };
}

export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
}

export function normalizeHex(hex) {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : "#3b82f6";
}

export function isWcagAa(ratio) {
  return ratio >= 4.5;
}

export function isWcagAaa(ratio) {
  return ratio >= 7;
}

export function exportContent(format, palettes) {
  if (format === "scss") return scssExport(palettes);
  if (format === "json") return jsonExport(palettes);
  return cssExport(palettes);
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = lightness - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue >= 0 && hue < 60) [r, g, b] = [chroma, x, 0];
  else if (hue >= 60 && hue < 120) [r, g, b] = [x, chroma, 0];
  else if (hue >= 120 && hue < 180) [r, g, b] = [0, chroma, x];
  else if (hue >= 180 && hue < 240) [r, g, b] = [0, x, chroma];
  else if (hue >= 240 && hue < 300) [r, g, b] = [x, 0, chroma];
  else if (hue >= 300 && hue < 360) [r, g, b] = [chroma, 0, x];

  return {
    r: Math.round((r + match) * 255),
    g: Math.round((g + match) * 255),
    b: Math.round((b + match) * 255),
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join("")}`;
}

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  return {
    r: Number.parseInt(match[1], 16),
    g: Number.parseInt(match[2], 16),
    b: Number.parseInt(match[3], 16),
  };
}

function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue /= 6;
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100) / 100,
    l: Math.round(lightness * 100) / 100,
  };
}

function relativeLuminance(r, g, b) {
  const [red, green, blue] = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(a, b) {
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function cssExport(palettes) {
  let output = ":root {\n";
  palettes.forEach((palette) => {
    output += `  /* ${palette.name} */\n`;
    palette.steps.forEach((color) => {
      output += `  --${slugify(palette.name)}-${color.step}: ${color.hex};\n`;
    });
    output += "\n";
  });
  output += "}";
  return output;
}

function scssExport(palettes) {
  let output = "";
  palettes.forEach((palette) => {
    output += `// ${palette.name}\n`;
    palette.steps.forEach((color) => {
      output += `$${slugify(palette.name)}-${color.step}: ${color.hex};\n`;
    });
    output += "\n";
  });
  return output;
}

function jsonExport(palettes) {
  return JSON.stringify(
    palettes.map((palette) => ({
      name: palette.name,
      hue: palette.hue,
      saturation: palette.saturation,
      colors: palette.steps.map((color) => ({
        step: color.step,
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        contrast: {
          white: color.contrastWhite,
          black: color.contrastBlack,
        },
        usage: color.usage,
        accessibility: {
          wcagAA:
            isWcagAa(color.contrastWhite) || isWcagAa(color.contrastBlack),
          wcagAAA:
            isWcagAaa(color.contrastWhite) || isWcagAaa(color.contrastBlack),
        },
      })),
    })),
    null,
    2,
  );
}

function slugify(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
