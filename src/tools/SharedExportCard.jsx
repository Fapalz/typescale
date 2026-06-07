import { Check, Copy, Download } from "lucide-react";

export function ExportCard({ title, code, copied, onCopy, onDownload }) {
  return (
    <section className="min-w-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex flex-shrink-0 space-x-2">
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <pre className="min-w-0 max-w-full overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
        <code className="block min-w-max whitespace-pre text-gray-800 dark:text-gray-200">
          {code}
        </code>
      </pre>
    </section>
  );
}
