export const ratioOptions = [
  ["Minor Second", 1.067],
  ["Major Second", 1.125],
  ["Minor Third", 1.2],
  ["Major Third", 1.25],
  ["Perfect Fourth", 1.333],
  ["Augmented Fourth", 1.414],
  ["Perfect Fifth", 1.5],
  ["Golden Ratio", 1.618],
];

const featuredFontOptions = [
  {
    label: "Inter",
    name: "Inter",
    value: "Inter, sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: true,
    axes: ["wght", "opsz"],
    bestFor: "Modern interfaces and clean designs",
    usage: "Excellent for both headings and body text",
    recommendation: "Excellent for both headings and body text",
    pairs: "Source Sans Pro, Merriweather",
    pairsWith: ["Source Sans Pro", "Merriweather"],
  },
  {
    label: "Source Sans Pro",
    name: "Source Sans Pro",
    value: "'Source Sans Pro', sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: true,
    axes: ["wght", "ital"],
    bestFor: "Editorial products and readable UI",
    usage: "Flexible body copy with friendly proportions",
    recommendation: "Perfect for body text and UI elements",
    pairs: "Inter, Playfair Display",
    pairsWith: ["Montserrat", "Playfair Display"],
  },
  {
    label: "Lato",
    name: "Lato",
    value: "Lato, sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: false,
    axes: [],
    bestFor: "Product interfaces and business sites",
    usage: "Warm interface text with crisp numbers",
    recommendation: "Great for body text with strong personality",
    pairs: "Merriweather, Roboto Slab",
    pairsWith: ["Montserrat", "Playfair Display"],
  },
  {
    label: "Oswald",
    name: "Oswald",
    value: "Oswald, sans-serif",
    tag: "Display",
    category: "display",
    isVariable: true,
    axes: ["wght"],
    bestFor: "Condensed headings and editorial labels",
    usage: "Strong display typography and compact nav",
    recommendation: "Condensed sans-serif for powerful headings",
    pairs: "Open Sans, Lato",
    pairsWith: ["Open Sans", "Source Sans Pro"],
  },
  {
    label: "Roboto",
    name: "Roboto",
    value: "Roboto, sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: false,
    axes: [],
    bestFor: "Material-style apps and dashboards",
    usage: "Neutral interface text with high legibility",
    recommendation: "Great for body text, pair with display fonts for headings",
    pairs: "Roboto Condensed, Merriweather",
    pairsWith: ["Montserrat", "Open Sans"],
  },
  {
    label: "Open Sans",
    name: "Open Sans",
    value: "'Open Sans', sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: true,
    axes: ["wght", "wdth", "ital"],
    bestFor: "Readable web products",
    usage: "Body-heavy pages and documentation",
    recommendation: "Versatile for both headings and body text",
    pairs: "Montserrat, Lora",
    pairsWith: ["Montserrat", "Merriweather"],
  },
  {
    label: "Montserrat",
    name: "Montserrat",
    value: "Montserrat, sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: true,
    axes: ["wght", "wdth", "ital", "slnt"],
    bestFor: "Strong headings and product pages",
    usage: "Display text, labels, and brand systems",
    recommendation: "Perfect for headings, pair with readable fonts for body",
    pairs: "Open Sans, Merriweather",
    pairsWith: ["Open Sans", "Source Sans Pro"],
  },
  {
    label: "Playfair Display",
    name: "Playfair Display",
    value: "'Playfair Display', serif",
    tag: "Serif",
    category: "serif",
    isVariable: true,
    axes: ["wght", "opsz", "ital"],
    bestFor: "Editorial and elegant layouts",
    usage: "Headlines with character",
    recommendation:
      "Best for large headings, pair with clean sans-serif for body",
    pairs: "Inter, Source Sans Pro",
    pairsWith: ["Inter", "Source Sans Pro"],
  },
  {
    label: "Merriweather",
    name: "Merriweather",
    value: "Merriweather, serif",
    tag: "Serif",
    category: "serif",
    isVariable: false,
    axes: [],
    bestFor: "Long-form reading",
    usage: "Articles, essays, and content sites",
    recommendation: "Ideal for body text in articles and blogs",
    pairs: "Inter, Lato",
    pairsWith: ["Playfair Display", "Montserrat"],
  },
  {
    label: "Fira Code",
    name: "Fira Code",
    value: "'Fira Code', monospace",
    tag: "Mono",
    category: "monospace",
    isVariable: true,
    axes: ["wght"],
    bestFor: "Code and technical content",
    usage: "Developer tools, snippets, and metadata",
    recommendation: "Best monospace for code with ligature support",
    pairs: "Inter, IBM Plex Sans",
    pairsWith: ["Fira Sans", "Inter"],
  },
  {
    label: "IBM Plex Sans",
    name: "IBM Plex Sans",
    value: "'IBM Plex Sans', sans-serif",
    tag: "Sans",
    category: "sans-serif",
    isVariable: false,
    axes: [],
    bestFor: "Technical products and design systems",
    usage: "Precise UI copy and documentation",
    recommendation: "IBM's design language font family",
    pairs: "IBM Plex Mono, IBM Plex Serif",
    pairsWith: ["IBM Plex Serif", "IBM Plex Mono"],
  },
  {
    label: "Pacifico",
    name: "Pacifico",
    value: "Pacifico, cursive",
    tag: "Script",
    category: "script",
    isVariable: false,
    axes: [],
    bestFor: "Expressive accents and playful branding",
    usage: "Use sparingly for display and logo-like text",
    recommendation: "Use sparingly for display and logo-like text",
    pairs: "Open Sans, Lato",
    pairsWith: ["Open Sans", "Lato"],
  },
];

const additionalFontFamilies = [
  "Poppins",
  "Nunito",
  "Raleway",
  "Ubuntu",
  "Work Sans",
  "Fira Sans",
  "DM Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "Lora",
  "Crimson Text",
  "Libre Baskerville",
  "Cormorant Garamond",
  "Spectral",
  "Vollkorn",
  "Alegreya",
  "Zilla Slab",
  "Bebas Neue",
  "Abril Fatface",
  "Righteous",
  "Fredoka One",
  "Archivo Black",
  "JetBrains Mono",
  "Source Code Pro",
  "Space Mono",
  "Roboto Condensed",
  "PT Sans",
  "PT Serif",
  "Noto Sans",
  "Noto Serif",
  "Rubik",
  "Karla",
  "IBM Plex Serif",
  "IBM Plex Mono",
  "Quicksand",
  "Mukti",
  "Barlow",
  "Heebo",
  "Cabin",
  "Titillium Web",
  "Exo 2",
  "Arimo",
  "Tinos",
  "Cousine",
  "Libre Franklin",
  "Merriweather Sans",
  "Dosis",
  "Asap",
  "Bitter",
  "Oxygen",
  "Cantarell",
  "Varela Round",
  "Comfortaa",
  "Dancing Script",
  "Shadows Into Light",
  "Amatic SC",
  "Indie Flower",
  "Lobster",
  "Great Vibes",
  "Sacramento",
  "Satisfy",
  "Kaushan Script",
];

const variableFonts = new Set([
  "Poppins",
  "Nunito",
  "Raleway",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "Lora",
  "Vollkorn",
  "Alegreya",
  "Oswald",
  "JetBrains Mono",
  "Source Code Pro",
  "Noto Sans",
  "Noto Serif",
  "Rubik",
  "Karla",
  "Quicksand",
  "Cabin",
  "Exo 2",
  "Arimo",
  "Tinos",
  "Cousine",
]);

export const fontOptions = [
  ...featuredFontOptions,
  ...additionalFontFamilies.map((family) => ({
    label: family,
    name: family,
    value: fontValue(family),
    tag: fontTag(family),
    category: fontCategory(family),
    isVariable: variableFonts.has(family),
    axes: variableFonts.has(family) ? ["wght"] : [],
    bestFor: "Additional Google Font for expanded type exploration",
    usage:
      "Use for custom brand tone, headings, or body text depending on the family",
    recommendation:
      "Use for custom brand tone, headings, or body text depending on the family",
    pairs: "Inter, Open Sans, Lato",
    pairsWith: ["Inter", "Open Sans", "Lato"],
  })),
];

export const typeTokens = [
  { id: "display-lg", label: "Display Large", weight: 800, step: 4 },
  { id: "display-md", label: "Display Medium", weight: 800, step: 3.5 },
  { id: "h1", label: "H1 - Heading 1", weight: 700, step: 3 },
  { id: "h2", label: "H2 - Heading 2", weight: 600, step: 2 },
  { id: "h3", label: "H3 - Heading 3", weight: 600, step: 1.5 },
  { id: "h4", label: "H4 - Heading 4", weight: 500, step: 1 },
  { id: "h5", label: "H5 - Heading 5", weight: 500, step: 0.75 },
  { id: "h6", label: "H6 - Heading 6", weight: 500, step: 0.5 },
  { id: "body-xl", label: "Body XL", weight: 400, step: 0.25 },
  { id: "body", label: "Body", weight: 400, step: 0 },
  { id: "body-sm", label: "Body Small", weight: 400, step: -0.25 },
  { id: "caption-lg", label: "Caption Large", weight: 400, step: -0.5 },
  { id: "caption", label: "Caption", weight: 400, step: -0.75 },
  { id: "caption-sm", label: "Caption Small", weight: 300, step: -1 },
  { id: "overline", label: "Overline", weight: 500, step: -1.25 },
];

function fontValue(family) {
  const category = fontTag(family);
  const stack =
    category === "Serif"
      ? "serif"
      : category === "Mono"
        ? "monospace"
        : category === "Script"
          ? "cursive"
          : "sans-serif";
  return family.includes(" ") ? `"${family}", ${stack}` : `${family}, ${stack}`;
}

function fontTag(family) {
  if (
    [
      "Lora",
      "Crimson Text",
      "Libre Baskerville",
      "Cormorant Garamond",
      "Spectral",
      "Vollkorn",
      "Alegreya",
      "Zilla Slab",
      "PT Serif",
      "Noto Serif",
      "IBM Plex Serif",
      "Bitter",
      "Tinos",
    ].includes(family)
  )
    return "Serif";
  if (
    [
      "JetBrains Mono",
      "Source Code Pro",
      "Space Mono",
      "IBM Plex Mono",
      "Cousine",
    ].includes(family)
  )
    return "Mono";
  if (
    [
      "Dancing Script",
      "Shadows Into Light",
      "Amatic SC",
      "Indie Flower",
      "Lobster",
      "Great Vibes",
      "Sacramento",
      "Satisfy",
      "Kaushan Script",
    ].includes(family)
  )
    return "Script";
  if (
    ["Bebas Neue", "Abril Fatface", "Righteous", "Archivo Black"].includes(
      family,
    )
  )
    return "Display";
  return "Sans";
}

function fontCategory(family) {
  const tag = fontTag(family);
  if (tag === "Serif") return "serif";
  if (tag === "Mono") return "monospace";
  if (tag === "Script") return "script";
  if (tag === "Display") return "display";
  return "sans-serif";
}

export const previewTexts = [
  {
    id: "pangram",
    label: "The quick brown fox jumps",
    content: "The quick brown fox jumps over the lazy dog.",
    category: "paragraph",
  },
  {
    id: "headline-news",
    label: "News Headline",
    content:
      "Breaking: Revolutionary Typography Tool Transforms Design Workflow\nDesigners Report 300% Faster Prototyping",
    category: "headline",
  },
  {
    id: "headline-product",
    label: "Product Title",
    content:
      "Introducing the Future of Digital Typography\nBuilt for Modern Design Teams",
    category: "headline",
  },
  {
    id: "headline-blog",
    label: "Blog Title",
    content:
      "The Complete Guide to Modern Type Scales\nEverything You Need to Know About Typography Hierarchy",
    category: "headline",
  },
  {
    id: "headline-marketing",
    label: "Marketing Headline",
    content:
      "Transform Your Brand with Perfect Typography\nCreate Stunning Visual Hierarchy in Minutes",
    category: "headline",
  },
  {
    id: "paragraph-article",
    label: "Article Text",
    content:
      "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.\n\nGood typography establishes a strong visual hierarchy, provides a graphic balance to the website, and sets the product's overall tone.",
    category: "paragraph",
  },
  {
    id: "paragraph-description",
    label: "Product Description",
    content:
      "This innovative tool helps designers create harmonious type scales using mathematical ratios. Perfect for building consistent design systems that scale beautifully across all devices and screen sizes.\n\nWith fluid typography support and real-time preview, you can experiment with different ratios and see immediate results.",
    category: "paragraph",
  },
  {
    id: "paragraph-story",
    label: "Story Text",
    content:
      "In the world of design, typography serves as the voice of content. Every letter, word, and line contributes to the overall narrative, guiding readers through information with clarity and purpose.\n\nA well-crafted type scale ensures that this voice remains consistent, expressive, and readable across every screen.",
    category: "paragraph",
  },
  {
    id: "paragraph-technical",
    label: "Technical Content",
    content:
      "CSS clamp() enables fluid typography by setting minimum, preferred, and maximum values. This approach ensures optimal readability across viewport sizes while maintaining design consistency.",
    category: "paragraph",
  },
  {
    id: "caption-photo",
    label: "Photo Caption",
    content:
      "Figure 1: Typography hierarchy demonstration showing scale relationships\nImage courtesy of Design Systems Collective",
    category: "caption",
  },
  {
    id: "caption-metadata",
    label: "Metadata",
    content:
      "Published March 15, 2024 - 5 min read - Design Systems\nLast updated: December 2024 - Typography, Web Design",
    category: "caption",
  },
  {
    id: "caption-legal",
    label: "Legal Text",
    content:
      "* Results may vary. Please consult documentation for implementation details.\n** This tool is provided as-is without warranty. Always test in your target browsers.",
    category: "caption",
  },
  {
    id: "caption-attribution",
    label: "Attribution",
    content:
      "Created with Type Scale Tool • Open source typography system\nBuilt with React, TypeScript, and Tailwind CSS",
    category: "caption",
  },
  {
    id: "custom",
    label: "Custom...",
    content: "",
    category: "custom",
  },
];
