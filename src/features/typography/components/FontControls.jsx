import { useState } from "react";
import { ChevronDown, Filter, Search, Trash2, Upload, X } from "lucide-react";

export function FontInfo({ font }) {
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

export function FontPicker({ fonts, selected, onSelect, onShowUploader }) {
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

export function FontUpload({
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
