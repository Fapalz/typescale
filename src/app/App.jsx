import { useState } from "react";
import { GuidePage } from "../features/guides/components/GuidePage.jsx";
import { guides } from "../features/guides/data/guides.js";
import { Footer } from "../features/typography/components/ToolLauncher.jsx";
import { Header } from "../shared/components/Header.jsx";
import { pageRoutes } from "./routes.js";

export default function App() {
  const [view, setView] = useState("home");
  const [dark, setDark] = useState(false);
  const goHome = () => setView("home");
  const guide = guides.find((item) => item.id === view);
  const Page = pageRoutes[view];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <Header
          onNavigate={setView}
          isDark={dark}
          onTheme={() => setDark((value) => !value)}
        />
        {Page && <Page onNavigate={setView} onBack={goHome} />}
        {guide && <GuidePage guide={guide} onBack={goHome} />}
        <Footer onNavigate={setView} />
      </div>
    </div>
  );
}
