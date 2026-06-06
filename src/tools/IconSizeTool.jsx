import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Box,
  Check,
  Copy,
  Download,
  Palette,
  Search,
  Settings,
  Shapes,
  Star,
  Type,
} from "lucide-react";
import { copyText, downloadText } from "../utils.js";

const iconNames = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
];
const previewIcons = [Type, Palette, Box, Shapes, Search, Settings, Bell, Star];

export function IconSizeTool({ onBack }) {
  const [baseSize, setBaseSize] = useState(20);
  const [scaleRatio, setScaleRatio] = useState(1.25);
  const [steps, setSteps] = useState(7);
  const [alignToTypography, setAlignToTypography] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [copiedExport, setCopiedExport] = useState(null);

  const sizes = useMemo(() => {
    const result = [];
    const centerIndex = Math.floor(steps / 2);

    for (let index = 0; index < steps; index += 1) {
      const offset = index - centerIndex;
      let value = alignToTypography
        ? Math.round(16 * Math.pow(1.25, offset))
        : Math.round(baseSize * Math.pow(scaleRatio, offset));
      value = Math.max(8, Math.min(128, value));

      const name = iconNames[index] || `size-${index + 1}`;
      result.push({
        name,
        label: name.toUpperCase(),
        value,
      });
    }

    return result;
  }, [baseSize, scaleRatio, steps, alignToTypography]);

  const css = sizes
    .map(({ name, value }) => `--icon-${name}: ${value}px;`)
    .join("\n");
  const json = JSON.stringify(
    sizes.reduce((tokens, { name, value }) => {
      tokens[`icon${name.charAt(0).toUpperCase()}${name.slice(1)}`] =
        `${value}px`;
      return tokens;
    }, {}),
    null,
    2,
  );

  async function copyToken(name, value) {
    await copyText(`${value}px`);
    setCopiedToken(name);
    window.setTimeout(() => setCopiedToken(null), 2000);
  }

  async function copyExport(key, text) {
    await copyText(text);
    setCopiedExport(key);
    window.setTimeout(() => setCopiedExport(null), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Typography</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Icon Size Generator
          </h1>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Icon sizes affect rhythm, spacing, and interaction layouts. A
              clear sizing scale reduces visual noise.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Matching icon sizes to typography creates cleaner alignment. This
              generator builds a predictable system so teams stay consistent
              across breakpoints.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Configuration
            </h2>
            <div className="space-y-6">
              <Field
                label="Number of Steps"
                helper="How many size tokens to generate (3-10)"
                value={steps}
                min={3}
                max={10}
                disabled={alignToTypography}
                onChange={setSteps}
              />
              <Field
                label="Base Size (px)"
                helper="The middle size in your scale (typically 16-24px)"
                value={baseSize}
                min={8}
                max={64}
                disabled={alignToTypography}
                onChange={setBaseSize}
              />
              <Field
                label="Scale Ratio"
                helper="Multiplier between each step (1.1-2.0)"
                value={scaleRatio}
                min={1.1}
                max={2}
                step={0.05}
                disabled={alignToTypography}
                onChange={setScaleRatio}
              />

              <label className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={alignToTypography}
                  onChange={(event) =>
                    setAlignToTypography(event.target.checked)
                  }
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    Align to Typography Scale
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Use the same scale as your typography (base 16px, ratio
                    1.25). This creates perfect alignment between icon sizes and
                    text sizes, making layouts feel more cohesive.
                  </p>
                </div>
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Icon Preview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Preview how icons look at each size in your scale. Consistent
              sizing ensures visual harmony across your interface.
            </p>
            <div className="space-y-6">
              {sizes.map(({ name, label, value }) => (
                <div key={name} className="flex items-center space-x-4">
                  <div className="w-14 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {value}px
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                    {previewIcons.map((Icon, index) => (
                      <Icon
                        key={index}
                        className="text-gray-700 dark:text-gray-300"
                        style={{ width: `${value}px`, height: `${value}px` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Size Tokens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sizes.map(({ name, label, value }) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {label}
                  </div>
                  <code className="text-sm text-gray-600 dark:text-gray-400">
                    --icon-{name}: {value}px
                  </code>
                </div>
                <button
                  onClick={() => copyToken(name, value)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {copiedToken === name ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ExportCard
            title="CSS Variables"
            code={css}
            copied={copiedExport === "css"}
            onCopy={() => copyExport("css", css)}
            onDownload={() => downloadText("icon-sizes.css", css)}
          />
          <ExportCard
            title="JSON Export"
            code={json}
            copied={copiedExport === "json"}
            onCopy={() => copyExport("json", json)}
            onDownload={() => downloadText("icon-sizes.json", json)}
          />
        </div>

        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Why Consistent Icon Sizing Matters
          </h3>
          <div className="space-y-3 text-blue-800 dark:text-blue-200">
            <p>
              <strong>Icon sizes create visual rhythm</strong> in your
              interface. When icons scale predictably, users can quickly
              distinguish between different types of actions and levels of
              importance. Buttons with larger icons feel more prominent, while
              smaller icons work well for supplementary information.
            </p>
            <p>
              <strong>Consistent sizing reduces visual noise.</strong> A limited
              set of icon sizes prevents your interface from feeling chaotic.
              When every icon size has a purpose, users can focus on content
              rather than being distracted by inconsistent visual weight.
            </p>
            <p>
              <strong>
                Matching icon sizes to typography creates alignment harmony.
              </strong>{" "}
              When your icon scale aligns with your type scale, icons naturally
              fit with adjacent text. A 20px icon pairs perfectly with 20px
              text, creating clean, professional layouts without manual
              adjustments.
            </p>
            <p>
              <strong>Predictable scaling helps with responsive design.</strong>{" "}
              When your icon sizes follow a consistent ratio, they can scale
              smoothly across breakpoints. You can confidently use smaller icons
              on mobile and larger ones on desktop while maintaining the same
              visual relationships.
            </p>
            <p>
              <strong>Design system consistency improves team velocity.</strong>{" "}
              When developers and designers share a common icon sizing scale,
              they spend less time making decisions and more time building
              features. The scale becomes a shared language that makes design
              reviews faster and implementation more predictable.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  helper,
  value,
  min,
  max,
  step = 1,
  disabled = false,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</p>
    </div>
  );
}

function ExportCard({ title, code, copied, onCopy, onDownload }) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCopy}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-gray-800 dark:text-gray-200">{code}</code>
      </pre>
    </section>
  );
}
