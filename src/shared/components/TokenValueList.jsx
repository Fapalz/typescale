import { Check, Copy } from "lucide-react";

export function TokenValueList({
  title,
  items,
  copiedId,
  onCopy,
  listClassName = "space-y-3",
}) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className={listClassName}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3"
          >
            <div className="min-w-0">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
              <code className="block overflow-x-auto whitespace-pre text-sm text-gray-700 dark:text-gray-300">
                {item.code}
              </code>
            </div>
            <button
              type="button"
              onClick={() => onCopy(item)}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-700 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:active:bg-gray-600"
              title={`Copy ${item.label}`}
            >
              {copiedId === item.id ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
