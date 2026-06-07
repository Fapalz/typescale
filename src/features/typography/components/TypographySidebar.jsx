import { Palette, Settings, X } from "lucide-react";
import { fontOptions } from "../data/data.js";
import { FontInfo, FontPicker, FontUpload } from "./FontControls.jsx";
import {
  FluidTypographySettings,
  NumberInput,
  PresetButtons,
  PreviewModeControl,
  ScaleRatioControl,
  SidebarSectionButton,
  Toggle,
} from "./TypographyControls.jsx";

export function TypographySidebar({
  settings,
  updateSettings,
  expandedSections,
  onToggleSection,
  availableFonts,
  selectedFont,
  fontUploaderOpen,
  onOpenFontUploader,
  onCloseFontUploader,
  customFonts,
  uploadError,
  isUploadingFont,
  onUploadFont,
  onRemoveFont,
}) {
  return (
    <aside className="lg:flex-shrink-0">
      <div className="w-full lg:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <div className="p-6 space-y-6">
          <SidebarSectionButton
            id="typography"
            icon={Settings}
            title="Typography Settings"
            expanded={expandedSections.has("typography")}
            onToggle={onToggleSection}
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
                onChange={(value) => updateSettings({ baseFontSize: value })}
              />
              <ScaleRatioControl settings={settings} update={updateSettings} />
              <PreviewModeControl settings={settings} update={updateSettings} />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Family
                </label>
                <FontPicker
                  fonts={availableFonts}
                  selected={settings.fontFamily}
                  onSelect={(value) => updateSettings({ fontFamily: value })}
                  onShowUploader={onOpenFontUploader}
                />
                <FontInfo font={selectedFont} />
              </div>
              {fontUploaderOpen && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative">
                  <button
                    type="button"
                    onClick={onCloseFontUploader}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    title="Close font uploader"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <FontUpload
                    customFonts={customFonts}
                    uploadError={uploadError}
                    isUploading={isUploadingFont}
                    onUpload={onUploadFont}
                    onRemove={(font) => onRemoveFont(font, fontOptions[0])}
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
            onToggle={onToggleSection}
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
                  Adjusts line spacing for better readability across all text
                  sizes
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
                onChange={(checked) => updateSettings({ roundValues: checked })}
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
  );
}
