import { useEffect, useRef, useState } from "react";
import { Laptop, Monitor, Pause, Play, Smartphone, Tablet } from "lucide-react";
import {
  fluidSizeAtViewport,
  formatSize,
  getFluidScaleRatios,
} from "../lib/utils.js";

export function FluidSimulator({ settings, typeScale }) {
  const [viewportInput, setViewportInput] = useState(settings.minViewport);
  const [viewport, setViewport] = useState(settings.minViewport);
  const [isAnimating, setIsAnimating] = useState(false);
  const [duration, setDuration] = useState(2000);
  const viewportRef = useRef(settings.minViewport);
  const frameRef = useRef(null);
  const minViewport = Number(settings.minViewport) || 320;
  const maxViewport = Number(settings.maxViewport) || 1200;
  const range = Math.max(1, maxViewport - minViewport);
  const progress = Math.min(
    1,
    Math.max(0, (viewportInput - minViewport) / range),
  );
  const { minRatio, maxRatio } = getFluidScaleRatios(settings);
  const ratio = minRatio + (maxRatio - minRatio) * progress;
  const previewItems = [
    typeScale.find((item) => item.id === "h1") ?? typeScale[0],
    typeScale.find((item) => item.id === "h2") ?? typeScale[1],
    typeScale.find((item) => item.id === "h3") ?? typeScale[2],
    typeScale.find((item) => item.id === "body") ?? typeScale[6],
    typeScale.find((item) => item.id === "caption") ?? typeScale.at(-2),
  ].filter(Boolean);
  const devices = [
    ["Mobile", 375, Smartphone],
    ["Tablet", 768, Tablet],
    ["Laptop", 1024, Laptop],
    ["Desktop", 1440, Monitor],
  ].filter(([, width]) => width >= minViewport && width <= maxViewport);

  const updateViewport = (next, immediate = false) => {
    const clamped = Math.min(maxViewport, Math.max(minViewport, next));
    viewportRef.current = clamped;
    setViewportInput(clamped);

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
    }

    if (immediate) {
      setViewport(clamped);
      frameRef.current = null;
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      setViewport(viewportRef.current);
      frameRef.current = null;
    });
  };

  useEffect(() => {
    updateViewport(viewportRef.current, true);
  }, [minViewport, maxViewport]);

  useEffect(() => {
    if (!isAnimating) return undefined;
    const step = Math.max(8, range / (duration / 60));
    const interval = window.setInterval(() => {
      const next = viewportRef.current + step;
      updateViewport(next > maxViewport ? minViewport : next);
    }, 60);
    return () => window.clearInterval(interval);
  }, [duration, isAnimating, maxViewport, minViewport, range]);

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            <span>Fluid Typography Simulator</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Watch your typography scale smoothly across viewport sizes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsAnimating((value) => !value)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              isAnimating
                ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30"
                : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30"
            }`}
          >
            {isAnimating ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isAnimating ? "Pause" : "Animate"}</span>
          </button>
          <select
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value={1000}>Fast</option>
            <option value={2000}>Normal</option>
            <option value={3000}>Slow</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Viewport:
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.round(viewportInput)}px
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({viewportLabel(viewportInput)})
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Scale Ratio:{" "}
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {ratio.toFixed(3)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={minViewport}
            max={maxViewport}
            step="1"
            value={viewportInput}
            onChange={(event) => updateViewport(Number(event.target.value))}
            className="w-full slider"
            style={{ "--slider-progress": `${progress * 100}%` }}
            disabled={isAnimating}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{minViewport}px (Mobile)</span>
            <span>
              {Math.round((minViewport + maxViewport) / 2)}px (Tablet)
            </span>
            <span>{maxViewport}px (Desktop)</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {devices.map(([label, width, Icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => updateViewport(width, true)}
              disabled={isAnimating}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                Math.abs(viewportInput - width) < 20
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              } ${isAnimating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
          <span>Live Preview</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (Typography scales as viewport changes)
          </span>
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          {previewItems.map((item) => {
            const current = fluidSizeAtViewport(item, settings, viewport);
            const min = fluidSizeAtViewport(item, settings, minViewport);
            const max = fluidSizeAtViewport(item, settings, maxViewport);
            const minLabel = formatSize(
              min,
              settings.unit,
              settings.baseFontSize,
            );
            const maxLabel = formatSize(
              max,
              settings.unit,
              settings.baseFontSize,
            );
            const currentLabel = formatSize(
              current,
              settings.unit,
              settings.baseFontSize,
            );
            const itemProgress =
              ((current - min) / Math.max(0.01, max - min)) * 100;
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {minLabel} - {maxLabel}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      (now: {currentLabel})
                    </span>
                  </div>
                </div>
                <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-100"
                    style={{ width: `${itemProgress}%` }}
                  />
                  <div
                    className="absolute top-0 w-0.5 h-full bg-blue-800 transition-all duration-100"
                    style={{ left: `${itemProgress}%` }}
                  />
                </div>
                <div
                  className="text-gray-900 dark:text-white transition-[font-size,line-height,letter-spacing,font-weight] duration-100 ease-out"
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: `${current}px`,
                    lineHeight: item.lineHeight,
                    fontWeight: item.weight,
                    letterSpacing: `${item.letterSpacing}em`,
                  }}
                >
                  {simulatorText(item)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            How Fluid Typography Works
          </h5>
          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              <strong>CSS clamp():</strong> Sets minimum, preferred, and maximum
              font sizes
            </p>
            <p>
              <strong>Viewport scaling:</strong> Font size changes smoothly
              between {minViewport}px and {maxViewport}px
            </p>
            <p>
              <strong>Scale strategy:</strong>{" "}
              {fluidStrategyName(settings.fluidScaleStrategy)} maps your base
              ratio to mobile, desktop, or the midpoint
            </p>
            <p>
              <strong>Proportional scaling:</strong> All text sizes maintain
              their relative relationships
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function simulatorText(item) {
  if (item.id === "h1") return "Fluid Typography in Action";
  if (item.id === "h2") return "Watch Text Scale Smoothly";
  if (item.id === "h3") return "Responsive Design Made Easy";
  if (item.id === "caption") return "Caption text scales proportionally";
  return "This body text demonstrates how fluid typography adapts to different viewport sizes, maintaining optimal readability across all devices.";
}

function viewportLabel(viewport) {
  if (viewport <= 480) return "Mobile";
  if (viewport <= 768) return "Small Tablet";
  if (viewport <= 1024) return "Tablet/Laptop";
  return "Desktop";
}
function fluidStrategyName(strategy = "centered") {
  if (strategy === "mobile-first") return "Mobile First";
  if (strategy === "desktop-first") return "Desktop First";
  return "Centered";
}
