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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Type Scale Tool</span>
      </button>
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-950 dark:text-white">
            {guide.title}
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {guide.subtitle}
        </p>
      </header>

      <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Table of Contents
        </h2>
        <ol className="space-y-2">
          {guide.sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {index + 1}. {section.title ?? section.heading}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <article className="space-y-16">
        {guide.sections.map((section, index) => (
          <section
            key={section.id ?? section.heading}
            id={section.id}
            className="scroll-mt-8"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {section.title ?? section.heading}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-7 mb-8">
                {section.content ?? section.body}
              </p>
              {section.subsections && (
                <div className="space-y-8">
                  {section.subsections.map((subsection) => (
                    <div
                      key={subsection.title}
                      className="border-l-4 border-blue-200 dark:border-blue-800 pl-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {subsection.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-line">
                        {subsection.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </article>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Type Scale Tool</span>
          </button>
        </div>
      </div>
    </main>
  );
}
