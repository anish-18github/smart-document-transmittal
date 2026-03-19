import { useRef } from "react";
import { checklistItems, type MakeStatus } from "@/data/approvedVendors";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Upload, FileCheck } from "lucide-react";

interface MaterialChecklistProps {
  materialRefNo: string;
  materialDescription: string;
  manufacturer: string;
  materialRemarks: string;
  makeStatus: MakeStatus | "";
  checklistProvided: Record<number, boolean>;
  checklistRemarks: Record<number, string>;
  checklistFiles: Record<number, File | null>;
  onMaterialRemarksChange: (remarks: string) => void;
  onMakeStatusChange: (status: MakeStatus) => void;
  onChecklistToggle: (slNo: number) => void;
  onChecklistRemarkChange: (slNo: number, remark: string) => void;
  onFileUpload: (slNo: number, file: File) => void;
}

const makeStatusOptions: { value: MakeStatus; label: string }[] = [
  { value: "approved", label: "Approved Make" },
  { value: "alternative", label: "Alternative Proposal" },
  { value: "non_tender", label: "Non Tender Item" },
];

const MaterialChecklist = ({
  materialRefNo,
  materialDescription,
  manufacturer,
  materialRemarks,
  makeStatus,
  checklistProvided,
  checklistRemarks,
  checklistFiles,
  onMaterialRemarksChange,
  onMakeStatusChange,
  onChecklistToggle,
  onChecklistRemarkChange,
  onFileUpload,
}: MaterialChecklistProps) => {
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Compute annexure numbers: only checked rows get incrementing numbers
  const annexureMap: Record<number, number> = {};
  let annexureCounter = 0;
  checklistItems.forEach((item) => {
    if (checklistProvided[item.slNo]) {
      annexureCounter++;
      annexureMap[item.slNo] = annexureCounter;
    }
  });

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
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
            Remarks
          </span>
          <Input
            value={materialRemarks}
            onChange={(e) => onMaterialRemarksChange(e.target.value)}
            className="mt-1 h-9 text-xs rounded-sm border-border bg-surface"
            placeholder="Enter remarks (will appear in transmittal table)"
          />
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
              <th className="text-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3 w-32">
                Annexure
              </th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-3 w-48">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((item) => {
              const isProvided = checklistProvided[item.slNo] || false;
              const annexureNo = annexureMap[item.slNo];
              const uploadedFile = checklistFiles[item.slNo];

              return (
                <tr key={item.slNo} className="border-t border-border h-14 transition-colors hover:bg-accent/30">
                  <td className="px-4 text-muted-foreground tabular-nums font-medium">{item.slNo}</td>
                  <td className="px-4 text-foreground text-xs leading-relaxed">
                    {item.description}
                    {item.slNo === 2 && (
                      <div className="mt-3 flex gap-2">
                        {makeStatusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              onMakeStatusChange(opt.value);
                              if (opt.value === "approved") {
                                onChecklistRemarkChange(
                                  item.slNo,
                                  `${materialDescription || ""}${materialDescription && manufacturer ? " - " : ""}${
                                    manufacturer || ""
                                  }`.trim()
                                );
                              } else {
                                onChecklistRemarkChange(item.slNo, "");
                              }
                            }}
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
                      checked={isProvided}
                      onCheckedChange={() => onChecklistToggle(item.slNo)}
                      className="rounded-sm"
                    />
                  </td>
                  <td className="px-4 text-center">
                    {isProvided ? (
                      <button
                        onClick={() => fileInputRefs.current[item.slNo]?.click()}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-sm border transition-colors cursor-pointer
                          ${
                            uploadedFile
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
                              : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                          }`}
                        title={uploadedFile ? uploadedFile.name : "Click to upload document"}
                      >
                        {uploadedFile ? (
                          <>
                            <FileCheck className="w-3.5 h-3.5" />
                            Annexure #{annexureNo}
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            Annexure #{annexureNo}
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                    <input
                      type="file"
                      ref={(el) => { fileInputRefs.current[item.slNo] = el; }}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onFileUpload(item.slNo, file);
                      }}
                    />
                  </td>
                  <td className="px-4">
                    <Input
                      value={checklistRemarks[item.slNo] || ""}
                      onChange={(e) => onChecklistRemarkChange(item.slNo, e.target.value)}
                      className="h-8 text-xs rounded-sm border-border bg-surface"
                      placeholder="Remarks"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialChecklist;
