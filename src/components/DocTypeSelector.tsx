import { documentTypes, type DocumentType } from "@/data/approvedVendors";

interface DocTypeSelectorProps {
  selected: DocumentType | "";
  onSelect: (type: DocumentType) => void;
  showTitle?: boolean;
}

const DocTypeSelector = ({ selected, onSelect, showTitle = true }: DocTypeSelectorProps) => {
  return (
    <div>
      {showTitle && (
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-4">
          Type of Document
        </h2>
      )}
      <div className="max-w-xs">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value as DocumentType)}
          className="w-full h-9 text-xs rounded-sm border border-border bg-surface px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select document type</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DocTypeSelector;
