import { useState } from "react";
import { GuidePage } from "./components/GuidePage.jsx";
import { Header } from "./components/Header.jsx";
import { guides } from "./guides.js";
import { BorderRadiusTool } from "./tools/BorderRadiusTool.jsx";
import { ColorPalettes } from "./tools/ColorPalettes.jsx";
import { IconSizeTool } from "./tools/IconSizeTool.jsx";
import { ShadowTool } from "./tools/ShadowTool.jsx";
import { TypographyTool } from "./tools/TypographyTool.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [dark, setDark] = useState(false);
  const goHome = () => setView("home");
  const guide = guides.find((item) => item.id === view);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <Header
          onNavigate={setView}
          isDark={dark}
          onTheme={() => setDark((value) => !value)}
        />
        {view === "home" && <TypographyTool onNavigate={setView} />}
        {view === "color-palettes" && <ColorPalettes onBack={goHome} />}
        {view === "border-radius" && <BorderRadiusTool onBack={goHome} />}
        {view === "shadows" && <ShadowTool onBack={goHome} />}
        {view === "icon-sizes" && <IconSizeTool onBack={goHome} />}
        {guide && <GuidePage guide={guide} onBack={goHome} />}
      </div>
    </div>
  );
}
