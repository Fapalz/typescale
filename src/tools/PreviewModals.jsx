import { useState } from "react";
import {
  FileText,
  LayoutDashboard,
  Monitor,
  Newspaper,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { getPreviewText } from "../utils.js";

const devices = [
  { id: "desktop", name: "Desktop", width: 1440, height: 900, icon: Monitor },
  { id: "laptop", name: "Laptop", width: 1024, height: 768, icon: Monitor },
  { id: "tablet", name: "Tablet", width: 768, height: 1024, icon: Tablet },
  { id: "mobile", name: "Mobile", width: 375, height: 812, icon: Smartphone },
];

const templates = [
  {
    id: "landing",
    name: "Landing Page",
    category: "marketing",
    description: "Hero sections, features, and call-to-action layouts",
    icon: Monitor,
  },
  {
    id: "blog",
    name: "Blog Article",
    category: "content",
    description: "Long-form content with proper reading hierarchy",
    icon: Newspaper,
  },
  {
    id: "documentation",
    name: "Documentation",
    category: "content",
    description: "Technical docs with code examples and guides",
    icon: FileText,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    category: "application",
    description: "Data-heavy interface with metrics and charts",
    icon: LayoutDashboard,
  },
  {
    id: "form",
    name: "Form Page",
    category: "application",
    description: "Sign-up forms and data input interfaces",
    icon: FileText,
  },
];

export function DevicePreviewModal({ typeScale, settings, onClose }) {
  const [device, setDevice] = useState(devices[0]);

  return (
    <Modal
      title="Device Preview"
      subtitle="See how your typography scales across different devices"
      onClose={onClose}
    >
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
        {devices.map((item) => (
          <TabButton
            key={item.id}
            item={item}
            selected={device.id === item.id}
            onClick={() => setDevice(item)}
            suffix={`${item.width}px`}
          />
        ))}
      </div>
      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-auto">
        <div className="flex justify-center">
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-auto border border-gray-300 dark:border-gray-600"
            style={{
              width: `${Math.min(device.width, 1200)}px`,
              height: `${Math.min(device.height, 700)}px`,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <div className="p-6 space-y-6 h-full overflow-y-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{device.name} Preview</span>
                </div>
              </div>
              {typeScale.map((item) => {
                const size = scaledSize(item.fontSize, device.width);
                return (
                  <div
                    key={item.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{item.label}</span>
                      <span>{Math.round(size)}px</span>
                    </div>
                    <div
                      className="text-gray-900 dark:text-white whitespace-pre-line"
                      style={{
                        fontFamily: settings.fontFamily,
                        fontSize: `${size}px`,
                        fontWeight: item.weight,
                        lineHeight: item.lineHeight,
                        letterSpacing: `${item.letterSpacing}em`,
                      }}
                    >
                      {getPreviewText(settings, item)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function TemplatePreviewModal({ typeScale, settings, onClose }) {
  const [template, setTemplate] = useState(templates[0]);
  const [view, setView] = useState("desktop");

  return (
    <Modal
      title="Template Preview"
      subtitle="See your typography in real-world applications"
      onClose={onClose}
    >
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 sm:flex sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <div className="-mx-3 flex overflow-x-auto px-3 sm:mx-0 sm:min-w-0 sm:flex-1 sm:px-0">
          {templates.map((item) => (
            <TabButton
              key={item.id}
              item={item}
              selected={template.id === item.id}
              onClick={() => setTemplate(item)}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-2 dark:bg-gray-800/70 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start sm:rounded-none sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
          <span className="hidden text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:inline sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-gray-700 sm:dark:text-gray-300">
            View:
          </span>
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800">
        <div
          className={
            view === "mobile" ? "max-w-sm mx-auto px-4 py-6" : "max-w-none p-6"
          }
        >
          <TemplateContent
            template={template.id}
            typeScale={typeScale}
            settings={settings}
            mobile={view === "mobile"}
          />
        </div>
      </div>
    </Modal>
  );
}

export function ReadabilityPanel({ typeScale, settings }) {
  const body = typeScale.find((item) => item.id === "body") ?? typeScale[0];
  const h1 = typeScale.find((item) => item.id === "h1") ?? typeScale[0];
  const bodyScore = clampScore(
    100 -
      Math.abs(body.fontSize - 16) * 3 -
      Math.abs(body.lineHeight - 1.6) * 35,
  );
  const hierarchyScore = clampScore(
    Math.min((h1.fontSize / body.fontSize) * 34, 100),
  );
  const spacingScore = clampScore(
    100 - Math.abs(body.letterSpacing - 0.03) * 700,
  );
  const total = Math.round((bodyScore + hierarchyScore + spacingScore) / 3);

  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Readability
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Accessibility-oriented typography checks
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Readability Score
          </p>
          <p className="text-3xl font-bold text-blue-600">{total}%</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <ScoreCard
          label="Body Size"
          value={bodyScore}
          detail={`${body.fontSize}px body text`}
        />
        <ScoreCard
          label="Hierarchy"
          value={hierarchyScore}
          detail={`${Number((h1.fontSize / body.fontSize).toFixed(2))}x h1/body`}
        />
        <ScoreCard
          label="Spacing"
          value={spacingScore}
          detail={`${body.lineHeight} line height, ${body.letterSpacing}em tracking`}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Accessibility: keep body text around 16px+, use clear line height, and
        preserve visible heading hierarchy.
      </p>
    </section>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-7xl h-[94vh] sm:h-[90vh] flex flex-col transition-colors duration-200">
        <div className="flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="grid flex-1 grid-cols-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800 sm:flex sm:flex-none">
      {[
        ["desktop", "Desktop", Monitor],
        ["mobile", "Mobile", Smartphone],
      ].map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center justify-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium sm:py-1 ${
            view === id
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          } transition-colors duration-200`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function TabButton({ item, selected, onClick, suffix }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
        selected
          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      } transition-colors duration-200`}
      title={item.description}
    >
      <Icon className="w-4 h-4" />
      <span>{item.name}</span>
      {suffix && <span className="text-xs opacity-60">({suffix})</span>}
    </button>
  );
}

function TemplateContent({ template, typeScale, settings, mobile }) {
  const token = (id) =>
    typeScale.find((item) => item.id === id) ??
    typeScale.find((item) => item.id === "body") ??
    typeScale[0];
  const style = (id, overrides = {}, fontFamily = settings.fontFamily) => {
    const item = token(id);
    return {
      fontFamily,
      fontSize: `${mobile ? Math.max(item.fontSize * 0.85, 12) : item.fontSize}px`,
      fontWeight: item.weight ?? item.fontWeight,
      lineHeight: item.lineHeight,
      letterSpacing: `${item.letterSpacing}em`,
      ...overrides,
    };
  };
  const monoFont =
    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';

  if (template === "blog") {
    return (
      <article className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span
              style={style("caption", { fontWeight: 600 })}
              className="text-blue-600 dark:text-blue-400 uppercase tracking-wider"
            >
              Typography Guide
            </span>
            <span className="text-gray-300 dark:text-gray-600">&bull;</span>
            <span
              style={style("caption")}
              className="text-gray-500 dark:text-gray-400"
            >
              March 15, 2024
            </span>
          </div>
          <h1 style={style("h1")} className="text-gray-900 dark:text-white">
            The Complete Guide to Modern Type Scales
          </h1>
          <p style={style("body")} className="text-gray-600 dark:text-gray-300">
            Learn how to create harmonious typography systems that enhance
            readability and establish clear visual hierarchy in your designs.
          </p>
        </header>
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 style={style("h2")} className="text-gray-900 dark:text-white">
              Understanding Type Scales
            </h2>
            <p
              style={style("body")}
              className="text-gray-700 dark:text-gray-300"
            >
              A type scale is a sequence of font sizes that work harmoniously
              together, based on mathematical ratios that create proportional
              relationships between different text elements. This systematic
              approach ensures consistency and visual balance throughout your
              design.
            </p>
            <p
              style={style("body")}
              className="text-gray-700 dark:text-gray-300"
            >
              The beauty of type scales lies in their mathematical foundation.
              By using ratios like the Golden Ratio (1.618) or Perfect Fourth
              (1.333), designers can create typography that feels natural and
              pleasing to the eye.
            </p>
          </section>
          <section className="space-y-4">
            <h3 style={style("h3")} className="text-gray-900 dark:text-white">
              Choosing the Right Ratio
            </h3>
            <p
              style={style("body")}
              className="text-gray-700 dark:text-gray-300"
            >
              Different ratios serve different purposes. Conservative ratios
              (1.125-1.2) work well for dense interfaces and mobile apps, while
              more expressive ratios (1.414+) create dramatic hierarchy for
              marketing pages and editorial layouts.
            </p>
          </section>
        </div>
      </article>
    );
  }

  if (template === "dashboard") {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 style={style("h2")} className="text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p
              style={style("body-sm")}
              className="text-gray-500 dark:text-gray-400"
            >
              Overview of your typography performance metrics
            </p>
          </div>
          <span
            style={style("caption")}
            className="text-gray-500 dark:text-gray-400"
          >
            Last updated: 2 minutes ago
          </span>
        </header>
        <div
          className={`grid ${
            mobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
          } gap-6`}
        >
          {[
            ["Total Views", "24,891", "+12%"],
            ["Readability Score", "94.2%", "+2.1%"],
            ["Avg. Reading Time", "3m 42s", "+8%"],
            ["Bounce Rate", "23.1%", "-5%"],
          ].map(([label, value, change]) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <p
                style={style("caption", { fontWeight: 600 })}
                className="text-gray-500 uppercase tracking-wider"
              >
                {label}
              </p>
              <p style={style("h3")} className="text-gray-900 dark:text-white">
                {value}
              </p>
              <p style={style("body-sm")} className="text-green-600">
                {change}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 style={style("h4")} className="text-gray-900 dark:text-white">
              Typography Performance by Page
            </h3>
          </div>
          <div className={mobile ? "overflow-x-auto" : ""}>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {["Page", "Font Size", "Readability", "Engagement"].map(
                    (heading) => (
                      <th
                        key={heading}
                        style={style("body-sm", { fontWeight: 600 })}
                        className="px-6 py-3 text-left text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  ["Homepage", "16px", "96%", "4.2m"],
                  ["Blog Posts", "18px", "94%", "6.8m"],
                  ["Product Pages", "16px", "92%", "3.1m"],
                ].map(([page, fontSize, readability, engagement]) => (
                  <tr key={page}>
                    <td
                      style={style("body-sm", { fontWeight: 500 })}
                      className="px-6 py-4 text-gray-900 dark:text-white"
                    >
                      {page}
                    </td>
                    <td
                      style={style("body-sm")}
                      className="px-6 py-4 text-gray-600 dark:text-gray-300"
                    >
                      {fontSize}
                    </td>
                    <td
                      style={style("body-sm")}
                      className="px-6 py-4 text-gray-600 dark:text-gray-300"
                    >
                      {readability}
                    </td>
                    <td
                      style={style("body-sm")}
                      className="px-6 py-4 text-gray-600 dark:text-gray-300"
                    >
                      {engagement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (template === "form") {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 style={style("h1")} className="text-gray-900 dark:text-white">
            Create Your Account
          </h1>
          <p style={style("body")} className="text-gray-600 dark:text-gray-300">
            Join thousands of designers creating beautiful typography systems
          </p>
        </div>
        <form className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
          <div
            className={`grid ${mobile ? "grid-cols-1" : "md:grid-cols-2"} gap-6`}
          >
            {[
              ["First Name", "Enter your first name"],
              ["Last Name", "Enter your last name"],
            ].map(([label, placeholder]) => (
              <FormField
                key={label}
                label={label}
                placeholder={placeholder}
                style={style}
              />
            ))}
          </div>
          <FormField
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            style={style}
          />
          <FormField
            label="Company (Optional)"
            placeholder="Your company name"
            style={style}
          />
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="terms"
              style={style("body-sm")}
              className="text-gray-600 dark:text-gray-300"
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          <button
            type="submit"
            style={style("body", { fontWeight: 600 })}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create Account
          </button>
          <p
            style={style("body-sm")}
            className="text-center text-gray-500 dark:text-gray-400"
          >
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    );
  }

  if (template === "documentation") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center space-x-2">
            <span
              style={style("caption", { fontWeight: 600 })}
              className="text-blue-600 dark:text-blue-400 uppercase tracking-wider"
            >
              API Reference
            </span>
          </div>
          <h1 style={style("h1")} className="text-gray-900 dark:text-white">
            Typography Scale Generator
          </h1>
          <p style={style("body")} className="text-gray-600 dark:text-gray-300">
            Generate harmonious type scales programmatically using mathematical
            ratios and accessibility-first principles.
          </p>
        </header>
        <section className="space-y-4">
          <h2 style={style("h3")} className="text-gray-900 dark:text-white">
            Quick Start
          </h2>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 overflow-x-auto">
            <pre
              style={style("body-sm", {}, monoFont)}
              className="text-gray-100"
            >{`import { generateTypeScale } from './typography';

const scale = generateTypeScale({
  baseFontSize: 16,
  scaleRatio: 1.25,
  roundValues: false
});

console.log(scale);`}</pre>
          </div>
        </section>
        <section className="space-y-4">
          <h3 style={style("h4")} className="text-gray-900 dark:text-white">
            Parameters
          </h3>
          <div className="space-y-4">
            {[
              [
                "baseFontSize",
                "number",
                "Base font size in pixels (typically 16)",
              ],
              [
                "scaleRatio",
                "number",
                "Mathematical ratio for scaling (1.125 - 1.618)",
              ],
              [
                "roundValues",
                "boolean",
                "Whether to round font sizes to whole numbers",
              ],
            ].map(([name, type, description]) => (
              <div
                key={name}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <code
                    style={style("body-sm", { fontWeight: 600 }, monoFont)}
                    className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                  >
                    {name}
                  </code>
                  <span
                    style={style("caption")}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {type}
                  </span>
                </div>
                <p
                  style={style("body-sm")}
                  className="text-gray-600 dark:text-gray-300"
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={mobile ? "space-y-8" : "space-y-16"}>
      <section
        className={`text-center space-y-6 ${
          mobile ? "py-8 px-4" : "py-16"
        } bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl`}
      >
        <h1
          style={style("display-lg")}
          className={`text-gray-900 dark:text-white ${mobile ? "px-2" : ""}`}
        >
          Transform Your Design
          <br />
          with Perfect Typography
        </h1>
        <p
          style={style("body")}
          className={`text-gray-600 dark:text-gray-300 ${
            mobile ? "px-4" : "max-w-2xl mx-auto"
          }`}
        >
          Create harmonious type scales that establish clear visual hierarchy
          and enhance user experience across all your digital products.
        </p>
        <div
          className={`flex justify-center ${mobile ? "flex-col space-y-3 px-4" : "space-x-4"}`}
        >
          <button
            style={style("body", { fontWeight: 600 })}
            className={`${mobile ? "w-full" : ""} px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
          >
            Get Started Free
          </button>
          <button
            style={style("body", { fontWeight: 500 })}
            className={`${mobile ? "w-full" : ""} px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
          >
            View Demo
          </button>
        </div>
      </section>
      <section className={`${mobile ? "space-y-8 px-4" : "space-y-12"}`}>
        <div className="text-center space-y-4">
          <h2 style={style("h2")} className="text-gray-900 dark:text-white">
            Everything You Need for Perfect Typography
          </h2>
          <p
            style={style("body")}
            className={`text-gray-600 dark:text-gray-300 ${
              mobile ? "" : "max-w-3xl mx-auto"
            }`}
          >
            Professional tools and templates to create stunning typography
            systems that scale beautifully across all devices and use cases.
          </p>
        </div>
        <div
          className={`grid ${
            mobile ? "grid-cols-1 gap-4" : "md:grid-cols-3 gap-6"
          }`}
        >
          {[
            ["Mathematical Precision", "Built on proven typographic ratios"],
            ["Export Anywhere", "CSS, SCSS, JSON, and Tailwind formats"],
            ["Responsive Ready", "Scales perfectly across all devices"],
          ].map(([title, description]) => (
            <div
              key={title}
              className={`${mobile ? "p-4" : "p-6"} bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center space-y-3`}
            >
              <h3 style={style("h4")} className="text-gray-900 dark:text-white">
                {title}
              </h3>
              <p
                style={style("body-sm")}
                className="text-gray-600 dark:text-gray-300"
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FormField({ label, placeholder, type = "text", style }) {
  return (
    <label className="block space-y-2">
      <span
        style={style("body-sm", { fontWeight: 600 })}
        className="text-gray-700 dark:text-gray-300"
      >
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        style={style("body")}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </label>
  );
}

function ScoreCard({ label, value, detail }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-semibold text-blue-600">
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${Math.round(value)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{detail}</p>
    </div>
  );
}

function scaledSize(size, width) {
  const multiplier = Math.min(width / 1440, 1.2);
  return Math.max(size * multiplier, size * 0.8);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
