import { useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  Monitor,
  Palette,
  Smartphone,
  X,
} from "lucide-react";
import { copyText, downloadText, exportTypeScale } from "../utils.js";

const coreTabs = [
  { key: "json", label: "JSON (Figma)" },
  { key: "css", label: "CSS Custom Properties" },
  { key: "scss", label: "SCSS Variables" },
];

const platformTabs = [
  {
    id: "ios",
    name: "iOS",
    description: "Swift UIKit typography constants",
    icon: Smartphone,
    color: "blue",
    fileExtension: "swift",
  },
  {
    id: "android",
    name: "Android",
    description: "Jetpack Compose TextStyle tokens",
    icon: Smartphone,
    color: "green",
    fileExtension: "kt",
  },
  {
    id: "flutter",
    name: "Flutter",
    description: "Flutter TextStyle constants",
    icon: Smartphone,
    color: "cyan",
    fileExtension: "dart",
  },
  {
    id: "react-native",
    name: "React Native",
    description: "Cross-platform TextStyle map",
    icon: Monitor,
    color: "purple",
    fileExtension: "ts",
  },
  {
    id: "figma",
    name: "Figma Tokens",
    description: "Design-token JSON for design tools",
    icon: Palette,
    color: "pink",
    fileExtension: "json",
  },
  {
    id: "cli-config",
    name: "CLI Config",
    description: "Configuration for automated generation",
    icon: Code2,
    color: "gray",
    fileExtension: "json",
  },
];

export function ExportModal({ settings, typeScale, onClose }) {
  const [tab, setTab] = useState("json");
  const [copied, setCopied] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const content = useMemo(
    () => buildCoreExports(typeScale, settings)[tab],
    [typeScale, settings, tab],
  );

  const copy = async () => {
    await copyText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const extension = tab === "json" ? "json" : tab;
    downloadText(`typescale.${extension}`, content);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Export Type Scale
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {coreTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                tab === item.key
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlatformOpen(true)}
            className="px-6 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 flex items-center space-x-2"
          >
            <Monitor className="w-4 h-4" />
            <span>Platform Exports</span>
          </button>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <div className="relative h-full">
            <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono text-gray-900 dark:text-gray-100 overflow-auto h-full border border-gray-200 dark:border-gray-700 max-h-96 min-h-[300px]">
              {content}
            </pre>
          </div>
        </div>

        {platformOpen && (
          <PlatformExportModal
            typeScale={typeScale}
            settings={settings}
            onClose={() => setPlatformOpen(false)}
          />
        )}

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformExportModal({ settings, typeScale, onClose }) {
  const [tab, setTab] = useState("ios");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    includeComments: true,
    useSemanticNames: true,
    includeLineHeight: true,
    includeLetterSpacing: true,
    includeFontWeight: true,
  });
  const active =
    platformTabs.find((item) => item.id === tab) ?? platformTabs[0];
  const content = useMemo(
    () => buildPlatformExport(typeScale, settings, tab, options),
    [typeScale, settings, tab, options],
  );

  const copy = async () => {
    await copyText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    downloadText(`typography.${active.fileExtension}`, content);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Platform Export
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Export your typography scale for different platforms and tools
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-6 h-80 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                Select Platform
              </h3>
              <div className="space-y-2">
                {platformTabs.map((item) => {
                  const Icon = item.icon;
                  const selected = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        selected
                          ? colorClass(item.color)
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <p className="text-sm opacity-80">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 h-64 flex flex-col">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                {tab === "cli-config" ? "CLI Configuration" : "Export Options"}
              </h4>
              <div className="flex-1 overflow-y-auto">
                {tab === "cli-config" ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configuration file for automated typography generation
                      across multiple platforms.
                    </p>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Usage:</strong> Save as typescale.json and run
                        with CLI tool for automated generation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      ["includeComments", "Include comments"],
                      ["useSemanticNames", "Use semantic names"],
                      ["includeFontWeight", "Include font weight"],
                      ["includeLineHeight", "Include line height"],
                      ["includeLetterSpacing", "Include letter spacing"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={options[key]}
                          onChange={(event) =>
                            setOptions((current) => ({
                              ...current,
                              [key]: event.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div
              className={`p-6 border-b border-gray-200 dark:border-gray-700 ${colorClass(
                active.color,
              )}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <active.icon className="w-6 h-6" />
                <h3 className="text-lg font-semibold">{active.name}</h3>
              </div>
              <p className="opacity-90">{active.description}</p>
            </div>
            <div className="flex-1 p-6 overflow-hidden min-h-0">
              <div className="relative h-full w-full">
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono text-gray-900 dark:text-gray-100 overflow-auto h-full border border-gray-200 dark:border-gray-700 w-full">
                  <code>{content}</code>
                </pre>
                <button
                  type="button"
                  onClick={copy}
                  className="absolute top-2 right-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs transition-colors duration-200"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {typeScale.length} typography sizes • {active.name} format
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildCoreExports(typeScale, settings) {
  const json = JSON.stringify(
    typeScale.map((item) => ({
      name: item.label,
      technicalName: item.label,
      fontFamily: settings.fontFamily,
      fontSize: convertSize(item.fontSize, settings),
      fontWeight: getWeight(item),
      lineHeight: item.lineHeight,
      letterSpacing: item.letterSpacing,
    })),
    null,
    2,
  );

  const cssTokens = typeScale
    .map((item) => {
      const name = item.semanticName || item.id;
      const size =
        settings.fluidTypography && item.clampValue
          ? item.clampValue
          : formatSizeValue(item.fontSize, settings);
      return `  --${name}-size: ${size};
  --${name}-weight: ${getWeight(item)};
  --${name}-line-height: ${item.lineHeight};
  --${name}-letter-spacing: ${item.letterSpacing}em;`;
    })
    .join("\n\n");

  const css = `${settings.fluidTypography ? "/* Fluid Typography with CSS clamp() */\n" : ""}:root {
  /* Font Family */
  --font-family: ${settings.fontFamily};

  /* Type Scale */
${cssTokens}
}`;

  const scssTokens = typeScale
    .map((item) => {
      const name = item.semanticName || item.id;
      const size =
        settings.fluidTypography && item.clampValue
          ? item.clampValue
          : formatSizeValue(item.fontSize, settings);
      return `$${name}-size: ${size};
$${name}-weight: ${getWeight(item)};
$${name}-line-height: ${item.lineHeight};
$${name}-letter-spacing: ${item.letterSpacing}em;`;
    })
    .join("\n\n");

  const scss = `${settings.fluidTypography ? "// Fluid Typography with CSS clamp()\n" : ""}// Font Family
$font-family: ${settings.fontFamily};

// Type Scale
${scssTokens}`;

  return { json, css, scss };
}

function buildPlatformExport(typeScale, settings, format, options) {
  if (format === "cli-config") {
    return JSON.stringify(
      {
        baseFontSize: settings.baseFontSize,
        scaleRatio: settings.scaleRatio,
        fontFamily: settings.fontFamily,
        formats: ["ios", "android", "flutter", "react-native", "figma"],
        tokens: typeScale.map((item) => ({
          id: item.id,
          name: item.label,
          fontSize: item.fontSize,
          fontWeight: getWeight(item),
          lineHeight: item.lineHeight,
          letterSpacing: item.letterSpacing,
        })),
      },
      null,
      2,
    );
  }

  let content = exportTypeScale(typeScale, settings, format);
  if (!options.includeComments) {
    content = content
      .split("\n")
      .filter(
        (line) =>
          !line.trim().startsWith("//") &&
          !line.trim().startsWith("/*") &&
          !line.trim().startsWith("*") &&
          !line.trim().startsWith("*/"),
      )
      .join("\n");
  }
  if (!options.includeLineHeight) {
    content = content
      .split("\n")
      .filter((line) => !/line[-_]?height|lineHeight/i.test(line))
      .join("\n");
  }
  if (!options.includeLetterSpacing) {
    content = content
      .split("\n")
      .filter((line) => !/letter[-_]?spacing|letterSpacing/i.test(line))
      .join("\n");
  }
  if (!options.includeFontWeight) {
    content = content
      .split("\n")
      .filter((line) => !/font[-_]?weight|fontWeight/i.test(line))
      .join("\n");
  }
  return content;
}

function formatSizeValue(value, settings) {
  return `${convertSize(value, settings)}${settings.unit}`;
}

function convertSize(value, settings) {
  if (settings.unit === "rem") return trim(value / settings.baseFontSize);
  if (settings.unit === "pt") return trim(value / 1.333);
  return trim(value);
}

function trim(value) {
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded) ? rounded : rounded;
}

function getWeight(item) {
  return item.weight ?? item.fontWeight;
}

function colorClass(color) {
  const classes = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300",
    cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300",
    pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300",
    gray: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
  };
  return classes[color] || classes.gray;
}
