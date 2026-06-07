import { BorderRadiusPage } from "../pages/BorderRadiusPage.jsx";
import { ColorPalettesPage } from "../pages/ColorPalettesPage.jsx";
import { IconSizePage } from "../pages/IconSizePage.jsx";
import { ShadowPage } from "../pages/ShadowPage.jsx";
import { TypographyPage } from "../pages/TypographyPage.jsx";

export const pageRoutes = {
  home: TypographyPage,
  "color-palettes": ColorPalettesPage,
  "border-radius": BorderRadiusPage,
  shadows: ShadowPage,
  "icon-sizes": IconSizePage,
};
