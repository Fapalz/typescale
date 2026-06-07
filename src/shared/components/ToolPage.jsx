import { ArrowLeft, Copy, Download } from "lucide-react";
import { copyText, downloadText } from "../lib/files.js";

export function ToolPage({ title, intro, onBack, children }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Typography</span>
      </button>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl">
          {intro}
        </p>
      </div>
      <div className="space-y-8">{children}</div>
    </main>
  );
}

export function TokenTable({ title, rows, namePrefix = "" }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map(([name, value]) => (
          <div key={name} className="flex items-center justify-between py-3">
            <span className="text-gray-700 dark:text-gray-300">
              {namePrefix}
              {name}
            </span>
            <code className="text-gray-900 dark:text-white">{value}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExportButtons({ filename, css, json }) {
  const copy = async (content) => {
    await copyText(content);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => copy(css)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg"
      >
        <Copy className="w-4 h-4" />
        <span>Copy CSS</span>
      </button>
      <button
        type="button"
        onClick={() => downloadText(`${filename}.css`, css)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        <Download className="w-4 h-4" />
        <span>Download CSS</span>
      </button>
      <button
        type="button"
        onClick={() => copy(json)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg"
      >
        <Copy className="w-4 h-4" />
        <span>Copy JSON</span>
      </button>
      <button
        type="button"
        onClick={() => downloadText(`${filename}.json`, json)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        <Download className="w-4 h-4" />
        <span>Download JSON</span>
      </button>
    </div>
  );
}
