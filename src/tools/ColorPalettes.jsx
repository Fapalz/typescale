import { useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Code,
  Copy,
  Download,
  Eye,
  EyeOff,
  Palette,
  Paintbrush,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import { copyText, downloadText } from "../utils.js";

const tonalSteps = [
  { step: 1, lightness: 0.98, usage: "background" },
  { step: 2, lightness: 0.95, usage: "background" },
  { step: 3, lightness: 0.9, usage: "surface" },
  { step: 4, lightness: 0.85, usage: "surface" },
  { step: 5, lightness: 0.75, usage: "surface" },
  { step: 6, lightness: 0.6, usage: "text" },
  { step: 7, lightness: 0.5, usage: "text" },
  { step: 8, lightness: 0.4, usage: "emphasis" },
  { step: 9, lightness: 0.3, usage: "emphasis" },
  { step: 10, lightness: 0.2, usage: "emphasis" },
];

const exportFormats = [
  {
    id: "css",
    label: "CSS",
    description: "CSS variables ready for your stylesheets",
  },
  {
    id: "scss",
    label: "SCSS",
    description: "SCSS variables for preprocessor workflows",
  },
  {
    id: "json",
    label: "JSON",
    description: "JSON data with full color information",
  },
];

const useCases = [
  {
    title: "Design Systems",
    description: "Build comprehensive design tokens and style guides",
    icon: Palette,
    tone: "blue",
  },
  {
    title: "Web Development",
    description: "Generate CSS variables for React, Vue, or any framework",
    icon: Code,
    tone: "green",
  },
  {
    title: "Mobile Apps",
    description: "Export JSON for iOS, Android, or React Native projects",
    icon: Smartphone,
    tone: "cyan",
  },
  {
    title: "UI/UX Design",
    description: "Import colors into Figma, Sketch, or Adobe XD",
    icon: Paintbrush,
    tone: "orange",
  },
];

export function ColorPalettes({ onBack }) {
  const [palettes, setPalettes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [paletteName, setPaletteName] = useState("");
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [showContrast, setShowContrast] = useState(true);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const openCreateForm = () => {
    setShowCreateForm(true);
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const generatePalette = () => {
    if (!paletteName.trim()) {
      setError("Please enter a palette name");
      return;
    }

    const parsed = hexToHsl(baseColor);
    if (!parsed) {
      setError("Invalid hex code. Please use format #RRGGBB");
      return;
    }

    setPalettes((items) => [
      ...items,
      createPalette(paletteName.trim(), parsed.h, parsed.s),
    ]);
    setShowCreateForm(false);
    setPaletteName("");
    setBaseColor("#3b82f6");
    setError("");
  };

  const removePalette = (id) => {
    setPalettes((items) => items.filter((palette) => palette.id !== id));
  };

  const copyFormat = async (format) => {
    await copyText(exportContent(format, palettes));
    setCopiedFormat(format);
    window.setTimeout(() => setCopiedFormat(null), 2000);
  };

  const downloadFormat = (format) => {
    downloadText(`color-palettes.${format}`, exportContent(format, palettes));
  };

  const contrastLabel = (ratio) => {
    if (isWcagAaa(ratio)) return "AAA";
    if (isWcagAa(ratio)) return "AA";
    return "Fail";
  };

  const contrastClass = (ratio) => {
    if (isWcagAaa(ratio)) return "text-green-600 dark:text-green-400";
    if (isWcagAa(ratio)) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const preview = hexToHsl(baseColor);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Type Scale Tool</span>
          </button>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Palette className="w-10 h-10 text-blue-600" />
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                  Color Palette Generator
                </h1>
              </div>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
                Create accessible, systematic color scales for modern design
                systems
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl">
                Generate professional 10-step tonal color palettes with built-in
                WCAG accessibility testing. Perfect for designers and developers
                building consistent, accessible user interfaces.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Palette</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <FeatureCard
              icon={Palette}
              tone="blue"
              title="Systematic Color Scales"
              description="Generate 10 harmonious color steps from any hex code, maintaining consistent hue and saturation while varying lightness for perfect tonal progression."
            />
            <FeatureCard
              icon={Check}
              tone="green"
              title="WCAG Accessibility Built-In"
              description="Every color step includes real-time WCAG 2.1 contrast ratio testing against white and black backgrounds, ensuring your designs meet AA and AAA standards."
            />
            <FeatureCard
              icon={Download}
              tone="cyan"
              title="Export Ready Formats"
              description="Export your palettes as CSS variables, SCSS variables, or JSON data. Copy to clipboard or download files ready for immediate use in your projects."
            />
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Understanding the 10-Step Tonal Scale System
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
                <div>
                  <p className="font-semibold mb-1">
                    Steps 1-5: Backgrounds & Surfaces
                  </p>
                  <p>
                    Lightest colors perfect for backgrounds, cards, and subtle
                    UI elements. Use these for layered interfaces with depth and
                    hierarchy.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Steps 6-10: Text & Emphasis
                  </p>
                  <p>
                    Darker colors with strong contrast for text, borders, and
                    interactive elements. Ensures readability and meets
                    accessibility standards.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-blue-700 dark:text-blue-400">
                Each scale maintains consistent hue and saturation across all
                steps, varying only in lightness. This creates harmonious color
                systems that feel cohesive and professional.
              </p>
            </div>
          </div>
        </section>

        {showCreateForm && (
          <section
            ref={formRef}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Color Palette
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Palette Name
                </label>
                <input
                  type="text"
                  value={paletteName}
                  onChange={(event) => {
                    setPaletteName(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g., Primary, Brand Blue"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Base Color (Hex Code)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={preview ? normalizeHex(baseColor) : "#3b82f6"}
                    onChange={(event) => {
                      setBaseColor(event.target.value);
                      setError("");
                    }}
                    className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(event) => {
                      setBaseColor(event.target.value);
                      setError("");
                    }}
                    placeholder="#3b82f6"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview 10-Step Scale:
              </p>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {preview?.h !== undefined &&
                  tonalSteps.map((item) => (
                    <div key={item.step} className="space-y-1">
                      <div
                        className="w-full h-16 rounded border-2 border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundColor: `hsl(${preview.h}, ${
                            preview.s * 100
                          }%, ${item.lightness * 100}%)`,
                        }}
                      />
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {item.step}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={generatePalette}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Generate Palette
              </button>
              {palettes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>
        )}

        {palettes.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Color Palettes
            </h2>
            <button
              type="button"
              onClick={() => setShowContrast((value) => !value)}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 shadow-sm"
            >
              {showContrast ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{showContrast ? "Hide" : "Show"} Contrast Details</span>
            </button>
          </div>
        )}

        <div className="space-y-8">
          {palettes.length === 0 && !showCreateForm && (
            <section className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Palette className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Color Palettes Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by creating your first color palette from a hex code
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Palette</span>
              </button>
            </section>
          )}

          {palettes.map((palette) => (
            <section
              key={palette.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {palette.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hue: {palette.hue}
                    {"\u00b0"} | Saturation:{" "}
                    {Math.round(palette.saturation * 100)}%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePalette(palette.id)}
                  className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                  title="Remove palette"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-4">
                  {palette.steps.map((color) => (
                    <div key={color.step} className="space-y-2">
                      <div
                        className="aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            Step {color.step}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {color.usage}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {color.hex}
                        </p>
                        {showContrast && (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">
                                vs White:
                              </span>
                              <span
                                className={`font-semibold ${contrastClass(
                                  color.contrastWhite,
                                )}`}
                              >
                                {color.contrastWhite} (
                                {contrastLabel(color.contrastWhite)})
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">
                                vs Black:
                              </span>
                              <span
                                className={`font-semibold ${contrastClass(
                                  color.contrastBlack,
                                )}`}
                              >
                                {color.contrastBlack} (
                                {contrastLabel(color.contrastBlack)})
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {palettes.length > 0 && (
          <>
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <InfoPanel
                title="How to Use Your Color Palettes"
                items={[
                  [
                    "Backgrounds:",
                    "Use steps 1-3 for page backgrounds, cards, and containers",
                  ],
                  [
                    "Borders & Dividers:",
                    "Steps 4-5 work well for subtle borders and separators",
                  ],
                  [
                    "Interactive Elements:",
                    "Steps 6-7 for hover states and secondary actions",
                  ],
                  [
                    "Text & Icons:",
                    "Steps 8-10 provide excellent contrast for readable text",
                  ],
                ]}
              />
              <BestPractices />
            </div>

            <section className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Perfect For These Use Cases
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {useCases.map((item) => (
                  <UseCase key={item.title} {...item} />
                ))}
              </div>
            </section>

            <section className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Export Your Palettes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download or copy your color palettes in your preferred
                    format
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exportFormats.map((format) => (
                  <div
                    key={format.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white uppercase">
                        {format.label}
                      </span>
                      {copiedFormat === format.id && (
                        <span className="inline-flex items-center space-x-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {format.description}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => copyFormat(format.id)}
                        className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadFormat(format.id)}
                        className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, tone, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <div
        className={`w-12 h-12 ${toneBg(tone)} rounded-lg flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${toneText(tone)}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function InfoPanel({ title, items }) {
  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        {items.map(([label, text], index) => (
          <li key={label} className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
              {index + 1}
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">{label}</strong>{" "}
              {text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BestPractices() {
  const items = [
    [
      "Consistency:",
      "Use the same color scale throughout your project for a cohesive look",
    ],
    [
      "Accessibility:",
      "Always check contrast ratios - aim for AA (4.5:1) or AAA (7:1)",
    ],
    [
      "Semantic Naming:",
      "Create palettes for specific purposes (primary, success, danger, etc.)",
    ],
    [
      "Documentation:",
      "Export and share your palettes with your team for consistency",
    ],
  ];

  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Best Practices
      </h2>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        {items.map(([label, text]) => (
          <li key={label} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-gray-900 dark:text-white">{label}</strong>{" "}
              {text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UseCase({ icon: Icon, title, description, tone }) {
  return (
    <div className="text-center">
      <div
        className={`w-16 h-16 ${toneBg(tone)} rounded-xl flex items-center justify-center mx-auto mb-3`}
      >
        <Icon className={`w-8 h-8 ${toneText(tone)}`} />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function toneBg(tone) {
  if (tone === "green") return "bg-green-100 dark:bg-green-900/30";
  if (tone === "cyan") return "bg-cyan-100 dark:bg-cyan-900/30";
  if (tone === "orange") return "bg-orange-100 dark:bg-orange-900/30";
  return "bg-blue-100 dark:bg-blue-900/30";
}

function toneText(tone) {
  if (tone === "green") return "text-green-600 dark:text-green-400";
  if (tone === "cyan") return "text-cyan-600 dark:text-cyan-400";
  if (tone === "orange") return "text-orange-600 dark:text-orange-400";
  return "text-blue-600 dark:text-blue-400";
}

function createPalette(name, hue, saturation) {
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

function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
}

function normalizeHex(hex) {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : "#3b82f6";
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

function isWcagAa(ratio) {
  return ratio >= 4.5;
}

function isWcagAaa(ratio) {
  return ratio >= 7;
}

function exportContent(format, palettes) {
  if (format === "scss") return scssExport(palettes);
  if (format === "json") return jsonExport(palettes);
  return cssExport(palettes);
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
