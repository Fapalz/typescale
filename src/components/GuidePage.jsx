import { ArrowLeft, BookOpen } from "lucide-react";

export function GuidePage({ guide, onBack }) {
  if (!guide) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Type Scale Tool</span>
        </button>
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-950 dark:text-white mb-4">
            Guide Not Found
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            The requested guide could not be found.
          </p>
        </article>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Type Scale Tool</span>
      </button>
      <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3 text-blue-600">
          <BookOpen className="w-6 h-6" />
          <span className="text-sm font-semibold uppercase">
            {guide.subtitle}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-950 dark:text-white mb-8">
          {guide.title}
        </h1>
        <div className="space-y-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-7">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
