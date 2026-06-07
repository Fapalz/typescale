export const guides = [
  {
    id: "guide-fundamentals",
    title: "Typography Fundamentals Guide",
    subtitle:
      "Master the core principles of typography, from basic anatomy to visual hierarchy.",
    sections: [
      {
        id: "what-is-typography",
        title: "What is Typography?",
        content:
          "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. It involves selecting typefaces, point sizes, line lengths, line-spacing (leading), letter-spacing (tracking), and adjusting the space between pairs of letters (kerning).",
        subsections: [
          {
            title: "The Foundation of Design",
            content:
              "Typography forms the backbone of visual communication. Good typography establishes a strong visual hierarchy, provides graphic balance, and sets the overall tone of your design. It should guide users, optimize readability, and ensure an excellent user experience.",
          },
          {
            title: "Typography vs. Fonts",
            content:
              'While often used interchangeably, typography and fonts are different. A font is a specific weight, width, and style of a typeface (like "Helvetica Bold 12pt"). Typography is the art of using fonts effectively in design.',
          },
        ],
      },
      {
        id: "type-anatomy",
        title: "Type Anatomy",
        content:
          "Understanding the anatomy of letterforms is crucial for making informed typographic decisions.",
        subsections: [
          {
            title: "Key Terms",
            content:
              "Baseline: The invisible line where letters sit. X-height: The height of lowercase letters. Ascender: Parts of letters that extend above the x-height. Descender: Parts that extend below the baseline. Cap height: The height of capital letters.",
          },
          {
            title: "Why Anatomy Matters",
            content:
              "Different typefaces have different proportions in their anatomy. A font with a large x-height appears larger at the same point size than one with a small x-height. This affects readability and the overall feel of your text.",
          },
        ],
      },
      {
        id: "typeface-classification",
        title: "Typeface Classification",
        content:
          "Typefaces are broadly classified into several categories, each with distinct characteristics and appropriate use cases.",
        subsections: [
          {
            title: "Serif Fonts",
            content:
              "Serif fonts have small decorative strokes (serifs) at the ends of letter strokes. Examples: Times New Roman, Georgia, Merriweather. Best for: Long-form reading, traditional/formal contexts, print materials.",
          },
          {
            title: "Sans-Serif Fonts",
            content:
              "Sans-serif fonts lack the decorative strokes of serif fonts. Examples: Helvetica, Arial, Inter. Best for: Digital interfaces, modern designs, headlines, short text blocks.",
          },
          {
            title: "Display Fonts",
            content:
              "Display fonts are designed for large sizes and short text. Examples: Playfair Display, Bebas Neue. Best for: Headlines, logos, decorative text. Avoid for: Body text, long-form reading.",
          },
          {
            title: "Monospace Fonts",
            content:
              "Every character takes up the same horizontal space. Examples: Courier, Monaco, Fira Code. Best for: Code, data tables, technical documentation.",
          },
        ],
      },
      {
        id: "hierarchy-principles",
        title: "Visual Hierarchy Principles",
        content:
          "Visual hierarchy guides readers through content in order of importance. Typography is one of the most powerful tools for creating hierarchy.",
        subsections: [
          {
            title: "Size and Scale",
            content:
              "Larger text naturally draws attention first. Use a consistent scale (like 1.25 or 1.333) to create harmonious size relationships. Establish clear differences between heading levels.",
          },
          {
            title: "Weight and Contrast",
            content:
              "Bold text stands out from regular weight. Use weight strategically to emphasize important information. Avoid using too many weights in one design.",
          },
          {
            title: "Color and Contrast",
            content:
              "High contrast text (dark on light) draws attention. Use color to create hierarchy, but ensure sufficient contrast for accessibility (minimum 4.5:1 for normal text).",
          },
          {
            title: "Spacing and Position",
            content:
              "White space around text affects its perceived importance. More space = more importance. Use consistent spacing patterns throughout your design.",
          },
        ],
      },
    ],
  },
  {
    id: "guide-performance",
    title: "Web Font Performance Tips",
    subtitle:
      "Optimize web font loading for better performance and user experience.",
    sections: [
      {
        id: "font-loading-strategies",
        title: "Font Loading Strategies",
        content:
          "Web fonts can significantly impact page performance. Implementing proper loading strategies ensures fast, accessible experiences.",
        subsections: [
          {
            title: "Font Display Property",
            content:
              "Use font-display: swap; to show fallback fonts immediately while custom fonts load. This prevents invisible text during font load (FOIT) and improves perceived performance.",
          },
          {
            title: "Preloading Critical Fonts",
            content:
              'Use <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin> for fonts used above the fold. Only preload 1-2 critical font files to avoid bandwidth waste.',
          },
          {
            title: "Font Loading API",
            content:
              'Use the Font Loading API for advanced control: document.fonts.load("1em MyFont").then(() => { /* font loaded */ }). This allows you to show content only after fonts are ready.',
          },
        ],
      },
      {
        id: "font-formats",
        title: "Modern Font Formats",
        content:
          "Choosing the right font format significantly impacts loading performance and browser support.",
        subsections: [
          {
            title: "WOFF2 (Recommended)",
            content:
              "WOFF2 offers the best compression (30% smaller than WOFF). Supported by all modern browsers. Always use WOFF2 as your primary format.",
          },
          {
            title: "WOFF (Fallback)",
            content:
              "WOFF provides good compression and broader browser support. Use as fallback for older browsers that don't support WOFF2.",
          },
          {
            title: "Variable Fonts",
            content:
              "Variable fonts contain multiple styles in one file, reducing HTTP requests. Perfect for designs using multiple weights/styles of the same typeface.",
          },
          {
            title: "Avoid Legacy Formats",
            content:
              "TTF, OTF, and EOT formats are larger and less efficient. Only use for very old browser support requirements.",
          },
        ],
      },
      {
        id: "optimization-techniques",
        title: "Font Optimization Techniques",
        content:
          "Several techniques can dramatically improve font loading performance.",
        subsections: [
          {
            title: "Subsetting",
            content:
              "Remove unused characters from font files. For English-only sites, remove accented characters, symbols, and non-Latin scripts. Can reduce file size by 50-80%.",
          },
          {
            title: "Unicode Range",
            content:
              "Use unicode-range in @font-face to load only needed character sets. Browsers will only download fonts when required characters are present on the page.",
          },
          {
            title: "Font Hosting",
            content:
              "Self-host fonts for better performance control. Google Fonts is convenient but adds DNS lookup time. Self-hosting allows better caching and optimization.",
          },
          {
            title: "Compression",
            content:
              "Enable gzip/brotli compression on your server for font files. Can reduce transfer size by additional 20-30% beyond WOFF2 compression.",
          },
        ],
      },
      {
        id: "performance-monitoring",
        title: "Performance Monitoring",
        content: "Monitor font performance to ensure optimal user experience.",
        subsections: [
          {
            title: "Core Web Vitals",
            content:
              "Font loading affects Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). Monitor these metrics to ensure fonts don't hurt user experience.",
          },
          {
            title: "Font Loading Metrics",
            content:
              "Track font load times, FOIT/FOUT occurrences, and fallback font usage. Use tools like WebPageTest and Chrome DevTools for analysis.",
          },
          {
            title: "Real User Monitoring",
            content:
              "Use RUM tools to understand font performance for real users across different devices and network conditions. Synthetic testing doesn't capture real-world variability.",
          },
        ],
      },
    ],
  },
  {
    id: "guide-accessibility",
    title: "Accessibility in Typography",
    subtitle:
      "Create inclusive typography that works for all users and abilities.",
    sections: [
      {
        id: "contrast-requirements",
        title: "Color Contrast Requirements",
        content:
          "Proper color contrast is fundamental to accessible typography. WCAG guidelines provide specific requirements for text contrast.",
        subsections: [
          {
            title: "WCAG Contrast Ratios",
            content:
              "Normal text: Minimum 4.5:1 (AA), Enhanced 7:1 (AAA). Large text (18pt+ or 14pt+ bold): Minimum 3:1 (AA), Enhanced 4.5:1 (AAA). These ratios ensure readability for users with visual impairments.",
          },
          {
            title: "Testing Contrast",
            content:
              "Use tools like WebAIM Contrast Checker, Colour Contrast Analyser, or browser dev tools. Test all text colors against their backgrounds, including hover states and interactive elements.",
          },
          {
            title: "Beyond Minimum Requirements",
            content:
              "Aim for higher contrast ratios when possible. Consider users with low vision, older adults, and various viewing conditions (bright sunlight, dim screens).",
          },
        ],
      },
      {
        id: "readable-typography",
        title: "Readable Typography",
        content:
          "Typography choices significantly impact readability for all users, especially those with dyslexia, low vision, or cognitive disabilities.",
        subsections: [
          {
            title: "Font Size Guidelines",
            content:
              "Minimum 16px for body text on web. Larger sizes (18-20px) improve readability for older adults and users with visual impairments. Avoid sizes below 14px for any body text.",
          },
          {
            title: "Line Height (Leading)",
            content:
              "Use 1.4-1.6 line-height for body text. Tighter leading makes text harder to read, especially for users with dyslexia. Adequate line spacing helps users track lines of text.",
          },
          {
            title: "Line Length",
            content:
              "Optimal line length is 45-75 characters (including spaces). Lines that are too long or short make reading difficult and cause eye strain.",
          },
          {
            title: "Letter Spacing",
            content:
              "Avoid negative letter-spacing for body text. Slightly increased letter-spacing can improve readability for users with dyslexia.",
          },
        ],
      },
      {
        id: "font-choices",
        title: "Accessible Font Choices",
        content:
          "Some fonts are more accessible than others. Consider readability and clarity when choosing typefaces.",
        subsections: [
          {
            title: "Dyslexia-Friendly Fonts",
            content:
              "Fonts like OpenDyslexic, Lexie Readable, and Comic Sans have features that help users with dyslexia. However, well-designed standard fonts often work just as well.",
          },
          {
            title: "Clear Character Distinction",
            content:
              "Choose fonts where similar characters are easily distinguished: I, l, 1 (capital i, lowercase L, number 1) and 0, O (zero, capital O). This helps all users, especially those with visual impairments.",
          },
          {
            title: "Avoid Decorative Fonts",
            content:
              "Limit decorative or script fonts to headlines and short text. These fonts can be difficult to read, especially for users with cognitive disabilities or reading difficulties.",
          },
        ],
      },
      {
        id: "responsive-accessibility",
        title: "Responsive Accessibility",
        content:
          "Typography must remain accessible across all devices and screen sizes.",
        subsections: [
          {
            title: "Scalable Text",
            content:
              "Use relative units (rem, em) instead of fixed pixels. This allows text to scale with user preferences and browser zoom settings.",
          },
          {
            title: "Mobile Considerations",
            content:
              "Maintain readable font sizes on mobile (minimum 16px to prevent zoom). Ensure adequate touch targets for interactive text elements (minimum 44px).",
          },
          {
            title: "User Preferences",
            content:
              "Respect user preferences for reduced motion, high contrast, and font size. Use CSS media queries like prefers-reduced-motion and prefers-contrast.",
          },
        ],
      },
    ],
  },
  {
    id: "guide-responsive",
    title: "Responsive Typography Best Practices",
    subtitle:
      "Build typography systems that adapt beautifully to any screen size.",
    sections: [
      {
        id: "fluid-typography",
        title: "Fluid Typography Fundamentals",
        content:
          "Fluid typography scales smoothly between breakpoints, creating better user experiences across all screen sizes.",
        subsections: [
          {
            title: "CSS Clamp() Function",
            content:
              "clamp(min, preferred, max) sets minimum, preferred, and maximum values. Example: font-size: clamp(1rem, 4vw, 2rem); scales between 16px and 32px based on viewport width.",
          },
          {
            title: "Viewport Units",
            content:
              "vw (viewport width), vh (viewport height), vmin, vmax create responsive scaling. Use carefully - pure viewport units can become too small or large on extreme screen sizes.",
          },
          {
            title: "Calculating Fluid Scales",
            content:
              "Use tools or formulas to calculate fluid typography values. Consider minimum and maximum screen sizes, desired font size ranges, and scaling behavior.",
          },
        ],
      },
      {
        id: "breakpoint-strategy",
        title: "Breakpoint Strategy",
        content:
          "Strategic breakpoints ensure typography works well across device categories.",
        subsections: [
          {
            title: "Mobile-First Approach",
            content:
              "Start with mobile typography, then enhance for larger screens. Mobile constraints often lead to cleaner, more focused designs.",
          },
          {
            title: "Content-Based Breakpoints",
            content:
              "Set breakpoints based on when your content needs adjustment, not just device sizes. Typography should drive breakpoint decisions.",
          },
          {
            title: "Common Breakpoints",
            content:
              "Mobile: 320-768px, Tablet: 768-1024px, Desktop: 1024px+. Adjust based on your content and user analytics.",
          },
        ],
      },
      {
        id: "scaling-techniques",
        title: "Typography Scaling Techniques",
        content:
          "Different approaches to scaling typography across screen sizes.",
        subsections: [
          {
            title: "Modular Scales",
            content:
              "Use consistent ratios (1.2, 1.25, 1.333) that change at breakpoints. Smaller ratios for mobile, larger for desktop. Maintains harmony while adapting to screen size.",
          },
          {
            title: "Container Queries",
            content:
              "Scale typography based on container size, not viewport. Useful for component-based designs where typography should adapt to available space.",
          },
          {
            title: "Relative Units Strategy",
            content:
              "Use rem for consistent scaling, em for component-relative sizing. Set root font-size at breakpoints to scale entire typography system.",
          },
        ],
      },
      {
        id: "testing-optimization",
        title: "Testing and Optimization",
        content:
          "Ensure responsive typography works across real devices and use cases.",
        subsections: [
          {
            title: "Device Testing",
            content:
              "Test on actual devices, not just browser resize. Different pixel densities, screen qualities, and viewing distances affect readability.",
          },
          {
            title: "Performance Considerations",
            content:
              "Responsive typography shouldn't hurt performance. Avoid excessive media queries, use efficient CSS, and consider font loading impact.",
          },
          {
            title: "User Testing",
            content:
              "Test with real users across devices. What looks good in design tools might not work in real-world usage scenarios.",
          },
        ],
      },
    ],
  },
  {
    id: "guide-design-systems",
    title: "Type Scale in Design Systems",
    subtitle:
      "Implement scalable typography in design systems and component libraries.",
    sections: [
      {
        id: "typography-tokens",
        title: "Typography Design Tokens",
        content:
          "Design tokens create consistent, scalable typography systems that work across platforms and teams.",
        subsections: [
          {
            title: "Token Structure",
            content:
              "Organize tokens by category: font-family, font-size, font-weight, line-height, letter-spacing. Use semantic naming: text-heading-large, text-body-medium, text-caption-small.",
          },
          {
            title: "Semantic vs. Literal Naming",
            content:
              "Use semantic names (heading-primary) over literal ones (font-24px). Semantic names allow changes without breaking implementations.",
          },
          {
            title: "Token Documentation",
            content:
              "Document when and how to use each token. Include examples, do's and don'ts, and accessibility considerations.",
          },
        ],
      },
      {
        id: "scale-implementation",
        title: "Implementing Type Scales",
        content:
          "Practical approaches to implementing and maintaining type scales in design systems.",
        subsections: [
          {
            title: "CSS Custom Properties",
            content:
              "Use CSS variables for type scale values. Allows runtime changes and easier maintenance. Example: --font-size-h1: 2.5rem; --line-height-h1: 1.2;",
          },
          {
            title: "Sass/SCSS Variables",
            content:
              "Use Sass for compile-time type scale generation. Create mixins and functions to generate consistent typography styles across components.",
          },
          {
            title: "JavaScript/JSON Tokens",
            content:
              "Store tokens in JSON for cross-platform use. Generate CSS, iOS, Android, and other platform-specific files from single source of truth.",
          },
        ],
      },
      {
        id: "component-integration",
        title: "Component Integration",
        content:
          "Integrate typography scales into component libraries and design systems.",
        subsections: [
          {
            title: "Typography Components",
            content:
              "Create reusable typography components (Heading, Text, Caption) that enforce scale usage. Include props for semantic levels and visual overrides.",
          },
          {
            title: "Style Composition",
            content:
              "Allow combining typography tokens with other design tokens (color, spacing). Create utilities for common combinations.",
          },
          {
            title: "Developer Experience",
            content:
              "Provide clear APIs, good defaults, and helpful error messages. Make it easier to use the system correctly than incorrectly.",
          },
        ],
      },
      {
        id: "maintenance-evolution",
        title: "System Maintenance and Evolution",
        content:
          "Keep typography systems healthy and evolving with product needs.",
        subsections: [
          {
            title: "Version Management",
            content:
              "Use semantic versioning for typography changes. Major versions for breaking changes, minor for additions, patch for fixes.",
          },
          {
            title: "Usage Analytics",
            content:
              "Track which typography tokens are used where. Identify unused tokens for cleanup and popular patterns for optimization.",
          },
          {
            title: "Feedback Loops",
            content:
              "Establish processes for collecting feedback from designers and developers. Regular reviews ensure the system serves real needs.",
          },
          {
            title: "Migration Strategies",
            content:
              "Plan for typography system changes. Provide migration guides, deprecation warnings, and automated tooling when possible.",
          },
        ],
      },
    ],
  },
];
