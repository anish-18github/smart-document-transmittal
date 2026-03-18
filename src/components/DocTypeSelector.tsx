import { documentTypes, type DocumentType } from "@/data/approvedVendors";
import { motion, AnimatePresence } from "framer-motion";

interface DocTypeSelectorProps {
  selected: DocumentType | "";
  onSelect: (type: DocumentType) => void;
}

const DocTypeSelector = ({ selected, onSelect }: DocTypeSelectorProps) => {
  return (
    <div>
      <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-4">
        Type of Document
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {documentTypes.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`press-effect text-xs font-medium px-3 py-2.5 rounded-sm border transition-colors duration-150 text-left
              ${
                selected === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-surface text-foreground hover:border-muted-foreground/30"
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocTypeSelector;
