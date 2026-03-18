import { type MaterialType } from "@/data/approvedVendors";
import { Package, Layers } from "lucide-react";

interface MaterialTypeSelectorProps {
  selected: MaterialType | "";
  onSelect: (type: MaterialType) => void;
}

const MaterialTypeSelector = ({ selected, onSelect }: MaterialTypeSelectorProps) => {
  const options: { value: MaterialType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: "single",
      label: "Single Material",
      desc: "Individual product submission",
      icon: <Package className="w-5 h-5" />,
    },
    {
      value: "full_system",
      label: "Full System with All Accessories",
      desc: "Complete system / assembly",
      icon: <Layers className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-4">
        Material Submittal Type
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`press-effect flex items-start gap-3 p-4 rounded-sm border transition-colors duration-150 text-left
              ${
                selected === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-surface hover:border-muted-foreground/30"
              }`}
          >
            <div className={`mt-0.5 ${selected === opt.value ? "text-primary" : "text-muted-foreground"}`}>
              {opt.icon}
            </div>
            <div>
              <div className={`text-sm font-semibold ${selected === opt.value ? "text-primary" : "text-foreground"}`}>
                {opt.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MaterialTypeSelector;
