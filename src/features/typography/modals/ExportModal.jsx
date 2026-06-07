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
import { copyText, downloadText } from "../../../shared/lib/files.js";
import {
  buildCoreExports,
  buildPlatformExport,
} from "../lib/exportFormatters.js";

const coreTabs = [
  { key: "json", label: "JSON (Figma)" },
  { key: "css", label: "CSS Custom Properties" },
  { key: "scss", label: "SCSS Variables" },
];

const platformTabs = [
  {
    id: "ios",
    name: "iOS Swift",
    description: "UIFont extensions for iOS development",
    icon: Smartphone,
    color: "blue",
    fileExtension: "swift",
  },
  {
    id: "android",
    name: "Android Kotlin",
    description: "Compose TextStyle definitions",
    icon: Smartphone,
    color: "green",
    fileExtension: "kt",
  },
  {
    id: "flutter",
    name: "Flutter Dart",
    description: "TextStyle constants for Flutter",
    icon: Code2,
    color: "cyan",
    fileExtension: "dart",
  },
  {
    id: "react-native",
    name: "React Native",
    description: "TypeScript TextStyle objects",
    icon: Code2,
    color: "purple",
    fileExtension: "ts",
  },
  {
    id: "design-tokens",
    name: "Design Tokens",
    description: "W3C Design Tokens format",
    icon: Palette,
    color: "orange",
    fileExtension: "json",
  },
  {
    id: "figma",
    name: "Figma Plugin",
    description: "Figma text styles import format",
    icon: Palette,
    color: "pink",
    fileExtension: "json",
  },
  {
    id: "cli-config",
    name: "CLI Config",
    description: "Configuration for CLI automation",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overscroll-none p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col transition-colors duration-200">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
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

        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {coreTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200 sm:px-6 ${
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
            className="flex flex-shrink-0 items-center space-x-2 whitespace-nowrap px-4 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 sm:px-6"
          >
            <Monitor className="w-4 h-4" />
            <span>Platform Exports</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
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

        <div className="flex flex-wrap items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overscroll-none p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col transition-colors duration-200">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
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

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain lg:flex-row lg:overflow-hidden">
          <div className="flex flex-shrink-0 flex-col border-b border-gray-200 dark:border-gray-700 lg:w-80 lg:border-b-0 lg:border-r">
            <div className="max-h-72 flex-shrink-0 overflow-y-auto p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:max-h-none">
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

            <div className="flex max-h-48 flex-col border-t border-gray-200 bg-gray-50 p-4 pt-4 dark:border-gray-700 dark:bg-gray-800/50 sm:h-64 sm:max-h-none sm:p-6">
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

          <div className="flex min-h-[520px] min-w-0 flex-shrink-0 flex-col lg:min-h-0 lg:flex-1">
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
              <PlatformUsage activeId={active.id} />
            </div>
            <div className="min-h-[320px] flex-1 overflow-hidden p-4 sm:p-6 lg:min-h-0">
              <div className="relative h-full w-full">
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono text-gray-900 dark:text-gray-100 overflow-auto h-full border border-gray-200 dark:border-gray-700 w-full max-w-full">
                  <code className="block min-w-max whitespace-pre">
                    {content}
                  </code>
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {typeScale.length} typography sizes • {active.name} format
                </div>
                <div className="flex flex-wrap items-center gap-3">
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

function PlatformUsage({ activeId }) {
  const usage = {
    ios: (
      <>
        <strong>Usage:</strong> Add this extension to your iOS project and use{" "}
        <code>UIFont.typography.h1</code>
      </>
    ),
    android: (
      <>
        <strong>Usage:</strong> Add to your theme package and use{" "}
        <code>Typography.h1</code> in Compose
      </>
    ),
    flutter: (
      <>
        <strong>Usage:</strong> Import and use <code>AppTypography.h1</code> in
        your widgets
      </>
    ),
    "react-native": (
      <>
        <strong>Usage:</strong> Import and use <code>typography.h1</code> in
        your components
      </>
    ),
    "design-tokens": (
      <>
        <strong>Usage:</strong> Import the JSON into your token pipeline or
        design system build step
      </>
    ),
    figma: (
      <>
        <strong>Usage:</strong> Import the JSON with a Figma text styles plugin
      </>
    ),
    "cli-config": (
      <>
        <strong>Usage:</strong> Save as <code>typescale.json</code> and use with
        CLI tooling
      </>
    ),
  };

  return (
    <div className="mt-4 text-sm opacity-80">
      <p>{usage[activeId]}</p>
    </div>
  );
}

function colorClass(color) {
  const classes = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300",
    cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300",
    pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300",
    gray: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
  };
  return classes[color] || classes.gray;
}
