import { Box, Palette, Radius, Shapes } from "lucide-react";

export const toolCards = [
  {
    id: "color-palettes",
    title: "Color Palettes",
    description: "Generate tonal palettes and export color tokens.",
    icon: Palette,
  },
  {
    id: "border-radius",
    title: "Border Radius",
    description: "Calculate nested corner radii for layered layouts.",
    icon: Radius,
  },
  {
    id: "shadows",
    title: "Shadows",
    description: "Create a clean elevation scale for interfaces.",
    icon: Box,
  },
  {
    id: "icon-sizes",
    title: "Icon Sizes",
    description: "Build icon sizing tokens that align with type.",
    icon: Shapes,
  },
];
