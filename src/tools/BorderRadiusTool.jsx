import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { downloadText, copyText } from "../utils.js";
import { ExportCard } from "./SharedExportCard.jsx";

const layerStyles = [
  "bg-blue-500/20 dark:bg-blue-500/30 border-blue-500",
  "bg-purple-500/20 dark:bg-purple-500/30 border-purple-500",
  "bg-pink-500/20 dark:bg-pink-500/30 border-pink-500",
  "bg-orange-500/20 dark:bg-orange-500/30 border-orange-500",
  "bg-green-500/20 dark:bg-green-500/30 border-green-500",
  "bg-cyan-500/20 dark:bg-cyan-500/30 border-cyan-500",
  "bg-indigo-500/20 dark:bg-indigo-500/30 border-indigo-500",
  "bg-red-500/20 dark:bg-red-500/30 border-red-500",
  "bg-yellow-500/20 dark:bg-yellow-500/30 border-yellow-500",
  "bg-teal-500/20 dark:bg-teal-500/30 border-teal-500",
];

export function BorderRadiusTool({ onBack }) {
  const [outerRadius, setOuterRadius] = useState(24);
  const [padding, setPadding] = useState(8);
  const [layers, setLayers] = useState(4);
  const [mode, setMode] = useState("direct");
  const [copied, setCopied] = useState(null);

  const values = useMemo(() => {
    const result = [];
    let current = outerRadius;

    for (let index = 0; index < layers; index += 1) {
      result.push({
        layer: index + 1,
        radius: Math.max(0, current),
      });

      if (mode === "direct") {
        current -= padding;
      } else {
        current -= index === 0 ? padding : padding / 2;
      }
    }

    return result;
  }, [outerRadius, padding, layers, mode]);

  const css = values
    .map(({ layer, radius }) => `--radius-layer-${layer}: ${radius}px;`)
    .join("\n");
  const json = JSON.stringify(
    values.reduce((tokens, { layer, radius }) => {
      tokens[`layer${layer}`] = `${radius}px`;
      return tokens;
    }, {}),
    null,
    2,
  );

  async function handleCopy(key, text) {
    await copyText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
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
            Nested Border Radius Generator
          </h1>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Border radius controls how round a corner appears. Designers and
              developers use it to create clean, consistent interfaces.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nested containers often lose that consistency. Padding changes the
              math and inner corners can flatten out. This generator calculates
              each radius so your layout stays consistent across layers.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Configuration
              </h2>

              <div className="space-y-6">
                <Field
                  label="Outer Radius (px)"
                  helper="The border radius of the outermost container"
                  value={outerRadius}
                  min={0}
                  max={100}
                  onChange={setOuterRadius}
                />
                <Field
                  label="Padding Between Layers (px)"
                  helper="Space between each nested layer"
                  value={padding}
                  min={0}
                  max={50}
                  onChange={setPadding}
                />
                <Field
                  label="Number of Layers"
                  helper="How many nested containers (1-10)"
                  value={layers}
                  min={1}
                  max={10}
                  onChange={setLayers}
                />
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Calculation Mode
              </h2>
              <div className="space-y-3">
                <RadioCard
                  checked={mode === "direct"}
                  title="Direct Mode"
                  text="The tool subtracts the full padding at each layer. This creates a fast drop in radius as you move inward. Best for interfaces where inner elements need minimal rounding."
                  onChange={() => setMode("direct")}
                />
                <RadioCard
                  checked={mode === "proportional"}
                  title="Proportional Mode"
                  text="The tool subtracts half the padding after the first layer. This creates a gradual change that keeps inner corners round. Ideal for maintaining visual balance across all layers."
                  onChange={() => setMode("proportional")}
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Visual Preview
              </h2>
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
                {values.map(({ layer, radius }, index) => {
                  const size = 100 - index * (80 / layers);
                  return (
                    <div
                      key={layer}
                      className={`absolute border-2 flex items-center justify-center ${
                        layerStyles[index % layerStyles.length]
                      }`}
                      style={{
                        width: `${size}%`,
                        height: `${size}%`,
                        borderRadius: `${radius}px`,
                      }}
                    >
                      {index === values.length - 1 && (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Layer {layer}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Calculated Values
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Layer
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Border Radius
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.map(({ layer, radius }) => (
                      <tr
                        key={layer}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-3 px-3 text-gray-900 dark:text-white">
                          Layer {layer}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-700 dark:text-gray-300">
                          {radius}px
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ExportCard
            title="CSS Variables"
            code={css}
            copied={copied === "css"}
            onCopy={() => handleCopy("css", css)}
            onDownload={() => downloadText("border-radius.css", css)}
          />
          <ExportCard
            title="JSON Export"
            code={json}
            copied={copied === "json"}
            onCopy={() => handleCopy("json", json)}
            onDownload={() => downloadText("border-radius.json", json)}
          />
        </div>

        <section className="mt-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How It Works
          </h3>
          <div className="space-y-3 text-blue-800 dark:text-blue-200">
            <p>
              <strong>Direct mode</strong> applies full padding at each step. If
              you start with 24px radius and 8px padding, each layer loses 8px:
              24px -&gt; 16px -&gt; 8px -&gt; 0px. This approach works well when
              you want inner elements to have sharp corners or minimal rounding.
            </p>
            <p>
              <strong>Proportional mode</strong> reduces the change for deeper
              layers to maintain balance. After the first full padding
              subtraction, subsequent layers only lose half the padding value.
              With the same 24px start and 8px padding: 24px -&gt; 16px -&gt;
              12px -&gt; 8px. This keeps all corners visibly round and creates a
              more harmonious nested appearance.
            </p>
            <p>
              The tool helps you test values fast and export them into your code
              or design files. Use CSS variables in your stylesheets or JSON
              format for design tokens and configuration files.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, helper, value, min, max, onChange }) {
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
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</p>
    </div>
  );
}

function RadioCard({ checked, title, text, onChange }) {
  return (
    <label className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1"
      />
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{title}</div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </label>
  );
}
