import { type TransmittalFormData, checklistItems } from "@/data/approvedVendors";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface DocumentPreviewProps {
  formData: TransmittalFormData;
  onClose: () => void;
}

const DocumentPreview = ({ formData, onClose }: DocumentPreviewProps) => {
  const handleDownload = () => {
    window.print();
  };

  const makeStatusLabel = formData.makeStatus === "approved"
    ? "Approved Make"
    : formData.makeStatus === "alternative"
    ? "Alternative Proposal"
    : formData.makeStatus === "non_tender"
    ? "Non Tender Item"
    : "—";

  return (
    <div className="fixed inset-0 z-50 bg-muted-foreground/60 flex flex-col print:bg-surface">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-foreground print:hidden">
        <span className="text-sm font-medium text-primary-foreground">Document Preview</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 rounded-sm"
          >
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10 rounded-sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Paper */}
      <div className="flex-1 overflow-auto p-8 print:p-0">
        <div className="bg-surface shadow-2xl mx-auto print:shadow-none" style={{ width: "210mm", minHeight: "297mm", padding: "15mm 20mm" }}>
          {/* Page 1: Transmittal */}
          <div className="font-document text-foreground">
            {/* Title */}
            <h1 className="text-center text-lg font-bold tracking-wide mb-6 border-b-2 border-foreground pb-2">
              TRANSMITTAL OF DOCUMENTS
            </h1>

            {/* Header Grid */}
            <div className="grid grid-cols-2 gap-y-2 text-xs mb-6">
              <div><span className="font-bold">Transmittal Ref. No:</span> <span className="tabular-nums">{formData.transmittalRefNo}</span></div>
              <div><span className="font-bold">Date:</span> {formData.date}</div>
              <div><span className="font-bold">Project Name:</span> {formData.projectName}</div>
              <div><span className="font-bold">Project No:</span> {formData.projectNo || "—"}</div>
              <div><span className="font-bold">Work Order #:</span> {formData.workOrderNo}</div>
              <div><span className="font-bold">From:</span> {formData.from}</div>
            </div>

            {/* Type of Document */}
            <div className="text-xs mb-6">
              <span className="font-bold">Type of Document:</span>{" "}
              <span>{formData.documentType || "—"}</span>
            </div>

            {/* Submittal Details */}
            <h2 className="text-sm font-bold mb-3 border-b border-border pb-1">1. SUBMITTAL DETAILS</h2>
            <div className="text-xs mb-4">
              <span className="font-bold">Area of Application:</span> {formData.areaOfApplication || "—"}
            </div>

            <table className="w-full text-xs border border-foreground/30 mb-6">
              <thead>
                <tr className="border-b border-foreground/30">
                  <th className="text-left p-2 font-bold w-8">Sr.</th>
                  <th className="text-left p-2 font-bold">Document No.</th>
                  <th className="text-left p-2 font-bold w-12">Rev.</th>
                  <th className="text-left p-2 font-bold w-16">Copies</th>
                  <th className="text-left p-2 font-bold">Description</th>
                  <th className="text-left p-2 font-bold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-foreground/20">
                  <td className="p-2 tabular-nums">1</td>
                  <td className="p-2 font-mono text-[11px]">{formData.materialRefNo}</td>
                  <td className="p-2">0</td>
                  <td className="p-2">1</td>
                  <td className="p-2">
                    MAS for {formData.product}
                    {formData.brand ? ` (Make: ${formData.brand})` : ""}
                  </td>
                  <td className="p-2"></td>
                </tr>
              </tbody>
            </table>

            {/* Transmitted For */}
            <div className="text-xs mb-6">
              <span className="font-bold">These are transmitted for: </span>
              <span className="inline-flex gap-4 ml-2">
                {["Information", "Approval", "Checking", "For Construction"].map((opt) => (
                  <span key={opt} className="inline-flex items-center gap-1">
                    <span className={`inline-block w-3 h-3 border border-foreground/40 ${formData.transmittedFor === opt ? "bg-foreground/80" : ""}`} />
                    {opt}
                  </span>
                ))}
              </span>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 text-xs border-t border-foreground/30 pt-3 mb-6">
              <div><span className="font-bold">Submitted By:</span></div>
              <div><span className="font-bold">Signature:</span></div>
              <div><span className="font-bold">Date:</span></div>
              <div><span className="font-bold">Received By:</span></div>
              <div><span className="font-bold">Signature:</span></div>
              <div><span className="font-bold">Date:</span></div>
            </div>

            {/* Consultant Comments */}
            <h2 className="text-sm font-bold mb-3 border-b border-border pb-1">
              2. THE CONSULTANT / ENGINEER COMMENTS:
            </h2>
            <div className="min-h-[60px] text-xs mb-4 border-b border-dashed border-border" />

            {/* Status Legend */}
            <div className="flex items-center gap-4 text-[10px] mb-4">
              <span className="font-bold">Code Legend:</span>
              {[
                { code: "A", label: "Approved" },
                { code: "B", label: "Approved as noted" },
                { code: "C", label: "Resubmit For Approval" },
                { code: "D", label: "Rejected" },
                { code: "E", label: "Noted & Accepted" },
              ].map((s) => (
                <span key={s.code} className="inline-flex items-center gap-1">
                  <span className="w-4 h-4 border border-foreground/40 flex items-center justify-center font-bold text-[9px]">
                    {s.code}
                  </span>
                  {s.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs border-t border-foreground/30 pt-3 mb-8">
              <div><span className="font-bold">Status released By:</span></div>
              <div><span className="font-bold">Signature:</span></div>
              <div><span className="font-bold">Date:</span></div>
            </div>

            <div className="text-[8px] text-muted-foreground leading-relaxed border-t border-border pt-2">
              Disclaimer: Sampling Technic is applied in all Checking, Review, Witness & Inspections. Hence, any Approval by Consultant shall not relieve the Contractor from his obligation to deliver Products & Workmanship in accordance with every Contract Documents.
            </div>

            <div className="flex justify-between text-[9px] text-muted-foreground mt-4 pt-2 border-t border-border">
              <span>Document No: HIPPL/QAP/FM/TDC/01</span>
              <span>Rev: 1</span>
              <span>Date of issue: 24-Jan-2025</span>
            </div>
          </div>

          {/* Page Break */}
          <div className="border-t-2 border-dashed border-border my-8 print:hidden" />
          <div className="print:break-before-page" />

          {/* Page 2: Material Submission Checklist */}
          <div className="font-document text-foreground">
            <h1 className="text-center text-lg font-bold tracking-wide mb-6 border-b-2 border-foreground pb-2">
              MATERIAL SUBMISSION CHECKLIST
            </h1>

            <div className="grid grid-cols-2 gap-y-3 text-xs mb-6">
              <div>
                <span className="font-bold">Material Submission Reference No:</span>{" "}
                <span className="font-mono">{formData.materialRefNo}</span>
              </div>
              <div><span className="font-bold">Rev:</span> 0</div>
              <div><span className="font-bold">Material Description:</span> {formData.product}</div>
              <div>
                <span className="font-bold">Type:</span>{" "}
                {formData.materialType === "single" ? "Single Material" : "Full System with All Accessories"}
              </div>
              <div><span className="font-bold">Manufacturer & Supplier:</span> {formData.brand}</div>
              <div><span className="font-bold">Area of Application:</span> {formData.areaOfApplication}</div>
              <div className="col-span-2">
                <span className="font-bold">Specification / IS Code Reference:</span> {formData.specReference || "—"}
              </div>
            </div>

            <table className="w-full text-xs border border-foreground/30">
              <thead>
                <tr className="border-b border-foreground/30">
                  <th className="text-left p-2 font-bold w-8">Sl.</th>
                  <th className="text-left p-2 font-bold">Document / Details Required</th>
                  <th className="text-center p-2 font-bold w-20">Provided</th>
                  <th className="text-left p-2 font-bold w-20">Annexure</th>
                  <th className="text-left p-2 font-bold w-40">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {checklistItems.map((item) => (
                  <tr key={item.slNo} className="border-b border-foreground/20">
                    <td className="p-2 tabular-nums">{item.slNo}</td>
                    <td className="p-2">
                      {item.description}
                      {item.slNo === 2 && (
                        <div className="mt-1 text-[10px]">
                          <span className="font-bold">Status: </span>{makeStatusLabel}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {formData.checklistProvided[item.slNo] ? "✓" : "—"}
                    </td>
                    <td className="p-2">{item.annexure}</td>
                    <td className="p-2">{formData.checklistRemarks[item.slNo] || item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
