import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Info,
  Monitor,
  Settings,
} from "lucide-react";
import { previewTexts, ratioOptions } from "../data/data.js";
import { getFluidScaleRatios } from "../lib/utils.js";

export function ScaleRatioControl({ settings, update }) {
  const hasPreset = ratioOptions.some(
    ([, value]) => value === settings.scaleRatio,
  );
  const isCustom = settings.scaleRatioMode === "custom" || !hasPreset;

  return (
    <div className="space-y-3">
      <SelectInput
        label="Scale Ratio"
        value={isCustom ? "custom" : settings.scaleRatio}
        onChange={(value) =>
          value === "custom"
            ? update({
                scaleRatioMode: "custom",
                customRatio: settings.customRatio ?? settings.scaleRatio,
              })
            : update({
                scaleRatioMode: "preset",
                scaleRatio: Number(value),
                customRatio: Number(value),
              })
        }
        options={[
          ...ratioOptions.map(([name, value]) => ({
            value,
            label: `${name} (${value})`,
          })),
          { value: "custom", label: "Custom..." },
        ]}
      />
      {isCustom && (
        <>
          <NumberInput
            label="Custom Ratio"
            value={settings.customRatio}
            min={1}
            max={3}
            step={0.001}
            onChange={(value) =>
              update({
                scaleRatioMode: "custom",
                customRatio: value,
                scaleRatio: value,
              })
            }
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter custom ratio
          </p>
        </>
      )}
    </div>
  );
}

export function SidebarSectionButton({
  id,
  title,
  icon: Icon,
  expanded,
  onToggle,
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 border border-gray-200 dark:border-gray-700 mb-4"
    >
      <span className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-gray-900 dark:text-white">
          {title}
        </span>
      </span>
      {expanded ? (
        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  );
}

export function NumberInput({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  compact = false,
  onChange,
}) {
  return (
    <label className="block">
      <span
        className={`block font-medium text-gray-700 dark:text-gray-300 mb-2 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const parsed = Number.parseFloat(event.target.value);
            if (Number.isFinite(parsed)) onChange(parsed);
          }}
          className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-transparent transition-colors duration-200 ${
            compact
              ? "px-2 py-1 text-sm rounded focus:ring-1 focus:ring-blue-500"
              : "px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {suffix && (
          <span
            className={`absolute text-gray-500 dark:text-gray-400 pointer-events-none ${
              compact ? "right-2 top-1 text-xs" : "right-3 top-2 text-sm"
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function PresetButtons({ label, value, options, onChange }) {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              value === id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreviewModeControl({ settings, update }) {
  const previewValue =
    settings.previewText === "custom"
      ? "custom"
      : settings.previewTextContent || previewTexts[0].content;

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Preview Mode
      </span>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          ["single", "Single Text"],
          ["multiple", "Multiple Texts"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => update({ previewMode: id })}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              settings.previewMode === id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {settings.previewMode === "single" && (
        <>
          <div className="relative mb-2">
            <select
              value={previewValue}
              onChange={(event) => {
                if (event.target.value === "custom") {
                  update({ previewText: "custom" });
                  return;
                }
                update({
                  previewText: "preset",
                  previewTextContent: event.target.value,
                  customPreviewText: "",
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors duration-200"
            >
              <option value="The quick brown fox jumps over the lazy dog.">
                Default Text
              </option>
              {previewTexts
                .filter((text) => text.id !== "custom" && text.id !== "pangram")
                .map((text) => (
                  <option key={text.id} value={text.content}>
                    {text.label}
                  </option>
                ))}
              <option value="custom">Custom...</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>
          {settings.previewText === "custom" && (
            <textarea
              rows={3}
              value={settings.customPreviewText}
              onChange={(event) =>
                update({ customPreviewText: event.target.value })
              }
              placeholder="Enter your custom preview text..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-200"
            />
          )}
        </>
      )}
      {settings.previewMode === "multiple" && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Each text size will show contextually appropriate content: headlines
          for large text, paragraphs for body text, and captions for small text.
        </p>
      )}
    </div>
  );
}

export function Toggle({ title, description, checked, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

export function Toolbar({
  settings,
  updateSettings,
  onExport,
  onDevicePreview,
  onTemplatePreview,
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-6 sticky top-16 z-30 bg-gray-50 dark:bg-gray-800 py-4 -mx-6 px-6 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Units:
        </label>
        <select
          value={settings.unit}
          onChange={(event) => updateSettings({ unit: event.target.value })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="pt">pt</option>
        </select>
        {settings.fluidTypography && (
          <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline sm:max-w-none">
            Current:{" "}
            {settings.fluidPreviewMode === "min"
              ? `${settings.minViewport}px`
              : settings.fluidPreviewMode === "max"
                ? `${settings.maxViewport}px`
                : `${midViewport(settings)}px`}
          </span>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <IconButton
          icon={Monitor}
          label="Device Preview"
          onClick={onDevicePreview}
        />
        <IconButton
          icon={Eye}
          label="Template Preview"
          onClick={onTemplatePreview}
        />
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}

export function FluidTypographySettings({ settings, update }) {
  const ratios = getFluidScaleRatios(settings);
  const sliderLabel = fluidAdjustmentLabel(settings.fluidScaleStrategy);
  const baseRatioLabel = fluidBaseRatioLabel(settings.fluidScaleStrategy);

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Toggle
        title="Fluid Typography"
        description="Generate CSS clamp() values for responsive typography that scales smoothly across viewports"
        checked={settings.fluidTypography}
        onChange={(checked) => update({ fluidTypography: checked })}
      />
      {settings.fluidTypography && (
        <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Min Viewport"
              value={settings.minViewport}
              suffix="px"
              min={240}
              max={768}
              step={10}
              compact
              onChange={(value) => update({ minViewport: value })}
            />
            <NumberInput
              label="Max Viewport"
              value={settings.maxViewport}
              suffix="px"
              min={768}
              max={2000}
              step={10}
              compact
              onChange={(value) => update({ maxViewport: value })}
            />
          </div>
          <ScaleStrategyControl settings={settings} update={update} />
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {sliderLabel}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.001"
                  value={settings.fluidVariation}
                  onChange={(event) =>
                    update({ fluidVariation: parseFloat(event.target.value) })
                  }
                  className="w-full slider"
                  style={{
                    "--slider-progress": rangeProgress(
                      settings.fluidVariation,
                      0,
                      0.2,
                    ),
                  }}
                />
              </div>
              <input
                type="number"
                min="0"
                max="0.2"
                step="0.001"
                value={settings.fluidVariation}
                onChange={(event) =>
                  update({ fluidVariation: Number(event.target.value) })
                }
                className="w-20 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0</span>
              <span>{settings.fluidVariation.toFixed(3)}</span>
              <span>0.20</span>
            </div>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center">
            <RatioSummary label="Min Ratio" value={ratios.minRatio} />
            <RatioSummary label={baseRatioLabel} value={ratios.baseRatio} />
            <RatioSummary label="Max Ratio" value={ratios.maxRatio} />
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <p>
              <strong>Tip:</strong> {fluidStrategyTip(settings, ratios)}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Preview Mode
            </label>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-600">
              {[
                {
                  id: "min",
                  label: "Min",
                  title: `Mobile (${settings.minViewport}px)`,
                },
                {
                  id: "preferred",
                  label: "Mid",
                  title: `Middle viewport (${midViewport(settings)}px)`,
                },
                {
                  id: "max",
                  label: "Max",
                  title: `Desktop (${settings.maxViewport}px)`,
                },
              ].map(({ id, label, title }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => update({ fluidPreviewMode: id })}
                  title={title}
                  className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    settings.fluidPreviewMode === id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Switch between viewport sizes to see fluid scaling
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Interactive Simulator
              </span>
              <button
                type="button"
                onClick={() =>
                  update({ showFluidSimulator: !settings.showFluidSimulator })
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                  settings.showFluidSimulator
                    ? "bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.showFluidSimulator
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Show interactive viewport slider and animation controls
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectInput({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors duration-200"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
      </div>
    </label>
  );
}

function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

const fluidStrategies = [
  {
    id: "centered",
    title: "Centered",
    description: "Base ratio is the midpoint.",
    detail: "Scale decreases on mobile and increases on desktop.",
  },
  {
    id: "mobile-first",
    title: "Mobile First",
    description: "Base ratio on mobile.",
    detail: "Scale increases on larger screens.",
  },
  {
    id: "desktop-first",
    title: "Desktop First",
    description: "Base ratio on desktop.",
    detail: "Scale decreases on smaller screens.",
  },
];

function ScaleStrategyControl({ settings, update }) {
  return (
    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Scale Strategy
        </span>
        <span className="group relative inline-flex">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span className="pointer-events-none absolute left-1/2 top-5 z-20 hidden w-56 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-normal text-white shadow-lg group-hover:block">
            Choose how the base scale ratio maps across viewport sizes.
          </span>
        </span>
      </div>
      <div className="space-y-2">
        {fluidStrategies.map((strategy) => {
          const selected =
            (settings.fluidScaleStrategy || "centered") === strategy.id;
          const ratios = getFluidScaleRatios({
            ...settings,
            fluidScaleStrategy: strategy.id,
          });

          return (
            <button
              key={strategy.id}
              type="button"
              onClick={() => update({ fluidScaleStrategy: strategy.id })}
              className={`w-full text-left rounded-lg border p-3 transition-colors duration-200 ${
                selected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                    selected
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {strategy.title}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {strategy.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {strategy.detail}
                  </p>
                  <StrategyRatioLine ratios={ratios} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StrategyRatioLine({ ratios }) {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-3 text-[10px] text-gray-600 dark:text-gray-400 mb-1">
        <span>Mobile</span>
        <span className="text-center">Tablet</span>
        <span className="text-right">Desktop</span>
      </div>
      <div className="relative h-3">
        <div className="absolute left-2 right-2 top-1.5 h-px bg-gray-300 dark:bg-gray-600" />
        <RatioDot className="left-0 bg-blue-500" />
        <RatioDot className="left-1/2 -translate-x-1/2 bg-purple-500" />
        <RatioDot className="right-0 bg-pink-500" />
      </div>
      <div className="grid grid-cols-3 text-[11px] font-mono">
        <span className="text-blue-600 dark:text-blue-400">
          {ratios.minRatio.toFixed(3)}
        </span>
        <span className="text-center text-purple-600 dark:text-purple-400">
          {ratios.tabletRatio.toFixed(3)}
        </span>
        <span className="text-right text-pink-600 dark:text-pink-400">
          {ratios.maxRatio.toFixed(3)}
        </span>
      </div>
    </div>
  );
}

function RatioDot({ className }) {
  return (
    <span
      className={`absolute top-0 h-3 w-3 rounded-full shadow-sm ${className}`}
    />
  );
}

function RatioSummary({ label, value }) {
  return (
    <div className="px-2 py-3 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
        {value.toFixed(3)}
      </div>
    </div>
  );
}

function fluidAdjustmentLabel(strategy = "centered") {
  if (strategy === "mobile-first") return "Desktop Increase";
  if (strategy === "desktop-first") return "Mobile Reduction";
  return "Scale Variation";
}

function fluidBaseRatioLabel(strategy = "centered") {
  if (strategy === "mobile-first") return "Base Ratio (Mobile)";
  if (strategy === "desktop-first") return "Base Ratio (Desktop)";
  return "Base Ratio";
}

function rangeProgress(value, min, max) {
  const range = Math.max(0.001, max - min);
  const progress = ((Number(value) - min) / range) * 100;
  return `${Math.min(100, Math.max(0, progress))}%`;
}

function fluidStrategyTip(settings, ratios) {
  if (ratios.strategy === "mobile-first") {
    return `In Mobile First mode, your mobile ratio (${ratios.baseRatio.toFixed(
      3,
    )}) remains unchanged. Larger screens increase up to ${ratios.maxRatio.toFixed(
      3,
    )}.`;
  }
  if (ratios.strategy === "desktop-first") {
    return `In Desktop First mode, your desktop ratio (${ratios.baseRatio.toFixed(
      3,
    )}) remains unchanged. Smaller screens reduce down to ${ratios.minRatio.toFixed(
      3,
    )}.`;
  }
  return `In Centered mode, your base ratio (${settings.scaleRatio}) is the midpoint between ${ratios.minRatio.toFixed(
    3,
  )} and ${ratios.maxRatio.toFixed(3)}.`;
}

function midViewport(settings) {
  const minViewport = Number(settings.minViewport) || 320;
  const maxViewport = Number(settings.maxViewport) || 1200;
  return Math.round((minViewport + maxViewport) / 2);
}
