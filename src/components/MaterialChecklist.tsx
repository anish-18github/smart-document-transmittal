import { checklistItems, type MakeStatus } from "@/data/approvedVendors";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface MaterialChecklistProps {
  materialRefNo: string;
  materialDescription: string;
  manufacturer: string;
  makeStatus: MakeStatus | "";
  checklistProvided: Record<number, boolean>;
  checklistRemarks: Record<number, string>;
  onMakeStatusChange: (status: MakeStatus) => void;
  onChecklistToggle: (slNo: number) => void;
  onChecklistRemarkChange: (slNo: number, remark: string) => void;
}

const makeStatusOptions: { value: MakeStatus; label: string; description: string }[] = [
  { value: "approved", label: "Approved Make", description: "Listed in Approved Vendor List" },
  { value: "alternative", label: "Alternative Proposal", description: "Justification required" },
  { value: "non_tender", label: "Non Tender Item", description: "Not in original tender" },
];

const MaterialChecklist = ({
  materialRefNo,
  materialDescription,
  manufacturer,
  makeStatus,
  checklistProvided,
  checklistRemarks,
  onMakeStatusChange,
  onChecklistToggle,
  onChecklistRemarkChange,
}: MaterialChecklistProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
        Material Submission Checklist
      </h2>

      {/* Reference & Description bar */}
      <div className="bg-secondary rounded-sm border border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Reference No:
          </span>
          <span className="bg-primary/10 text-primary font-mono text-sm px-2 py-0.5 rounded-sm">
            {materialRefNo}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              Material Description
            </span>
            <span className="text-sm font-medium text-foreground">{materialDescription || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              Manufacturer & Supplier
            </span>
            <span className="text-sm font-medium text-foreground">{manufacturer || "—"}</span>
          </div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3 w-12">
                Sl.
              </th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3">
                Document / Details Required
              </th>
              <th className="text-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3 w-24">
                Provided
              </th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3 w-20">
                Annexure
              </th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3 w-48">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((item) => (
              <tr key={item.slNo} className="border-t border-border h-12">
                <td className="px-4 text-muted-foreground tabular-nums">{item.slNo}</td>
                <td className="px-4 text-foreground text-xs leading-relaxed">
                  {item.description}
                  {item.slNo === 2 && (
                    <div className="mt-3 flex gap-2">
                      {makeStatusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => onMakeStatusChange(opt.value)}
                          className={`press-effect text-[11px] font-medium px-3 py-2 rounded-sm border transition-colors duration-150
                            ${
                              makeStatus === opt.value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-surface text-muted-foreground hover:border-muted-foreground/40"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 text-center">
                  <Checkbox
                    checked={checklistProvided[item.slNo] || false}
                    onCheckedChange={() => onChecklistToggle(item.slNo)}
                    className="rounded-sm"
                  />
                </td>
                <td className="px-4 text-xs text-muted-foreground">{item.annexure}</td>
                <td className="px-4">
                  <Input
                    value={checklistRemarks[item.slNo] || ""}
                    onChange={(e) => onChecklistRemarkChange(item.slNo, e.target.value)}
                    className="h-8 text-xs rounded-sm border-border bg-surface"
                    placeholder="Remarks"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialChecklist;
