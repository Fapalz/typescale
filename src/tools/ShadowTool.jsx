import { useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, Download } from "lucide-react";
import { copyText, downloadText } from "../utils.js";

export function ShadowTool({ onBack }) {
  const [steps, setSteps] = useState(5);
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(1);
  const [baseBlur, setBaseBlur] = useState(3);
  const [baseSpread, setBaseSpread] = useState(0);
  const [baseOpacity, setBaseOpacity] = useState(0.12);
  const [mode, setMode] = useState("light");
  const [copiedStep, setCopiedStep] = useState(null);
  const [copiedExport, setCopiedExport] = useState(null);

  const shadows = useMemo(() => {
    const result = [];

    for (let index = 0; index < steps; index += 1) {
      const step = index + 1;
      const x = baseX * step;
      const y = baseY * step;
      const blur = baseBlur * step;
      const spread = baseSpread * step;
      let opacity = baseOpacity + index * 0.02;
      opacity =
        mode === "dark" ? Math.min(opacity * 1.3, 0.5) : Math.min(opacity, 0.3);
      const color = mode === "light" ? "0, 0, 0" : "255, 255, 255";
      const cssValue = `${x}px ${y}px ${blur}px ${spread}px rgba(${color}, ${opacity.toFixed(
        2,
      )})`;

      result.push({ step, x, y, blur, spread, opacity, cssValue });
    }

    return result;
  }, [steps, baseX, baseY, baseBlur, baseSpread, baseOpacity, mode]);

  const css = shadows
    .map(({ step, cssValue }) => `--shadow-${step}: ${cssValue};`)
    .join("\n");
  const json = JSON.stringify(
    shadows.reduce((tokens, { step, cssValue }) => {
      tokens[`elevation${step}`] = cssValue;
      return tokens;
    }, {}),
    null,
    2,
  );

  async function copyStep(step, text) {
    await copyText(text);
    setCopiedStep(step);
    window.setTimeout(() => setCopiedStep(null), 2000);
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
            Shadow Generator
          </h1>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Shadows guide the eye and set hierarchy in interfaces. Consistent
              elevation steps make components easier to read.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Light mode uses darker shadows with lower opacity. Dark mode uses
              lighter shadows with higher softness. This generator creates clean
              shadow presets so teams avoid guesswork.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Configuration
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Number of Steps"
                  helper="How many elevation levels to generate (1-10)"
                  value={steps}
                  min={1}
                  max={10}
                  onChange={setSteps}
                />
                <Field
                  label="Base X (px)"
                  value={baseX}
                  min={-20}
                  max={20}
                  onChange={setBaseX}
                />
                <Field
                  label="Base Y (px)"
                  value={baseY}
                  min={0}
                  max={20}
                  onChange={setBaseY}
                />
                <Field
                  label="Base Blur (px)"
                  value={baseBlur}
                  min={0}
                  max={50}
                  onChange={setBaseBlur}
                />
                <Field
                  label="Base Spread (px)"
                  value={baseSpread}
                  min={-20}
                  max={20}
                  onChange={setBaseSpread}
                />
                <Field
                  label="Base Opacity"
                  helper="Starting opacity (0-1)"
                  value={baseOpacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={setBaseOpacity}
                />
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Shadow Mode
              </h2>
              <div className="space-y-3">
                <RadioCard
                  checked={mode === "light"}
                  title="Light Mode"
                  text="Darker shadows with controlled opacity. Best for light backgrounds where shadows need to create clear depth without overwhelming the design."
                  onChange={() => setMode("light")}
                />
                <RadioCard
                  checked={mode === "dark"}
                  title="Dark Mode"
                  text="Lighter shadows with increased softness. Optimized for dark backgrounds where elevation needs to be visible without harsh contrast."
                  onChange={() => setMode("dark")}
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section
              className={`rounded-xl border p-6 transition-colors ${
                mode === "dark"
                  ? "bg-gray-950 border-gray-800"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              }`}
              style={mode === "dark" ? { backgroundColor: "#030712" } : null}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  mode === "dark"
                    ? "text-white"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Shadow Preview
              </h2>
              <div className="space-y-4">
                {shadows.map(({ step, cssValue }) => (
                  <div key={step} className="flex items-center space-x-4">
                    <div
                      className={`w-16 text-sm font-medium ${
                        mode === "dark"
                          ? "text-gray-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Step {step}
                    </div>
                    <div
                      className={`flex-1 h-16 rounded-lg ${
                        mode === "light" ? "bg-white" : "bg-gray-900"
                      }`}
                      style={{
                        backgroundColor:
                          mode === "dark" ? "#111827" : undefined,
                        boxShadow: cssValue,
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                CSS Values
              </h2>
              <div className="space-y-3">
                {shadows.map(({ step, cssValue }) => (
                  <div
                    key={step}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <code className="text-sm text-gray-700 dark:text-gray-300 break-all">
                      box-shadow: {cssValue};
                    </code>
                    <button
                      onClick={() => copyStep(step, cssValue)}
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {copiedStep === step ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ExportCard
            title="CSS Variables"
            code={css}
            copied={copiedExport === "css"}
            onCopy={() => copyExport("css", css)}
            onDownload={() => downloadText("shadows.css", css)}
          />
          <ExportCard
            title="JSON Export"
            code={json}
            copied={copiedExport === "json"}
            onCopy={() => copyExport("json", json)}
            onDownload={() => downloadText("shadows.json", json)}
          />
        </div>

        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Understanding Elevation
          </h3>
          <div className="space-y-3 text-blue-800 dark:text-blue-200">
            <p>
              <strong>Shadows create visual hierarchy</strong> by simulating
              depth. Components that appear closer to the user have larger,
              softer shadows. Components further away have smaller, sharper
              shadows or no shadow at all.
            </p>
            <p>
              <strong>Consistent elevation steps</strong> help users understand
              relationships between interface elements. Each step represents a
              layer in your interface, from flat surfaces to floating modals and
              tooltips.
            </p>
            <p>
              <strong>Light mode shadows</strong> use dark colors (typically
              black) at low opacity. They work well on white or light
              backgrounds and create clear separation without being too heavy.
            </p>
            <p>
              <strong>Dark mode shadows</strong> use lighter colors (white or
              light gray) with increased blur. This maintains visibility on dark
              backgrounds while preserving the sense of depth. Some designs use
              colored shadows in dark mode for additional visual interest.
            </p>
            <p>
              The generator automatically calculates each step by multiplying
              your base values. Higher steps get larger offsets, more blur, and
              slightly increased opacity to maintain visibility at greater
              elevations.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, helper, value, min, max, step = 1, onChange }) {
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
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {helper && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {helper}
        </p>
      )}
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
