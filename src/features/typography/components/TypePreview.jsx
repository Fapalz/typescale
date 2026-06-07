import { useState } from "react";
import { Lightbulb, Monitor, Pencil, Plus, Save, X } from "lucide-react";
import { fluidSizeAtViewport, formatSize } from "../lib/utils.js";

export function TypePreviewCard({
  item,
  settings,
  text,
  onRemove,
  onEditSemantic,
}) {
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

export function SemanticNameModal({ item, onSave, onClose }) {
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

export function InsertSizeButton({ label, onClick }) {
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
