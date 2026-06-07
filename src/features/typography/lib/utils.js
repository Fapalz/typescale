import { typeTokens } from "../data/data.js";

export function calculateTypeScale(settings) {
  const baseTokens = typeTokens.map((token) => buildToken(token, settings));
  const allTokens = [...baseTokens, ...(settings.customSizes ?? [])].sort(
    (a, b) => b.step - a.step,
  );

  const scale = allTokens.map((token) => {
    if (token.fontSize) return buildCustomToken(token, settings);
    return buildToken(token, settings);
  });

  return applySmallTextProtection(scale, settings);
}

export function recalculateCustomTypeScale(scale, settings) {
  const bodyIndex = scale.findIndex((item) => item.id === "body");
  if (bodyIndex === -1) return calculateTypeScale(settings);

  const recalculated = scale.map((item, index) => {
    const relativeStep = (bodyIndex - index) * 0.5;
    const rawSize = settings.baseFontSize * settings.scaleRatio ** relativeStep;
    const fontSize = settings.roundValues
      ? Math.round(rawSize)
      : Number(rawSize.toFixed(2));
    const fluid = settings.fluidTypography
      ? calculateClamp(relativeStep, settings)
      : null;

    return {
      ...item,
      fontSize,
      lineHeight: resolveLineHeight(settings, fontSize),
      letterSpacing: resolveLetterSpacing(settings, fontSize),
      fontFamily: settings.fontFamily,
      clampValue: fluid?.clampValue,
      minFontSize: fluid?.minFontSize,
      maxFontSize: fluid?.maxFontSize,
    };
  });

  return applySmallTextProtection(recalculated, settings);
}

export function insertTypeScaleSize(scale, targetId, position, settings) {
  const index = scale.findIndex((item) => item.id === targetId);
  if (index === -1) return { scale, newId: "" };

  let nextScale;
  let newSize;
  let newWeight;
  const newId = createCustomSizeId(scale[index], position);

  if (position === "above") {
    newSize = scale[index].fontSize * settings.scaleRatio;
    newWeight = newSize >= 48 ? 800 : newSize >= 24 ? 700 : 600;
    nextScale = [
      ...scale.slice(0, index),
      createInsertedToken(newId, newSize, newWeight),
      ...scale.slice(index),
    ];
  } else if (position === "below") {
    newSize = scale[index].fontSize / settings.scaleRatio;
    newWeight = newSize >= 24 ? 600 : newSize >= 16 ? 500 : 400;
    nextScale = [
      ...scale.slice(0, index + 1),
      createInsertedToken(newId, newSize, newWeight),
      ...scale.slice(index + 1),
    ];
  } else {
    const next = scale[index + 1];
    if (!next) return { scale, newId: "" };
    newSize = Math.sqrt(scale[index].fontSize * next.fontSize);
    newWeight = newSize >= 24 ? 600 : newSize >= 16 ? 500 : 400;
    nextScale = [
      ...scale.slice(0, index + 1),
      createInsertedToken(newId, newSize, newWeight),
      ...scale.slice(index + 1),
    ];
  }

  return { scale: nextScale, newId };
}

export function removeCustomTypeSize(scale, id) {
  if (typeTokens.some((token) => token.id === id)) return scale;
  return scale.filter((item) => item.id !== id);
}

function buildToken(token, settings) {
  const rawSize = settings.baseFontSize * settings.scaleRatio ** token.step;
  const fontSize = settings.roundValues
    ? Math.round(rawSize)
    : Number(rawSize.toFixed(2));
  const fluid = settings.fluidTypography
    ? calculateClamp(token.step, settings)
    : null;

  return {
    ...token,
    fontSize,
    lineHeight: resolveLineHeight(settings, fontSize),
    letterSpacing: resolveLetterSpacing(settings, fontSize),
    fontFamily: settings.fontFamily,
    clampValue: fluid?.clampValue,
    minFontSize: fluid?.minFontSize,
    maxFontSize: fluid?.maxFontSize,
  };
}

function createInsertedToken(id, fontSize, weight) {
  return {
    id,
    label: labelForCustomSize(id),
    fontSize,
    weight,
    isCustom: true,
  };
}

function createCustomSizeId(target, position) {
  const suffix = Date.now().toString().slice(-4);
  if (position === "above") {
    if (target.id.startsWith("display")) return `display-xl-${suffix}`;
    if (target.id.startsWith("h")) {
      const level = Number(target.id.replace("h", ""));
      return level > 1 ? `h${level - 1}-alt-${suffix}` : `display-sm-${suffix}`;
    }
    return target.id.startsWith("body")
      ? `h4-alt-${suffix}`
      : `body-lg-${suffix}`;
  }

  if (position === "below") {
    if (target.id.startsWith("h")) {
      const level = Number(target.id.replace("h", ""));
      return level < 6 ? `h${level + 1}-alt-${suffix}` : `caption-xl-${suffix}`;
    }
    if (target.id.startsWith("body")) return `body-xs-${suffix}`;
    if (target.id.startsWith("caption")) return `caption-xs-${suffix}`;
    return `micro-${suffix}`;
  }

  return `custom-${suffix}`;
}

function labelForCustomSize(id) {
  if (id.includes("display-xl")) return "Display XL";
  if (id.includes("display-sm")) return "Display Small";
  if (id.includes("h1-alt")) return "H1 Alternative";
  if (id.includes("h2-alt")) return "H2 Alternative";
  if (id.includes("h3-alt")) return "H3 Alternative";
  if (id.includes("h4-alt")) return "H4 Alternative";
  if (id.includes("h5-alt")) return "H5 Alternative";
  if (id.includes("h6-alt")) return "H6 Alternative";
  if (id.includes("body-lg")) return "Body Large Alt";
  if (id.includes("body-xs")) return "Body XS";
  if (id.includes("caption-xl")) return "Caption XL";
  if (id.includes("caption-xs")) return "Caption XS";
  if (id.includes("micro")) return "Micro Text";
  return "Custom Size";
}

function buildCustomToken(token, settings) {
  const fluid = settings.fluidTypography
    ? calculateClamp(token.step ?? 0, settings)
    : null;

  return {
    ...token,
    lineHeight: resolveLineHeight(settings, token.fontSize),
    letterSpacing: resolveLetterSpacing(settings, token.fontSize),
    fontFamily: settings.fontFamily,
    clampValue: fluid?.clampValue,
    minFontSize: fluid?.minFontSize,
    maxFontSize: fluid?.maxFontSize,
  };
}

export function resolveLineHeight(settings, fontSize = settings.baseFontSize) {
  if (settings.lineHeightPreset === "tight") return 1.2;
  if (settings.lineHeightPreset === "relaxed") return 1.75;
  if (settings.lineHeightPreset === "custom") return settings.customLineHeight;
  if (fontSize >= 48) return 1.5;
  if (fontSize >= 24) return 1.55;
  if (fontSize >= 16) return 1.6;
  return 1.65;
}

export function resolveLetterSpacing(
  settings,
  fontSize = settings.baseFontSize,
) {
  if (settings.letterSpacingPreset === "tight") return -0.015;
  if (settings.letterSpacingPreset === "loose") return 0.05;
  if (settings.letterSpacingPreset === "custom")
    return settings.customLetterSpacing;
  const opticalMinimum = 0.12 / fontSize;
  if (fontSize >= 96) return Math.max(opticalMinimum, 0.005);
  if (fontSize >= 60) return Math.max(opticalMinimum, 0.008);
  if (fontSize >= 48) return Math.max(opticalMinimum, 0.01);
  if (fontSize >= 34) return Math.max(opticalMinimum, 0.015);
  if (fontSize >= 24) return Math.max(opticalMinimum, 0.02);
  if (fontSize >= 20) return Math.max(opticalMinimum, 0.025);
  return Math.max(opticalMinimum, 0.03);
}

export function formatSize(value, unit = "px", baseFontSize = 16) {
  if (unit === "rem") return `${trimNumber(value / baseFontSize)}rem`;
  if (unit === "pt") return `${trimNumber(value * 0.75)}pt`;
  return `${trimNumber(value)}px`;
}

export function exportTypeScale(typeScale, settings, format) {
  if (format === "css") {
    return `${settings.fluidTypography ? "/* Fluid Typography with CSS clamp() */\n" : ""}:root {\n  /* Font Family */\n  --font-family: ${settings.fontFamily};\n\n  /* Type Scale */\n${typeScale
      .map(
        (item) =>
          `  --font-size-${item.id}: ${
            settings.fluidTypography && item.clampValue
              ? item.clampValue
              : formatSize(item.fontSize, settings.unit, settings.baseFontSize)
          };\n  --line-height-${item.id}: ${item.lineHeight};\n  --letter-spacing-${item.id}: ${item.letterSpacing}em;\n  --font-weight-${item.id}: ${item.weight};`,
      )
      .join("\n")}\n}`;
  }
  if (format === "scss") {
    return `${settings.fluidTypography ? "// Fluid Typography with CSS clamp()\n" : ""}// Font Family\n$font-family: ${settings.fontFamily};\n\n// Type Scale\n${typeScale
      .map(
        (item) =>
          `$font-size-${item.id}: ${
            settings.fluidTypography && item.clampValue
              ? item.clampValue
              : formatSize(item.fontSize, settings.unit, settings.baseFontSize)
          };\n$line-height-${item.id}: ${item.lineHeight};\n$letter-spacing-${item.id}: ${item.letterSpacing}em;\n$font-weight-${item.id}: ${item.weight};`,
      )
      .join("\n")}`;
  }
  if (format === "ios") return exportIos(typeScale, settings);
  if (format === "android") return exportAndroid(typeScale, settings);
  if (format === "flutter") return exportFlutter(typeScale, settings);
  if (format === "react-native") return exportReactNative(typeScale, settings);
  if (format === "figma") return exportFigma(typeScale, settings);
  return JSON.stringify(
    {
      name: "Type Scale",
      baseFontSize: settings.baseFontSize,
      scaleRatio: settings.scaleRatio,
      fontFamily: settings.fontFamily,
      unit: settings.unit,
      fluidTypography: settings.fluidTypography,
      tokens: typeScale.map((item) => tokenExport(item, settings)),
    },
    null,
    2,
  );
}

export function getPreviewText(settings, item) {
  const selected = settings.previewText;
  if (settings.previewMode === "multiple") {
    return previewForToken(item);
  }
  if (selected === "custom") return settings.customPreviewText || "";
  return (
    settings.previewTextContent ||
    "The quick brown fox jumps over the lazy dog."
  );
}

export function calculateClamp(step, settings) {
  const { minRatio, maxRatio } = getFluidScaleRatios(settings);
  const minFontSize = roundBySetting(
    settings.baseFontSize * minRatio ** step,
    settings.roundValues,
  );
  const maxFontSize = roundBySetting(
    settings.baseFontSize * maxRatio ** step,
    settings.roundValues,
  );
  const minViewport = settings.minViewport;
  const maxViewport = settings.maxViewport;
  const unit = settings.unit ?? "px";
  const minClampSize = toUnitNumber(minFontSize, unit, settings.baseFontSize);
  const maxClampSize = toUnitNumber(maxFontSize, unit, settings.baseFontSize);
  const slope = (maxClampSize - minClampSize) / (maxViewport - minViewport);
  const preferred = round(slope * 100);
  const intercept = round(minClampSize - slope * minViewport);

  return {
    minFontSize,
    maxFontSize,
    clampValue: `clamp(${formatUnitNumber(minClampSize, unit)}, calc(${formatUnitNumber(intercept, unit)} + ${preferred}vw), ${formatUnitNumber(maxClampSize, unit)})`,
  };
}

export function getFluidScaleRatios(settings) {
  const baseRatio = Number(settings.scaleRatio) || 1.25;
  const variation = Number(settings.fluidVariation) || 0;
  const strategy = settings.fluidScaleStrategy || "centered";
  let minRatio = baseRatio - variation;
  let maxRatio = baseRatio + variation;

  if (strategy === "mobile-first") {
    minRatio = baseRatio;
    maxRatio = baseRatio + variation;
  } else if (strategy === "desktop-first") {
    minRatio = baseRatio - variation;
    maxRatio = baseRatio;
  }

  minRatio = clampRatio(minRatio);
  maxRatio = clampRatio(maxRatio);

  return {
    minRatio: Math.min(minRatio, maxRatio),
    baseRatio,
    maxRatio: Math.max(minRatio, maxRatio),
    tabletRatio: (minRatio + maxRatio) / 2,
    strategy,
    variation,
  };
}

export function fluidSizeAtViewport(item, settings, viewport) {
  if (!item.minFontSize || !item.maxFontSize) return item.fontSize;
  const minViewport = Number(settings.minViewport) || 320;
  const maxViewport = Number(settings.maxViewport) || 1200;
  const progress = Math.min(
    1,
    Math.max(
      0,
      (viewport - minViewport) / Math.max(1, maxViewport - minViewport),
    ),
  );
  return item.minFontSize + (item.maxFontSize - item.minFontSize) * progress;
}

function applySmallTextProtection(scale, settings) {
  if (!settings.protectSmallText) return scale;

  const bodyIndex = scale.findIndex((item) => item.id === "body");
  if (bodyIndex === -1) return scale;

  const protectedScale = scale.map((item) => ({ ...item }));
  let previousFontSize = protectedScale[bodyIndex].fontSize;
  let previousMinFontSize = protectedScale[bodyIndex].minFontSize;
  let previousMaxFontSize = protectedScale[bodyIndex].maxFontSize;

  for (let index = bodyIndex + 1; index < protectedScale.length; index += 1) {
    const item = protectedScale[index];
    item.fontSize = protectSmallValue(
      item.fontSize,
      previousFontSize,
      settings.roundValues,
    );

    if (isNumber(item.minFontSize) && isNumber(previousMinFontSize)) {
      item.minFontSize = protectSmallValue(
        item.minFontSize,
        previousMinFontSize,
        settings.roundValues,
      );
    }

    if (isNumber(item.maxFontSize) && isNumber(previousMaxFontSize)) {
      item.maxFontSize = protectSmallValue(
        item.maxFontSize,
        previousMaxFontSize,
        settings.roundValues,
      );
    }

    item.lineHeight = resolveLineHeight(settings, item.fontSize);
    item.letterSpacing = resolveLetterSpacing(settings, item.fontSize);

    if (
      item.clampValue &&
      isNumber(item.minFontSize) &&
      isNumber(item.maxFontSize)
    ) {
      item.clampValue = buildClampValue(
        item.minFontSize,
        item.maxFontSize,
        settings,
      );
    }

    previousFontSize = item.fontSize;
    previousMinFontSize = item.minFontSize;
    previousMaxFontSize = item.maxFontSize;
  }

  return protectedScale;
}

function protectSmallValue(value, previousValue, roundValues) {
  if (!isNumber(value) || !isNumber(previousValue)) return value;
  return roundBySetting(Math.max(value, previousValue - 1), roundValues);
}

function buildClampValue(minFontSize, maxFontSize, settings) {
  const minViewport = settings.minViewport;
  const maxViewport = settings.maxViewport;
  const unit = settings.unit ?? "px";
  const minClampSize = toUnitNumber(minFontSize, unit, settings.baseFontSize);
  const maxClampSize = toUnitNumber(maxFontSize, unit, settings.baseFontSize);
  const slope = (maxClampSize - minClampSize) / (maxViewport - minViewport);
  const preferred = round(slope * 100);
  const intercept = round(minClampSize - slope * minViewport);

  return `clamp(${formatUnitNumber(minClampSize, unit)}, calc(${formatUnitNumber(intercept, unit)} + ${preferred}vw), ${formatUnitNumber(maxClampSize, unit)})`;
}

function toUnitNumber(value, unit, baseFontSize) {
  if (unit === "rem") return round(value / baseFontSize);
  if (unit === "pt") return round(value * 0.75);
  return round(value);
}

function formatUnitNumber(value, unit) {
  return `${trimNumber(value)}${unit}`;
}

function tokenExport(item, settings) {
  return {
    name: item.label,
    technicalName: item.id,
    fontFamily: settings.fontFamily,
    fontSize:
      settings.fluidTypography && item.clampValue
        ? item.clampValue
        : formatSize(item.fontSize, settings.unit, settings.baseFontSize),
    fontSizePx: item.fontSize,
    fontWeight: item.weight,
    lineHeight: item.lineHeight,
    letterSpacing: `${item.letterSpacing}em`,
  };
}

function exportFigma(typeScale, settings) {
  return JSON.stringify(
    typeScale.map((item) => ({
      name: item.label,
      type: "TEXT",
      value: {
        fontFamily: settings.fontFamily.split(",")[0].replaceAll("'", ""),
        fontSize: item.fontSize,
        fontWeight: item.weight,
        lineHeight: `${item.lineHeight * 100}%`,
        letterSpacing: `${item.letterSpacing}em`,
      },
    })),
    null,
    2,
  );
}

function exportIos(typeScale, settings) {
  return `// Typography Scale\n// Generated by Type Scale Tool\n// Base font size: ${settings.baseFontSize}px\n// Scale ratio: ${settings.scaleRatio}\n// Font family: ${settings.fontFamily}\n\nimport UIKit\n\nstruct TypeScale {\n${typeScale
    .map(
      (item) =>
        `  static let ${camel(item.id)} = UIFont.systemFont(ofSize: ${item.fontSize}, weight: .${iosWeight(item.weight)})`,
    )
    .join("\n")}\n}`;
}

function exportAndroid(typeScale, settings) {
  return `/**\n * Typography Scale\n * Generated by Type Scale Tool\n * Base font size: ${settings.baseFontSize}px\n * Scale ratio: ${settings.scaleRatio}\n * Font family: ${settings.fontFamily}\n */\npackage com.yourapp.ui.theme\n\nimport androidx.compose.ui.text.TextStyle\nimport androidx.compose.ui.text.font.FontWeight\nimport androidx.compose.ui.unit.sp\n\nval TypeScale = mapOf(\n${typeScale
    .map(
      (item) =>
        `  "${item.id}" to TextStyle(fontSize = ${item.fontSize}.sp, fontWeight = FontWeight.${androidWeight(item.weight)}),`,
    )
    .join("\n")}\n)`;
}

function exportFlutter(typeScale, settings) {
  return `/// Typography Scale\n/// Generated by Type Scale Tool\n/// Base font size: ${settings.baseFontSize}px\n/// Scale ratio: ${settings.scaleRatio}\n/// Font family: ${settings.fontFamily}\n\nimport 'package:flutter/material.dart';\n\nclass TypeScale {\n${typeScale
    .map(
      (item) =>
        `  static const ${camel(item.id)} = TextStyle(fontSize: ${item.fontSize}, fontWeight: FontWeight.w${item.weight}, height: ${item.lineHeight}, letterSpacing: ${item.letterSpacing});`,
    )
    .join("\n")}\n}`;
}

function exportReactNative(typeScale, settings) {
  return `/**\n * Typography Scale\n * Generated by Type Scale Tool\n * Base font size: ${settings.baseFontSize}px\n * Scale ratio: ${settings.scaleRatio}\n * Font family: ${settings.fontFamily}\n */\nimport { TextStyle } from 'react-native';\n\nexport const typeScale: Record<string, TextStyle> = {\n${typeScale
    .map(
      (item) =>
        `  '${item.id}': { fontSize: ${item.fontSize}, fontWeight: '${item.weight}', lineHeight: ${round(item.fontSize * item.lineHeight)}, letterSpacing: ${item.letterSpacing} },`,
    )
    .join("\n")}\n};`;
}

function previewForToken(item) {
  if (
    item.fontSize >= 24 ||
    item.id.startsWith("h") ||
    item.id.includes("display")
  ) {
    return "The Complete Guide to Modern Type Scales\nEverything You Need to Know About Typography Hierarchy";
  }
  if (item.fontSize >= 14) {
    return "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.";
  }
  return "Published March 15, 2024 - 5 min read - Design Systems";
}

function trimNumber(value) {
  return Number(Number(value).toFixed(3));
}

function round(value) {
  return Number(Number(value).toFixed(2));
}

function roundBySetting(value, roundValues) {
  return roundValues ? Math.round(value) : round(value);
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function clampRatio(value) {
  return Math.min(3, Math.max(1, value));
}

function camel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function iosWeight(weight) {
  if (weight >= 800) return "heavy";
  if (weight >= 700) return "bold";
  if (weight >= 600) return "semibold";
  if (weight >= 500) return "medium";
  if (weight <= 300) return "light";
  return "regular";
}

function androidWeight(weight) {
  if (weight >= 800) return "ExtraBold";
  if (weight >= 700) return "Bold";
  if (weight >= 600) return "SemiBold";
  if (weight >= 500) return "Medium";
  if (weight <= 300) return "Light";
  return "Normal";
}
