import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Heart,
  Info,
  Type,
} from "lucide-react";

const guideLinks = [
  { id: "guide-fundamentals", title: "Typography Fundamentals Guide" },
  { id: "guide-performance", title: "Web Font Performance Tips" },
  { id: "guide-accessibility", title: "Accessibility in Typography" },
  { id: "guide-responsive", title: "Responsive Typography Best Practices" },
  { id: "guide-design-systems", title: "Type Scale in Design Systems" },
];

export function ToolLauncher({ onNavigate }) {
  return (
    <>
      <MainAccordions />
      <Footer onNavigate={onNavigate} />
    </>
  );
}

export function MainAccordions() {
  const [open, setOpen] = useState(new Set());
  const toggle = (id) => {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const items = [
    {
      id: "fundamentals",
      title: "Type Scale Fundamentals",
      icon: BookOpen,
      content: <FundamentalsContent />,
    },
    {
      id: "about",
      title: "About This Tool",
      icon: Info,
      content: <AboutContent />,
    },
  ];

  return (
    <div className="space-y-4 mt-8">
      {items.map((item) => {
        const expanded = open.has(item.id);
        const Icon = item.icon;
        return (
          <section
            key={item.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <span className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </span>
              </span>
              {expanded ? (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            {expanded && (
              <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-800">
                <div className="pt-4">{item.content}</div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FundamentalsContent() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          What is a type scale?
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A type scale is a sequence of font sizes that work harmoniously
          together. It's based on a mathematical ratio that creates proportional
          relationships between different text sizes, ensuring visual
          consistency and hierarchy.
        </p>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          When to use each ratio
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>
            <strong>1.125 - 1.2:</strong> Conservative designs, body text heavy
          </li>
          <li>
            <strong>1.25 - 1.333:</strong> Balanced designs, most web
            applications
          </li>
          <li>
            <strong>1.414 - 1.5:</strong> Expressive designs, marketing sites
          </li>
          <li>
            <strong>1.618+:</strong> Editorial designs, artistic layouts
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Line-height & spacing tips
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Larger text generally needs tighter line-height (1.2-1.3) while
          smaller text benefits from more breathing room (1.4-1.6). Letter
          spacing should be slightly negative for large headings and slightly
          positive for small text.
        </p>
      </div>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Building visual hierarchy
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This tool helps you create consistent typography systems that
          establish clear visual hierarchy. Use the "Add Size Between" feature
          to fine-tune relationships between existing sizes.
        </p>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Key resources
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Typography fundamentals and hierarchy principles</li>
          <li>• Web font performance and loading strategies</li>
          <li>• Accessibility best practices for readable text</li>
          <li>• Responsive typography and fluid scales</li>
          <li>• Type systems in design system architecture</li>
        </ul>
      </div>
    </div>
  );
}

export function Footer({ onNavigate }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Type Scale
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Create perfect typography systems with mathematical precision.
              Generate harmonious type scales for consistent design systems.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Heart className="w-4 h-4" />
              <span>Made for designers and developers</span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Typography Guides
            </h4>
            <ul className="space-y-3">
              {guideLinks.map((guide) => (
                <li key={guide.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(guide.id)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-left flex items-center space-x-1"
                  >
                    <span>{guide.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>• Mathematical type scales</li>
              <li>• CSS/SCSS/JSON export</li>
              <li>• Device preview</li>
              <li>• Template examples</li>
              <li>• Font pairing system</li>
              <li>• Accessibility focused</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <ResourceLink href="https://fonts.google.com">
                Google Fonts
              </ResourceLink>
              <ResourceLink href="https://webaim.org/resources/contrastchecker/">
                Contrast Checker
              </ResourceLink>
              <ResourceLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts">
                CSS Fonts Guide
              </ResourceLink>
              <ResourceLink href="https://fonts.adobe.com/fonts">
                Adobe Fonts
              </ResourceLink>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {year} Type Scale Tool. Built with precision for designers and
              developers.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span>Free & Open Source</span>
              <span>•</span>
              <span>No Registration Required</span>
              <span>•</span>
              <span>Export Anywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ResourceLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1"
      >
        <span>{children}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </li>
  );
}
