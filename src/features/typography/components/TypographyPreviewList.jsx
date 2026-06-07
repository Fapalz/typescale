import { getPreviewText } from "../lib/utils.js";
import { InsertSizeButton, TypePreviewCard } from "./TypePreview.jsx";

export function TypographyPreviewList({
  settings,
  typeScale,
  onAddCustomSize,
  onRemoveCustomSize,
  onEditSemantic,
}) {
  return (
    <div className="space-y-2">
      <div className="group relative">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2">
          <InsertSizeButton
            label="Add Larger Size"
            onClick={() => onAddCustomSize(typeScale[0]?.id, "above")}
          />
        </div>
      </div>
      {typeScale.map((item, index) => (
        <div key={item.id} className="group">
          <TypePreviewCard
            item={item}
            settings={settings}
            text={getPreviewText(settings, item)}
            onEditSemantic={() => onEditSemantic(item)}
            onRemove={item.isCustom ? () => onRemoveCustomSize(item.id) : null}
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
            <InsertSizeButton
              label={
                index === typeScale.length - 1
                  ? "Add Smaller Size"
                  : "Add Size Here"
              }
              onClick={() => {
                onAddCustomSize(
                  item.id,
                  index === typeScale.length - 1 ? "below" : "between",
                );
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
