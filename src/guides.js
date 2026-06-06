export const guides = [
  {
    id: "guide-fundamentals",
    title: "Typography Fundamentals Guide",
    subtitle: "Type Scale Fundamentals",
    sections: [
      {
        heading: "What is a Type Scale?",
        body: "A type scale is a sequence of font sizes that work harmoniously together, based on mathematical ratios that create proportional relationships between different text elements.",
      },
      {
        heading: "Why Mathematical Ratios Matter",
        body: "Ratios like Major Third, Perfect Fourth, and the Golden Ratio create predictable hierarchy. Conservative ratios work well for product interfaces, while expressive ratios suit marketing and editorial pages.",
      },
      {
        heading: "Choosing the Right Ratio",
        body: "Use smaller ratios for dense content, dashboards, and mobile screens. Use larger ratios when the design needs dramatic headlines and more visual separation.",
      },
      {
        heading: "What is Typography?",
        body: "Typography is the system of typeface selection, size, spacing, hierarchy, and composition that turns text into readable interface language.",
      },
      {
        heading: "Type Anatomy",
        body: "Key terms include baseline, x-height, ascender, descender, and cap height. Knowing the anatomy helps compare fonts beyond their names.",
      },
      {
        heading: "Typeface Classification",
        body: "Sans-serif, serif, display, monospace, and script typefaces each carry different readability and brand tradeoffs.",
      },
      {
        heading: "Visual Hierarchy Principles",
        body: "Hierarchy comes from size, weight, contrast, spacing, and placement. A type scale provides the size system, but layout turns it into meaning.",
      },
      {
        heading: "When to use each ratio",
        body: "1.125 - 1.2: dense product UI. 1.25 - 1.333: balanced apps and content. 1.414 - 1.5: expressive marketing. 1.618+: dramatic editorial display.",
      },
    ],
  },
  {
    id: "guide-performance",
    title: "Web Font Performance Tips",
    subtitle: "Performance",
    sections: [
      {
        heading: "Load Only What You Need",
        body: "Keep font families, weights, and character sets intentional. Variable fonts can reduce requests while still supporting a broad design range.",
      },
      {
        heading: "Use Font Display",
        body: "Use font-display: swap or optional to keep text visible while custom fonts load. Test fallback stacks so layout remains stable.",
      },
      {
        heading: "Measure Real Devices",
        body: "Typography performance depends on network, rendering cost, and font file size. Check mobile devices as well as desktop browsers.",
      },
      {
        heading: "Font Loading Strategies",
        body: "Use preload for critical fonts, keep fallback stacks close to the final metrics, and avoid loading unused weights.",
      },
      {
        heading: "Font Display Property",
        body: "font-display controls how browsers swap from fallback to custom fonts. Swap keeps text visible; optional can reduce late layout movement.",
      },
      {
        heading: "Modern Font Formats",
        body: "WOFF2 is recommended for modern browsers because it compresses well. WOFF is a fallback for legacy support.",
      },
      {
        heading: "Variable Fonts",
        body: "Variable fonts can combine many weights or axes into one file and enable subtle optical-size or weight adjustments.",
      },
      {
        heading: "Core Web Vitals",
        body: "Font loading can influence LCP and CLS. Test real pages, not only isolated specimens, when evaluating typography changes.",
      },
    ],
  },
  {
    id: "guide-accessibility",
    title: "Accessibility in Typography",
    subtitle: "Accessibility",
    sections: [
      {
        heading: "Readable Size and Spacing",
        body: "Body text usually starts around 16px on the web. Pair readable sizes with generous line height, clear paragraph spacing, and avoid overly tight letter spacing.",
      },
      {
        heading: "WCAG Contrast Ratios",
        body: "Normal text needs at least 4.5:1 contrast for WCAG AA. Large text can use 3:1, but higher contrast is often better in real conditions.",
      },
      {
        heading: "Zoom and Responsive Layout",
        body: "Typography should survive browser zoom, narrow screens, and user font settings. Relative units and fluid typography help maintain hierarchy.",
      },
      {
        heading: "Color Contrast Requirements",
        body: "Normal text requires 4.5:1 contrast for WCAG AA. Large text can use 3:1, but higher contrast improves readability in bright or low-quality viewing conditions.",
      },
      {
        heading: "Weight and Contrast",
        body: "Thin weights need more contrast and larger sizes. Avoid relying on hairline fonts for essential information.",
      },
      {
        heading: "Accessible Font Choices",
        body: "Readable typography favors clear character distinction, open counters, and predictable spacing. Avoid decorative fonts for body copy.",
      },
      {
        heading: "Dyslexia-Friendly Fonts",
        body: "No font solves every reading need, but generous spacing, clear forms, and avoiding dense paragraphs can help many readers.",
      },
      {
        heading: "Responsive Accessibility",
        body: "Respect reduced motion, high contrast, zoom, and user font-size preferences. Responsive type should preserve readability first.",
      },
    ],
  },
  {
    id: "guide-responsive",
    title: "Responsive Typography Best Practices",
    subtitle: "Fluid Typography Fundamentals",
    sections: [
      {
        heading: "Fluid Typography",
        body: "CSS clamp() lets text scale smoothly between a minimum and maximum size. It avoids abrupt breakpoint jumps while preserving readable limits.",
      },
      {
        heading: "Adaptive Ratios",
        body: "Use smaller ratios on mobile and larger ratios on desktop when needed. The relationship between levels should stay consistent enough to feel systematic.",
      },
      {
        heading: "Test Real Content",
        body: "Short headlines, long product titles, captions, and legal copy stress a type system differently. Preview multiple text samples before exporting.",
      },
      {
        heading: "CSS Clamp() Function",
        body: "clamp(min, preferred, max) is the foundation of fluid typography. It sets readable bounds while allowing smooth viewport-based scaling.",
      },
      {
        heading: "Common Breakpoints",
        body: "Mobile: 320-768px, Tablet: 768-1024px, Desktop: 1024px+. Adjust these based on actual content and analytics.",
      },
      {
        heading: "Container Queries",
        body: "Container queries let typography respond to component width, which is often more useful than responding to the full viewport.",
      },
      {
        heading: "Viewport Units",
        body: "Viewport units power fluid scales, but should be bounded so text never becomes too small or too large.",
      },
      {
        heading: "Device Testing",
        body: "Test on real mobile, tablet, and desktop screens. Device preview is useful, but final checks should include actual rendering conditions.",
      },
    ],
  },
  {
    id: "guide-design-systems",
    title: "Type Scale in Design Systems",
    subtitle: "Design Systems",
    sections: [
      {
        heading: "Semantic Tokens",
        body: "Name typography by purpose, not only size. Tokens like body, caption, h1, and display-large make implementation easier to maintain.",
      },
      {
        heading: "Implementation",
        body: "Export CSS variables, SCSS variables, JSON tokens, or native platform styles so design and engineering share the same source of truth.",
      },
      {
        heading: "Governance",
        body: "A type scale works best when teams know when to add a new token and when to reuse an existing one. Keep exceptions visible and intentional.",
      },
      {
        heading: "Typography Design Tokens",
        body: "Store size, weight, line height, letter spacing, and family as tokens so design and code share the same vocabulary.",
      },
      {
        heading: "Semantic vs. Literal Naming",
        body: "Semantic names such as page-title or body-small describe intent. Literal names such as 24px describe only implementation.",
      },
      {
        heading: "CSS Custom Properties",
        body: "CSS variables such as --font-size-h1 allow runtime theming and simpler integration with component styles.",
      },
      {
        heading: "JavaScript/JSON Tokens",
        body: "JSON tokens make it possible to generate CSS, iOS, Android, and other platform files from one source of truth.",
      },
      {
        heading: "System Maintenance and Evolution",
        body: "Track version changes, document migration strategies, and use feedback loops so typography evolves without breaking product consistency.",
      },
    ],
  },
];
