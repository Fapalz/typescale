import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Info,
  Laptop,
  Lightbulb,
  Monitor,
  Palette,
  Pause,
  Pencil,
  Play,
  Plus,
  Save,
  Search,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { fontOptions, previewTexts, ratioOptions } from "../data.js";
import {
  calculateTypeScale,
  formatSize,
  getPreviewText,
  getFluidScaleRatios,
  insertTypeScaleSize,
  recalculateCustomTypeScale,
  removeCustomTypeSize,
} from "../utils.js";
import { ExportModal } from "./ExportModal.jsx";
import { DevicePreviewModal, TemplatePreviewModal } from "./PreviewModals.jsx";
import { Footer, MainAccordions } from "./ToolLauncher.jsx";

const initialSettings = {
  baseFontSize: 16,
  scaleRatio: 1.25,
  customRatio: 1.25,
  previewText: "pangram",
  previewTextContent: previewTexts[0].content,
  customPreviewText: "",
  fontFamily: "Inter, sans-serif",
  unit: "px",
  roundValues: false,
  protectSmallText: false,
  lineHeightPreset: "normal",
  letterSpacingPreset: "normal",
  customLineHeight: 1.5,
  customLetterSpacing: 0,
  previewMode: "single",
  fluidTypography: false,
  fluidPreviewMode: "preferred",
  showFluidSimulator: false,
  minViewport: 320,
  maxViewport: 1200,
  fluidScaleStrategy: "centered",
  fluidVariation: 0.067,
  customSizes: [],
};

export function TypographyTool({ onNavigate }) {
  const [settings, setSettings] = useState(initialSettings);
  const [exportOpen, setExportOpen] = useState(false);
  const [devicePreviewOpen, setDevicePreviewOpen] = useState(false);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);
  const [semanticEditor, setSemanticEditor] = useState(null);
  const [semanticNames, setSemanticNames] = useState({});
  const [customScale, setCustomScale] = useState(null);
  const [expandedSections, setExpandedSections] = useState(
    () => new Set(["typography", "appearance"]),
  );
  const [customFonts, setCustomFonts] = useState([]);
  const [fontUploaderOpen, setFontUploaderOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingFont, setIsUploadingFont] = useState(false);
  const typeScale = useMemo(
    () =>
      (customScale
        ? recalculateCustomTypeScale(customScale, settings)
        : calculateTypeScale(settings)
      ).map((item) => ({
        ...item,
        label: semanticNames[item.id] ?? item.label,
      })),
    [customScale, settings, semanticNames],
  );
  const availableFonts = useMemo(
    () => [...fontOptions, ...customFonts],
    [customFonts],
  );
  const selectedFont =
    availableFonts.find((font) => font.value === settings.fontFamily) ??
    fontOptions[0];

  const updateSettings = (patch) =>
    setSettings((current) => ({ ...current, ...patch }));

  const toggleSection = (id) => {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addCustomSize = (targetId, position) => {
    const { scale } = insertTypeScaleSize(
      customScale ?? typeScale,
      targetId,
      position,
      settings,
    );
    setCustomScale(scale);
  };

  const removeCustomSize = (id) => {
    setCustomScale((current) => removeCustomTypeSize(current ?? typeScale, id));
  };

  const uploadFont = async (file, preferredName = "") => {
    if (!file) return;
    if (!/\.(woff2?|ttf|otf)$/i.test(file.name)) {
      setUploadError("Supports .woff2, .woff, .ttf, and .otf font files.");
      return;
    }
    setUploadError("");
    setIsUploadingFont(true);
    try {
      const name = preferredName.trim() || file.name.replace(/\.[^/.]+$/, "");
      const value = `"${name}", sans-serif`;
      const buffer = await file.arrayBuffer();
      const face = new FontFace(name, buffer);
      await face.load();
      document.fonts.add(face);
      setCustomFonts((fonts) => [
        ...fonts,
        {
          label: name,
          value,
          tag: "Custom",
          bestFor: "Uploaded custom font",
          usage:
            "Available in previews and exports during this browser session",
          pairs: "Use with your chosen fallback stack",
          isCustom: true,
        },
      ]);
      updateSettings({ fontFamily: value });
    } finally {
      setIsUploadingFont(false);
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          <aside className="lg:flex-shrink-0">
            <div className="w-full lg:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
              <div className="p-6 space-y-6">
                <SidebarSectionButton
                  id="typography"
                  icon={Settings}
                  title="Typography Settings"
                  expanded={expandedSections.has("typography")}
                  onToggle={toggleSection}
                />
                {expandedSections.has("typography") && (
                  <div className="space-y-6 pl-2">
                    <NumberInput
                      label="Base Font Size"
                      value={settings.baseFontSize}
                      suffix="px"
                      min={8}
                      max={32}
                      step={0.1}
                      onChange={(value) =>
                        updateSettings({ baseFontSize: value })
                      }
                    />
                    <ScaleRatioControl
                      settings={settings}
                      update={updateSettings}
                    />
                    <PreviewModeControl
                      settings={settings}
                      update={updateSettings}
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Font Family
                      </label>
                      <FontPicker
                        fonts={availableFonts}
                        selected={settings.fontFamily}
                        onSelect={(value) =>
                          updateSettings({ fontFamily: value })
                        }
                        onShowUploader={() => setFontUploaderOpen(true)}
                      />
                      <FontInfo font={selectedFont} />
                    </div>
                    {fontUploaderOpen && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative">
                        <button
                          type="button"
                          onClick={() => setFontUploaderOpen(false)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                          title="Close font uploader"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <FontUpload
                          customFonts={customFonts}
                          uploadError={uploadError}
                          isUploading={isUploadingFont}
                          onUpload={async (file, name) => {
                            await uploadFont(file, name);
                            setFontUploaderOpen(false);
                          }}
                          onRemove={(font) => {
                            setCustomFonts((fonts) =>
                              fonts.filter((item) => item.value !== font.value),
                            );
                            if (settings.fontFamily === font.value) {
                              updateSettings({
                                fontFamily: fontOptions[0].value,
                              });
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                <SidebarSectionButton
                  id="appearance"
                  icon={Palette}
                  title="Appearance Settings"
                  expanded={expandedSections.has("appearance")}
                  onToggle={toggleSection}
                />
                {expandedSections.has("appearance") && (
                  <div className="space-y-6 pl-2">
                    <div className="space-y-2">
                      <PresetButtons
                        label="Line Height Preset"
                        value={settings.lineHeightPreset}
                        options={[
                          ["tight", "Tight"],
                          ["normal", "Normal"],
                          ["relaxed", "Relaxed"],
                          ["custom", "Custom"],
                        ]}
                        onChange={(value) =>
                          updateSettings({ lineHeightPreset: value })
                        }
                      />
                      {settings.lineHeightPreset === "custom" && (
                        <NumberInput
                          label="Custom Line Height"
                          value={settings.customLineHeight}
                          min={1}
                          max={3}
                          step={0.1}
                          onChange={(value) =>
                            updateSettings({ customLineHeight: value })
                          }
                        />
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Adjusts line spacing for better readability across all
                        text sizes
                      </p>
                    </div>
                    <div className="space-y-2">
                      <PresetButtons
                        label="Letter Spacing Preset"
                        value={settings.letterSpacingPreset}
                        options={[
                          ["tight", "Tight"],
                          ["normal", "Normal"],
                          ["loose", "Loose"],
                          ["custom", "Custom"],
                        ]}
                        onChange={(value) =>
                          updateSettings({ letterSpacingPreset: value })
                        }
                      />
                      {settings.letterSpacingPreset === "custom" && (
                        <NumberInput
                          label="Custom Letter Spacing (em)"
                          value={settings.customLetterSpacing}
                          min={-0.1}
                          max={0.2}
                          step={0.01}
                          onChange={(value) =>
                            updateSettings({ customLetterSpacing: value })
                          }
                        />
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Adjusts character spacing for different design styles
                      </p>
                    </div>
                    <Toggle
                      title="Round Values"
                      description="Rounds font sizes to whole numbers instead of decimals"
                      checked={settings.roundValues}
                      onChange={(checked) =>
                        updateSettings({ roundValues: checked })
                      }
                    />
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Toggle
                        title="Protect Small Text"
                        description="Keeps sizes below Body from dropping too quickly by stepping down 1px at a time when the ratio would make them too small"
                        checked={settings.protectSmallText}
                        onChange={(checked) =>
                          updateSettings({ protectSmallText: checked })
                        }
                      />
                    </div>
                    <FluidTypographySettings
                      settings={settings}
                      update={updateSettings}
                    />
                  </div>
                )}
              </div>
            </div>
          </aside>
          <section className="flex-1 flex flex-col">
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-6 transition-colors duration-200">
              <Toolbar
                settings={settings}
                updateSettings={updateSettings}
                onExport={() => setExportOpen(true)}
                onDevicePreview={() => setDevicePreviewOpen(true)}
                onTemplatePreview={() => setTemplatePreviewOpen(true)}
              />
              {settings.fluidTypography && settings.showFluidSimulator && (
                <FluidSimulator settings={settings} typeScale={typeScale} />
              )}
              <div className="space-y-2">
                <div className="group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    <InsertSizeButton
                      label="Add Larger Size"
                      onClick={() => addCustomSize(typeScale[0]?.id, "above")}
                    />
                  </div>
                </div>
                {typeScale.map((item, index) => (
                  <div key={item.id} className="group">
                    <TypePreviewCard
                      item={item}
                      settings={settings}
                      text={getPreviewText(settings, item)}
                      onEditSemantic={() => setSemanticEditor(item)}
                      onRemove={
                        item.isCustom ? () => removeCustomSize(item.id) : null
                      }
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                      <InsertSizeButton
                        label={
                          index === typeScale.length - 1
                            ? "Add Smaller Size"
                            : "Add Size Here"
                        }
                        onClick={() => {
                          addCustomSize(
                            item.id,
                            index === typeScale.length - 1
                              ? "below"
                              : "between",
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6">
              <MainAccordions />
            </div>
          </section>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
      {exportOpen && (
        <ExportModal
          settings={settings}
          typeScale={typeScale}
          onClose={() => setExportOpen(false)}
        />
      )}
      {devicePreviewOpen && (
        <DevicePreviewModal
          settings={settings}
          typeScale={typeScale}
          onClose={() => setDevicePreviewOpen(false)}
        />
      )}
      {templatePreviewOpen && (
        <TemplatePreviewModal
          settings={settings}
          typeScale={typeScale}
          onClose={() => setTemplatePreviewOpen(false)}
        />
      )}
      {semanticEditor && (
        <SemanticNameModal
          item={semanticEditor}
          onClose={() => setSemanticEditor(null)}
          onSave={(label) => {
            setSemanticNames((names) => ({
              ...names,
              [semanticEditor.id]: label,
            }));
            setSemanticEditor(null);
          }}
        />
      )}
    </>
  );
}

function ScaleRatioControl({ settings, update }) {
  const hasPreset = ratioOptions.some(
    ([, value]) => value === settings.scaleRatio,
  );

  return (
    <div className="space-y-3">
      <SelectInput
        label="Scale Ratio"
        value={hasPreset ? settings.scaleRatio : "custom"}
        onChange={(value) =>
          value === "custom"
            ? update({ customRatio: settings.scaleRatio })
            : update({ scaleRatio: Number(value), customRatio: Number(value) })
        }
        options={[
          ...ratioOptions.map(([name, value]) => ({
            value,
            label: `${name} (${value})`,
          })),
          { value: "custom", label: "Custom..." },
        ]}
      />
      {!hasPreset && (
        <>
          <NumberInput
            label="Custom Ratio"
            value={settings.customRatio}
            min={1}
            max={3}
            step={0.001}
            onChange={(value) =>
              update({ customRatio: value, scaleRatio: value })
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

function SidebarSectionButton({ id, title, icon: Icon, expanded, onToggle }) {
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

function NumberInput({
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

function PresetButtons({ label, value, options, onChange }) {
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

function PreviewModeControl({ settings, update }) {
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

function Toolbar({
  settings,
  updateSettings,
  onExport,
  onDevicePreview,
  onTemplatePreview,
}) {
  return (
    <div className="flex items-center justify-between mb-6 sticky top-16 z-30 bg-gray-50 dark:bg-gray-800 py-4 -mx-6 px-6 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-4">
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current:{" "}
            {settings.fluidPreviewMode === "min"
              ? `${settings.minViewport}px`
              : settings.fluidPreviewMode === "max"
                ? `${settings.maxViewport}px`
                : `${midViewport(settings)}px`}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
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

function FontInfo({ font }) {
  const isCustom = font.isCustom;
  return (
    <div
      className={`mt-3 p-3 rounded-lg border ${
        isCustom
          ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
          : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      }`}
    >
      <div className="space-y-2">
        <div>
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isCustom
                ? "text-purple-800 dark:text-purple-200"
                : "text-blue-800 dark:text-blue-200"
            }`}
          >
            {isCustom ? "Custom Font" : "Best For"}
          </span>
          <p
            className={`text-sm ${
              isCustom
                ? "text-purple-700 dark:text-purple-300"
                : "text-blue-700 dark:text-blue-300"
            }`}
          >
            {font.bestFor}
          </p>
        </div>
        <div>
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isCustom
                ? "text-purple-800 dark:text-purple-200"
                : "text-blue-800 dark:text-blue-200"
            }`}
          >
            {isCustom ? "Analysis" : "Usage"}
          </span>
          <p
            className={`text-sm ${
              isCustom
                ? "text-purple-700 dark:text-purple-300"
                : "text-blue-700 dark:text-blue-300"
            }`}
          >
            {font.recommendation || font.usage}
          </p>
        </div>
        <div>
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isCustom
                ? "text-purple-800 dark:text-purple-200"
                : "text-blue-800 dark:text-blue-200"
            }`}
          >
            {isCustom ? "Metrics" : "Pairs Well With"}
          </span>
          <p
            className={`text-sm ${
              isCustom
                ? "text-purple-700 dark:text-purple-300"
                : "text-blue-700 dark:text-blue-300"
            }`}
          >
            {font.pairsWith?.join(", ") || font.pairs}
          </p>
        </div>
      </div>
    </div>
  );
}

function FontPicker({ fonts, selected, onSelect, onShowUploader }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [
    ["all", "All Categories"],
    ["sans-serif", "Sans Serif"],
    ["serif", "Serif"],
    ["display", "Display"],
    ["monospace", "Monospace"],
    ["script", "Script"],
    ["custom", "Custom Fonts"],
  ];
  const selectedFont = fonts.find((font) => font.value === selected);
  const filtered = fonts.filter((font) => {
    const fontCategory = getFontCategory(font);
    const categoryMatches =
      category === "all" ||
      (category === "custom" ? font.isCustom : fontCategory === category);
    const searchMatches =
      !search.trim() ||
      [font.label, font.name, font.bestFor, font.recommendation, font.usage]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(search.trim().toLowerCase()),
        );
    return categoryMatches && searchMatches;
  });
  const grouped = filtered.reduce((groups, font) => {
    const key = font.isCustom ? "custom" : getFontCategory(font);
    groups[key] ??= [];
    groups[key].push(font);
    return groups;
  }, {});

  const selectFont = (value) => {
    onSelect(value);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
      >
        <span className="flex-1 text-left">
          <span className="flex items-center space-x-2">
            <span className="font-medium">
              {getFontName(selectedFont) || "Select Font"}
            </span>
            {selectedFont?.isVariable && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">
                Variable
              </span>
            )}
            {selectedFont?.isCustom && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">
                Custom
              </span>
            )}
          </span>
          {selectedFont && (
            <span
              style={{ fontFamily: selectedFont.value }}
              className="block text-sm text-gray-500 dark:text-gray-400 mt-1 truncate"
            >
              The quick brown fox jumps
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close font menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-96 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  {categories
                    .filter(([id]) => id !== "custom" || hasCustomFont(fonts))
                    .map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  onShowUploader();
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Custom Font</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {Object.entries(grouped).map(([group, groupFonts]) => (
                <div key={group}>
                  {category === "all" && groupFonts.length > 0 && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {categoryLabel(group)} ({groupFonts.length})
                      </h4>
                    </div>
                  )}
                  {groupFonts.map((font) => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => selectFont(font.value)}
                      className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                        selected === font.value
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {getFontName(font)}
                            </span>
                            {font.isVariable && (
                              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">
                                Variable
                              </span>
                            )}
                          </span>
                          <span
                            style={{ fontFamily: font.value }}
                            className="block text-sm text-gray-600 dark:text-gray-300 mb-1 truncate"
                          >
                            The quick brown fox jumps over the lazy dog
                          </span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                            {font.bestFor}
                          </span>
                        </span>
                        {selected === font.value && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No fonts found matching "{search}"
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FontUpload({
  customFonts,
  uploadError,
  isUploading,
  onUpload,
  onRemove,
}) {
  const [fontName, setFontName] = useState("");
  const [dragging, setDragging] = useState(false);
  const handleUpload = (file) => {
    onUpload(file, fontName);
    setFontName("");
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Name (Optional)
        </span>
        <input
          value={fontName}
          onChange={(event) => setFontName(event.target.value)}
          placeholder="e.g., My Custom Font"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
          Leave empty to use filename
        </span>
      </label>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleUpload(event.dataTransfer.files?.[0]);
        }}
        className={`block border-2 border-dashed rounded-lg p-4 cursor-pointer ${
          dragging
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept=".woff2,.woff,.ttf,.otf,font/*"
          onChange={(event) => handleUpload(event.target.files?.[0])}
          className="hidden"
        />
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Upload className="w-4 h-4 text-blue-600" />
          {isUploading
            ? "Analyzing font..."
            : "Upload Custom Font - Drop font file here or click to browse"}
        </span>
        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supports .woff2, .woff, .ttf, .otf
        </span>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Close font uploader
      </p>
      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
      )}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Font Upload Tips
        </p>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 mt-1">
          <li>WOFF2 format recommended for best performance</li>
          <li>
            Uploaded fonts work in previews and exports during this session
          </li>
          <li>Use the generated font-family value in your implementation</li>
          <li>Custom Font Active</li>
        </ul>
      </div>
      {customFonts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Custom Fonts
          </h4>
          {customFonts.map((font) => (
            <div
              key={font.value}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <span
                className="text-sm text-gray-900 dark:text-white"
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </span>
              <button
                type="button"
                onClick={() => onRemove(font)}
                title="Remove custom font"
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getFontName(font) {
  return font?.name || font?.label;
}

function getFontCategory(font) {
  if (font?.category) return font.category;
  if (font?.isCustom) return "custom";
  if (font?.tag === "Serif") return "serif";
  if (font?.tag === "Display") return "display";
  if (font?.tag === "Mono") return "monospace";
  if (font?.tag === "Script") return "script";
  return "sans-serif";
}

function categoryLabel(category) {
  const labels = {
    "sans-serif": "Sans Serif",
    serif: "Serif",
    display: "Display",
    monospace: "Monospace",
    script: "Script",
    custom: "Custom Fonts",
  };
  return labels[category] || category;
}

function hasCustomFont(fonts) {
  return fonts.some((font) => font.isCustom);
}

function TypePreviewCard({ item, settings, text, onRemove, onEditSemantic }) {
  const displaySize =
    settings.fluidTypography && item.clampValue
      ? resolvePreviewFontSize(item, settings)
      : `${item.fontSize}px`;
  const fluidRange =
    settings.fluidTypography && item.clampValue
      ? getFluidRange(item, settings)
      : null;
  const currentSize = fluidRange
    ? formatSize(fluidRange.current, settings.unit, settings.baseFontSize)
    : formatSize(item.fontSize, settings.unit, settings.baseFontSize);
  const rangeProgress = fluidRange
    ? Math.min(
        100,
        Math.max(
          0,
          ((fluidRange.current - fluidRange.min) /
            Math.max(0.01, fluidRange.max - fluidRange.min)) *
            100,
        ),
      )
    : 0;

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {item.label}
            </h3>
            <button
              type="button"
              onClick={onEditSemantic}
              className="p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              title="Edit semantic name"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
          <p className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {fluidRange ? (
                <span className="flex items-center space-x-2">
                  <Monitor className="w-3 h-3 text-blue-500" />
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {formatSize(
                      fluidRange.min,
                      settings.unit,
                      settings.baseFontSize,
                    )}{" "}
                    -{" "}
                    {formatSize(
                      fluidRange.max,
                      settings.unit,
                      settings.baseFontSize,
                    )}
                  </span>
                  <span className="text-gray-400">(now: {currentSize})</span>
                </span>
              ) : (
                <span>Size: {currentSize}</span>
              )}
            </span>
            <span>Line Height: {item.lineHeight}</span>
            <span>Letter Spacing: {item.letterSpacing}em</span>
          </p>
          {settings.fluidTypography && item.clampValue && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-700 dark:text-blue-300 font-mono break-all">
                font-size: {item.clampValue}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
            {item.weight}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              title="Remove this size"
              className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {fluidRange && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Fluid Range Visualization</span>
            <span>
              {Math.round(
                ((fluidRange.max - fluidRange.min) /
                  Math.max(0.01, fluidRange.preferred)) *
                  100,
              )}
              % variation
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${rangeProgress}%` }}
            />
            <div
              className="absolute top-0 w-1 h-full bg-blue-800 transition-all duration-300"
              style={{ left: `${rangeProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {formatSize(fluidRange.min, settings.unit, settings.baseFontSize)}
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {currentSize}
            </span>
            <span>
              {formatSize(fluidRange.max, settings.unit, settings.baseFontSize)}
            </span>
          </div>
        </div>
      )}
      <p
        className="mt-4 text-gray-900 dark:text-white whitespace-pre-line transition-[font-size,line-height,letter-spacing,font-weight] duration-300 ease-out"
        style={{
          fontFamily: item.fontFamily,
          fontSize: displaySize,
          lineHeight: item.lineHeight,
          letterSpacing: `${item.letterSpacing}em`,
          fontWeight: item.weight,
        }}
      >
        {text}
      </p>
    </article>
  );
}

function SemanticNameModal({ item, onSave, onClose }) {
  const [custom, setCustom] = useState(item.semanticName || "");
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const suggestions = semanticSuggestions(item);
  const canSave = custom.trim() || selectedSuggestion;
  const save = () => {
    const name = selectedSuggestion || custom.trim();
    if (name) onSave(name);
  };
  const selectSuggestion = (name) => {
    setSelectedSuggestion(name);
    setCustom("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg shadow-xl p-4 w-96 max-w-[90vw]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Edit Semantic Name
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Currently: {item.label}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={save}
                disabled={!canSave}
                className="p-1 text-green-600 hover:text-green-700 disabled:text-gray-400 transition-colors duration-200"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="semantic-name"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Custom Name
            </label>
            <input
              id="semantic-name"
              type="text"
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value);
                setSelectedSuggestion("");
              }}
              placeholder="e.g., hero, button-text, card-title"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Suggested Names
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    onClick={() => selectSuggestion(suggestion.value)}
                    className={`text-left p-2 text-xs rounded-lg border transition-colors duration-200 ${
                      selectedSuggestion === suggestion.value
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title={suggestion.description}
                  >
                    <div className="font-medium">{suggestion.label}</div>
                    <div className="text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function semanticSuggestions(item) {
  const suggestions = [
    {
      value: "hero",
      label: "Hero",
      category: "display",
      description: "Main hero/banner text",
    },
    {
      value: "display",
      label: "Display",
      category: "display",
      description: "Large display text",
    },
    {
      value: "headline",
      label: "Headline",
      category: "display",
      description: "Primary headlines",
    },
    {
      value: "title",
      label: "Title",
      category: "heading",
      description: "Page/section titles",
    },
    {
      value: "subtitle",
      label: "Subtitle",
      category: "heading",
      description: "Secondary titles",
    },
    {
      value: "section-header",
      label: "Section Header",
      category: "heading",
      description: "Section headings",
    },
    {
      value: "card-title",
      label: "Card Title",
      category: "heading",
      description: "Card/component titles",
    },
    {
      value: "body",
      label: "Body",
      category: "body",
      description: "Main body text",
    },
    {
      value: "lead",
      label: "Lead",
      category: "body",
      description: "Lead/intro paragraphs",
    },
    {
      value: "description",
      label: "Description",
      category: "body",
      description: "Descriptions and details",
    },
    {
      value: "quote",
      label: "Quote",
      category: "body",
      description: "Blockquotes and testimonials",
    },
    {
      value: "button",
      label: "Button",
      category: "ui",
      description: "Button text",
    },
    {
      value: "link",
      label: "Link",
      category: "ui",
      description: "Link text",
    },
    {
      value: "label",
      label: "Label",
      category: "ui",
      description: "Form labels",
    },
    {
      value: "input",
      label: "Input",
      category: "ui",
      description: "Input field text",
    },
    {
      value: "nav",
      label: "Navigation",
      category: "ui",
      description: "Navigation items",
    },
    {
      value: "breadcrumb",
      label: "Breadcrumb",
      category: "ui",
      description: "Breadcrumb navigation",
    },
    {
      value: "caption",
      label: "Caption",
      category: "small",
      description: "Image captions",
    },
    {
      value: "metadata",
      label: "Metadata",
      category: "small",
      description: "Dates, authors, tags",
    },
    {
      value: "footnote",
      label: "Footnote",
      category: "small",
      description: "Footnotes and fine print",
    },
    {
      value: "overline",
      label: "Overline",
      category: "small",
      description: "Overline text",
    },
    {
      value: "badge",
      label: "Badge",
      category: "small",
      description: "Status badges and pills",
    },
    {
      value: "tooltip",
      label: "Tooltip",
      category: "small",
      description: "Tooltip text",
    },
  ];

  if (item.id.includes("display"))
    return suggestions.filter(
      (suggestion) => suggestion.category === "display",
    );
  if (item.id.startsWith("h"))
    return suggestions.filter(
      (suggestion) => suggestion.category === "heading",
    );
  if (item.id.includes("body") || item.id.includes("text"))
    return suggestions.filter((suggestion) => suggestion.category === "body");
  if (item.id.includes("caption") || item.id.includes("overline"))
    return suggestions.filter((suggestion) => suggestion.category === "small");
  return suggestions.filter((suggestion) => suggestion.category === "ui");
}

function colorPresetClasses(preset) {
  if (preset === "dark") return "bg-gray-950 text-white";
  if (preset === "contrast") return "bg-white text-black border-black";
  if (preset === "warm") return "bg-orange-50 text-gray-950";
  return "bg-white dark:bg-gray-900";
}

function textColorClass(preset) {
  if (preset === "dark") return "text-white";
  if (preset === "contrast") return "text-black";
  return "text-gray-950 dark:text-white";
}

function InsertSizeButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
    >
      <Plus className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function resolvePreviewFontSize(item, settings) {
  if (settings.fluidPreviewMode === "min") return `${item.minFontSize}px`;
  if (settings.fluidPreviewMode === "max") return `${item.maxFontSize}px`;
  if (item.minFontSize && item.maxFontSize) {
    return `${fluidSizeAtViewport(item, settings, midViewport(settings))}px`;
  }
  return item.fontSize ? `${item.fontSize}px` : item.clampValue;
}

function getFluidRange(item, settings) {
  if (!item.minFontSize || !item.maxFontSize) return null;
  const current = Number.parseFloat(resolvePreviewFontSize(item, settings));
  return {
    min: item.minFontSize,
    preferred: item.fontSize,
    max: item.maxFontSize,
    current,
  };
}

function midViewport(settings) {
  const minViewport = Number(settings.minViewport) || 320;
  const maxViewport = Number(settings.maxViewport) || 1200;
  return Math.round((minViewport + maxViewport) / 2);
}

function Toggle({ title, description, checked, onChange }) {
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

function fluidStrategyName(strategy = "centered") {
  if (strategy === "mobile-first") return "Mobile First";
  if (strategy === "desktop-first") return "Desktop First";
  return "Centered";
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

function FluidTypographySettings({ settings, update }) {
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

function FluidSimulator({ settings, typeScale }) {
  const [viewport, setViewport] = useState(settings.minViewport);
  const [isAnimating, setIsAnimating] = useState(false);
  const [duration, setDuration] = useState(2000);
  const minViewport = Number(settings.minViewport) || 320;
  const maxViewport = Number(settings.maxViewport) || 1200;
  const range = Math.max(1, maxViewport - minViewport);
  const progress = Math.min(1, Math.max(0, (viewport - minViewport) / range));
  const { minRatio, maxRatio } = getFluidScaleRatios(settings);
  const ratio = minRatio + (maxRatio - minRatio) * progress;
  const previewItems = [
    typeScale.find((item) => item.id === "h1") ?? typeScale[0],
    typeScale.find((item) => item.id === "h2") ?? typeScale[1],
    typeScale.find((item) => item.id === "h3") ?? typeScale[2],
    typeScale.find((item) => item.id === "body") ?? typeScale[6],
    typeScale.find((item) => item.id === "caption") ?? typeScale.at(-2),
  ].filter(Boolean);
  const devices = [
    ["Mobile", 375, Smartphone],
    ["Tablet", 768, Tablet],
    ["Laptop", 1024, Laptop],
    ["Desktop", 1440, Monitor],
  ].filter(([, width]) => width >= minViewport && width <= maxViewport);

  useEffect(() => {
    setViewport((current) =>
      Math.min(maxViewport, Math.max(minViewport, current)),
    );
  }, [minViewport, maxViewport]);

  useEffect(() => {
    if (!isAnimating) return undefined;
    const step = Math.max(8, range / (duration / 60));
    const interval = window.setInterval(() => {
      setViewport((current) => {
        const next = current + step;
        return next > maxViewport ? minViewport : next;
      });
    }, 60);
    return () => window.clearInterval(interval);
  }, [duration, isAnimating, maxViewport, minViewport, range]);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            <span>Fluid Typography Simulator</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Watch your typography scale smoothly across viewport sizes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsAnimating((value) => !value)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              isAnimating
                ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30"
                : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30"
            }`}
          >
            {isAnimating ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isAnimating ? "Pause" : "Animate"}</span>
          </button>
          <select
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value={1000}>Fast</option>
            <option value={2000}>Normal</option>
            <option value={3000}>Slow</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Viewport:
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.round(viewport)}px
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({viewportLabel(viewport)})
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Scale Ratio:{" "}
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {ratio.toFixed(3)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={minViewport}
            max={maxViewport}
            step="1"
            value={viewport}
            onChange={(event) => setViewport(Number(event.target.value))}
            className="w-full slider"
            style={{ "--slider-progress": `${progress * 100}%` }}
            disabled={isAnimating}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{minViewport}px (Mobile)</span>
            <span>
              {Math.round((minViewport + maxViewport) / 2)}px (Tablet)
            </span>
            <span>{maxViewport}px (Desktop)</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {devices.map(([label, width, Icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => setViewport(width)}
              disabled={isAnimating}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                Math.abs(viewport - width) < 20
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              } ${isAnimating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
          <span>Live Preview</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (Typography scales as viewport changes)
          </span>
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          {previewItems.map((item) => {
            const current = fluidSizeAtViewport(item, settings, viewport);
            const min = fluidSizeAtViewport(item, settings, minViewport);
            const max = fluidSizeAtViewport(item, settings, maxViewport);
            const itemProgress =
              ((current - min) / Math.max(0.01, max - min)) * 100;
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {Math.round(min)}px - {Math.round(max)}px
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      (now: {Math.round(current)}px)
                    </span>
                  </div>
                </div>
                <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${itemProgress}%` }}
                  />
                  <div
                    className="absolute top-0 w-0.5 h-full bg-blue-800 transition-all duration-300"
                    style={{ left: `${itemProgress}%` }}
                  />
                </div>
                <div
                  className="text-gray-900 dark:text-white transition-[font-size,line-height,letter-spacing,font-weight] duration-300 ease-out"
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: `${current}px`,
                    lineHeight: item.lineHeight,
                    fontWeight: item.weight,
                    letterSpacing: `${item.letterSpacing}em`,
                  }}
                >
                  {simulatorText(item)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            How Fluid Typography Works
          </h5>
          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              <strong>CSS clamp():</strong> Sets minimum, preferred, and maximum
              font sizes
            </p>
            <p>
              <strong>Viewport scaling:</strong> Font size changes smoothly
              between {minViewport}px and {maxViewport}px
            </p>
            <p>
              <strong>Scale strategy:</strong>{" "}
              {fluidStrategyName(settings.fluidScaleStrategy)} maps your base
              ratio to mobile, desktop, or the midpoint
            </p>
            <p>
              <strong>Proportional scaling:</strong> All text sizes maintain
              their relative relationships
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function fluidSizeAtViewport(item, settings, viewport) {
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

function simulatorText(item) {
  if (item.id === "h1") return "Fluid Typography in Action";
  if (item.id === "h2") return "Watch Text Scale Smoothly";
  if (item.id === "h3") return "Responsive Design Made Easy";
  if (item.id === "caption") return "Caption text scales proportionally";
  return "This body text demonstrates how fluid typography adapts to different viewport sizes, maintaining optimal readability across all devices.";
}

function viewportLabel(viewport) {
  if (viewport <= 480) return "Mobile";
  if (viewport <= 768) return "Small Tablet";
  if (viewport <= 1024) return "Tablet/Laptop";
  return "Desktop";
}
