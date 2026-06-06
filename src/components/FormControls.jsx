export function PanelTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center space-x-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
      <Icon className="w-5 h-5 text-blue-600" />
      <span className="font-medium">{title}</span>
    </div>
  );
}

export function NumberInput({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  onChange,
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const parsed = Number.parseFloat(event.target.value);
            if (Number.isFinite(parsed)) onChange(parsed);
          }}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {suffix && (
          <span className="absolute right-4 top-3 text-gray-500">{suffix}</span>
        )}
      </div>
    </label>
  );
}

export function SelectInput({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`px-4 py-3 rounded-lg text-sm font-medium ${
              value === id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PresetButtons({ label, value, options, onChange }) {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`px-4 py-3 rounded-lg ${
              value === id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
