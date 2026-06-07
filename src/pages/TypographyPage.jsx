import { useMemo, useState } from "react";
import { fontOptions, previewTexts } from "../features/typography/data/data.js";
import {
  calculateTypeScale,
  insertTypeScaleSize,
  recalculateCustomTypeScale,
  removeCustomTypeSize,
} from "../features/typography/lib/utils.js";
import { FluidSimulator } from "../features/typography/components/FluidSimulator.jsx";
import { SemanticNameModal } from "../features/typography/components/TypePreview.jsx";
import { Toolbar } from "../features/typography/components/TypographyControls.jsx";
import { TypographyPreviewList } from "../features/typography/components/TypographyPreviewList.jsx";
import { TypographySidebar } from "../features/typography/components/TypographySidebar.jsx";
import { MainAccordions } from "../features/typography/components/ToolLauncher.jsx";
import { ExportModal } from "../features/typography/modals/ExportModal.jsx";
import {
  DevicePreviewModal,
  TemplatePreviewModal,
} from "../features/typography/modals/PreviewModals.jsx";

const initialSettings = {
  baseFontSize: 16,
  scaleRatio: 1.25,
  scaleRatioMode: "preset",
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

export function TypographyPage({ onNavigate }) {
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
          <TypographySidebar
            settings={settings}
            updateSettings={updateSettings}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            availableFonts={availableFonts}
            selectedFont={selectedFont}
            fontUploaderOpen={fontUploaderOpen}
            onOpenFontUploader={() => setFontUploaderOpen(true)}
            onCloseFontUploader={() => setFontUploaderOpen(false)}
            customFonts={customFonts}
            uploadError={uploadError}
            isUploadingFont={isUploadingFont}
            onUploadFont={async (file, name) => {
              await uploadFont(file, name);
              setFontUploaderOpen(false);
            }}
            onRemoveFont={(font, fallbackFont) => {
              setCustomFonts((fonts) =>
                fonts.filter((item) => item.value !== font.value),
              );
              if (settings.fontFamily === font.value) {
                updateSettings({ fontFamily: fallbackFont.value });
              }
            }}
          />
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
              <TypographyPreviewList
                settings={settings}
                typeScale={typeScale}
                onAddCustomSize={addCustomSize}
                onRemoveCustomSize={removeCustomSize}
                onEditSemantic={setSemanticEditor}
              />
            </div>
            <div className="px-6 pb-6">
              <MainAccordions />
            </div>
          </section>
        </div>
      </main>
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
