import { useMemo, useRef } from "react";
import { type TransmittalFormData, checklistItems, type ComplianceTable } from "@/data/approvedVendors";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "@/components/PdfPreview";
import { cn } from "@/lib/utils";
import { X, Download, FileText } from "lucide-react";

interface AnnexurePageProps {
  annexureNo: number;
  description?: string;
  file: File;
  pageBoxStyle: React.CSSProperties;
  LogoHeader: React.FC;
}

const AnnexurePage = ({ annexureNo, description, file, pageBoxStyle, LogoHeader }: AnnexurePageProps) => (
  <div
    className="bg-surface shadow-2xl mx-auto print:shadow-none print:break-before-page flex flex-col"
    style={pageBoxStyle}
  >
    <div className="font-document text-foreground flex flex-col flex-1">
      <LogoHeader />

      <div
        className="border border-foreground/40 rounded-sm mb-4 flex flex-col items-center justify-center text-center px-6 py-8"
        style={{ minHeight: "120mm" }}
      >
        <div className="text-xs tracking-wide mb-2">MATERIAL APPROVAL SUBMITTAL</div>
        <div className="text-lg font-bold mb-4">ANNEXURE - {annexureNo}</div>
        {description && (
          <div className="max-w-xl text-xs text-left leading-relaxed">{description}</div>
        )}
        <div className="h-px w-32 bg-foreground/60 mt-6 mb-2" />
        <div className="text-[10px] text-muted-foreground">Supporting document attached</div>
        <div className="mt-4 text-[10px] text-muted-foreground">
          (This annexure shall be read in conjunction with approved MAS)
        </div>
      </div>

      {/* Preview uploaded file - constrained to page */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {file.type.startsWith("image/") ? (
          <div className="border border-foreground/20 rounded-sm p-2">
            <img
              src={URL.createObjectURL(file)}
              alt={`Annexure #${annexureNo}`}
              className="w-full h-auto max-h-[120mm] object-contain mx-auto"
            />
          </div>
        ) : file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? (
          <PdfPreview file={file} className="border border-foreground/20 rounded-sm overflow-hidden bg-white max-h-[120mm]" />
        ) : (
          <div className="border border-foreground/20 rounded-sm p-6 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Document attached — {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface DocumentPreviewProps {
  formData: TransmittalFormData;
  /** Required for modal variant (close button). */
  onClose?: () => void;
  /** `embedded` = live side-by-side preview; `modal` = fullscreen overlay (default). */
  variant?: "modal" | "embedded";
}

const DocumentPreview = ({ formData, onClose, variant = "modal" }: DocumentPreviewProps) => {
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const isEmbedded = variant === "embedded";

  const handleDownload = () => {
    previewScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const HORIZON_LOGO_SRC = "/Horizon-logo.png";
  const PMC = "/pmc-logo.png";
  const CONTRACTOR_LOGO = "/contrctor-logo.png";


  const makeStatusLabel =
    formData.makeStatus === "approved"
      ? "Approved Make"
      : formData.makeStatus === "alternative"
        ? "Alternative Proposal"
        : formData.makeStatus === "non_tender"
          ? "Non Tender Item"
          : "—";

  // Compute annexure map (only checked items, incrementing)
  const annexureMap = useMemo(() => {
    const map: Record<number, number> = {};
    let counter = 0;
    checklistItems.forEach((item) => {
      if (formData.checklistProvided[item.slNo]) {
        counter++;
        map[item.slNo] = counter;
      }
    });
    return map;
  }, [formData.checklistProvided]);

  // Collect uploaded files in annexure order
  const annexureFiles = useMemo(() => {
    const files: { annexureNo: number; slNo: number; file: File }[] = [];
    checklistItems.forEach((item) => {
      if (annexureMap[item.slNo] && formData.checklistFiles[item.slNo]) {
        files.push({
          annexureNo: annexureMap[item.slNo],
          slNo: item.slNo,
          file: formData.checklistFiles[item.slNo]!,
        });
      }
    });
    return files;
  }, [annexureMap, formData.checklistFiles]);

  // Compliance table annexures (continue numbering after checklist annexures)
  const complianceAnnexures = useMemo(() => {
    const lastAnnexure = Object.values(annexureMap).length > 0 ? Math.max(...Object.values(annexureMap)) : 0;
    return formData.complianceTables
      .filter((t) => t.attachedFile)
      .map((t, i) => ({
        annexureNo: lastAnnexure + i + 1,
        table: t,
        file: t.attachedFile!,
      }));
  }, [annexureMap, formData.complianceTables]);

  const docIssueDate = formData.date;

  const pageBoxStyle = useMemo(
    () =>
      isEmbedded
        ? ({
            width: "100%",
            maxWidth: "210mm",
            minHeight: "297mm",
            padding: "15mm 20mm",
            boxSizing: "border-box",
          } as const)
        : ({
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm 20mm",
            boxSizing: "border-box",
          } as const),
    [isEmbedded]
  );

  const PageFooter = ({
    pageNo,
    rev,
    date,
  }: {
    pageNo: number;
    rev: string;
    date: string;
  }) => (
    <div className="grid grid-cols-3 gap-4 text-[9px] text-muted-foreground pt-4 mt-auto border-t border-border">
      <div className="text-left">Document No: HIPPUQAP/FM/TDC/{pageNo}</div>
      <div className="text-center">Rev: {rev}</div>
      <div className="text-right">Date of issue: {date}</div>
    </div>
  );

  const LogoHeader = () => (
    <div className="mb-4 border border-foreground grid grid-cols-3 min-h-[88px]">
      <div className="flex items-center justify-center border-r border-foreground bg-white p-3">
        <img
          src={HORIZON_LOGO_SRC}
          alt="Horizon Industrial Parks"
          className="h-[72px] w-full max-w-full object-contain"
        />
      </div>
      <div className="flex items-center justify-center border-r border-foreground bg-white p-3">
        <img src={PMC} alt="PMC" className="h-[72px] w-full max-w-full object-contain" />
      </div>
      <div className="flex items-center justify-center bg-white p-3">
        <img
          src={CONTRACTOR_LOGO}
          alt="Contractor"
          className="h-[72px] w-full max-w-full object-contain"
        />
      </div>
    </div>
  );

  const previewBody = (
    <div
      ref={previewScrollRef}
      data-document-preview-scroll
      className={cn(
        "flex flex-col items-center gap-8 print:gap-0",
        isEmbedded
          ? "flex-1 min-h-0 overflow-y-auto overflow-x-auto p-3 sm:p-4"
          : "flex-1 overflow-auto p-8 print:p-0"
      )}
    >
        {/* Page 1: Transmittal (logo through Status released By block + footer) */}
        <div
          className="bg-surface shadow-2xl mx-auto print:shadow-none flex flex-col"
          style={pageBoxStyle}
        >
          <div className="font-document flex flex-col flex-1 text-neutral-900">
            <LogoHeader />

            <h1 className="text-center text-lg font-bold tracking-wide mb-6 border-b-2 border-neutral-900 pb-2">
              TRANSMITTAL OF DOCUMENTS
            </h1>

            {/* Header Grid - table style (4 columns) with spacing to avoid overlap */}
            <div className="text-xs mb-6 border border-foreground/40">
              <div
                className="grid gap-0"
                style={{
                  gridTemplateColumns: "minmax(120px, 150px) 1fr minmax(60px, 80px) 1fr",
                }}
              >
                <div className="font-bold border-r border-b border-foreground/40 px-3 py-2">Transmittal Ref. No:</div>
                <div className="border-r border-b border-foreground/40 px-3 py-2 tabular-nums break-all min-w-0">
                  {formData.transmittalRefNo}
                </div>
                <div className="font-bold border-r border-b border-foreground/40 px-3 py-2">Date:</div>
                <div className="border-b border-foreground/40 px-3 py-2">{formData.date}</div>

                <div className="font-bold border-r border-b border-foreground/40 px-3 py-2">Project Name:</div>
                <div className="border-r border-b border-foreground/40 px-3 py-2 min-w-0">{formData.projectName}</div>
                <div className="font-bold border-r border-b border-foreground/40 px-3 py-2">Project No:</div>
                <div className="border-b border-foreground/40 px-3 py-2">{formData.projectNo || "—"}</div>

                <div className="font-bold border-r border-b border-foreground/40 px-3 py-2">Location:</div>
                <div className="border-r border-b border-foreground/40 px-3 py-2 min-w-0">{formData.location}</div>
                <div className="font-bold border-r border-b border-foreground/40 px-3 py-2">Work Order #:</div>
                <div className="border-b border-foreground/40 px-3 py-2">{formData.workOrderNo}</div>
              </div>
            </div>

            {/* Type of Document - match PDF style with checkboxes */}
            <div className="text-xs mb-6">
              <div className="font-bold mb-1">Type of Document :</div>
              <div className="grid grid-cols-4 gap-y-1 gap-x-3 max-w-full">
                {[
                  "Project Plans",
                  "Material Submittal",
                  "Manuals",
                  "Sample / Catalog",
                  "Test Reports",
                  "Calibration Certificate",
                  "Drawings",
                  "Design Mix",
                  "Method Statement",
                  "Technical Submittal",
                  "Pre-Qualification",
                  "Reports",
                  "Calculations",
                  "Audit Report",
                  "RFI",
                  "Other Certificates",
                  "Organization Chart",
                  "Proposals",
                  "Registers",
                  "Other Documents",
                ].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1">
                    <span
                      className={`inline-flex items-center justify-center w-3 h-3 border border-foreground/60 text-[9px] leading-none`}
                    >
                      {formData.documentType === label ? "✓" : ""}
                    </span>
                    <span className="whitespace-nowrap">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Submittal Details - improved table */}
            <h2 className="text-sm font-bold mb-3 border-b border-border pb-1">1. SUBMITTAL DETAILS</h2>
            <div className="text-xs mb-4">
              <span className="font-bold">Area of Application:</span> {formData.areaOfApplication || "—"}
            </div>

            <div className="border border-neutral-300 rounded-sm overflow-hidden mb-6 bg-white [print-color-adjust:exact]">
              <table className="w-full table-fixed border-collapse text-xs text-neutral-900">
                <colgroup>
                  <col className="w-[6%]" />
                  <col className="w-[26%]" />
                  <col className="w-[8%]" />
                  <col className="w-[10%]" />
                  <col className="w-[32%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="text-left p-3 font-bold border border-neutral-300 align-top">Sr.</th>
                    <th className="text-left p-3 font-bold border border-neutral-300 align-top">Document No.</th>
                    <th className="text-left p-3 font-bold border border-neutral-300 align-top">Rev.</th>
                    <th className="text-center p-3 font-bold border border-neutral-300 align-top">Copies</th>
                    <th className="text-left p-3 font-bold border border-neutral-300 align-top">Description</th>
                    <th className="text-left p-3 font-bold border border-neutral-300 align-top">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 tabular-nums border border-neutral-300 align-top">1</td>
                    <td className="p-3 font-mono text-[11px] border border-neutral-300 align-top break-all">
                      {formData.materialRefNo || "—"}
                    </td>
                    <td className="p-3 border border-neutral-300 align-top">0</td>
                    <td className="p-3 text-center border border-neutral-300 align-top">1</td>
                    <td className="p-3 border border-neutral-300 align-top break-words">
                      {formData.product
                        ? `MAS for ${formData.product}${formData.brand ? ` (Make: ${formData.brand})` : ""}`
                        : "—"}
                    </td>
                    <td className="p-3 border border-neutral-300 align-top break-words">
                      {formData.materialRemarks || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transmitted For */}
            <div className="text-xs mb-6">
              <span className="font-bold">These are transmitted for: </span>
              <span className="inline-flex gap-4 ml-2">
                {["Information", "Approval", "Checking", "For Construction"].map((opt) => (
                  <span key={opt} className="inline-flex items-center gap-1">
                    <span
                      className="inline-flex items-center justify-center w-3 h-3 border border-foreground/60 text-[9px] leading-none"
                    >
                      {formData.transmittedFor === opt ? "✓" : ""}
                    </span>
                    {opt}
                  </span>
                ))}
              </span>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 text-xs border-t border-foreground/30 pt-3 mb-6">
              <div>
                <span className="font-bold block mb-1">Submitted By:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Signature:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Date:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Received By:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Signature:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Date:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
            </div>

            {/* Consultant Comments */}
            <h2 className="text-sm font-bold mb-3 border-b border-border pb-1">
              2. THE CONSULTANT / ENGINEER COMMENTS:
            </h2>
            <div className="min-h-[60px] text-xs mb-4 border-b border-dashed border-border">

                <textarea name="" id="" className="min-w-[4rem]"></textarea>

            </div>

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

            <div className="grid grid-cols-3 gap-4 text-xs border-t border-foreground/30 pt-3 mb-6">
              <div>
                <span className="font-bold block mb-1">Status released By:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Signature:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
              <div>
                <span className="font-bold block mb-1">Date:</span>
                <div className="border-b border-dashed border-foreground/50 h-6" />
              </div>
            </div>

            <PageFooter pageNo={1} rev="1" date={docIssueDate} />
          </div>
        </div>

        {/* Page 2: Material Submission Checklist (logo + checklist + legend + footer) */}
        <div
          className="bg-surface shadow-2xl mx-auto print:shadow-none print:break-before-page flex flex-col"
          style={pageBoxStyle}
        >
          <div className="font-document flex flex-col flex-1 text-neutral-900">
            <LogoHeader />

            <h1 className="text-center text-lg font-bold tracking-wide mb-6 border-b-2 border-neutral-900 pb-2">
              MATERIAL SUBMISSION CHECKLIST
            </h1>

            <div className="grid grid-cols-2 gap-y-3 text-xs mb-6">
              <div>
                <span className="font-bold">Material Submission Reference No:</span>{" "}
                <span className="font-mono">{formData.materialRefNo}</span>
              </div>
              <div>
                <span className="font-bold">Rev:</span> 0
              </div>
              <div>
                <span className="font-bold">Material Description:</span> {formData.product}
              </div>
              <div>
                <span className="font-bold">Type:</span>{" "}
                {formData.materialType === "single"
                  ? "Single Material"
                  : formData.materialType === "full_system"
                  ? "Full System with All Accessories"
                  : "—"}
              </div>
              <div>
                <span className="font-bold">Manufacturer & Supplier:</span> {formData.brand}
              </div>
              <div>
                <span className="font-bold">Area of Application:</span> {formData.areaOfApplication}
              </div>
              <div className="col-span-2">
                <span className="font-bold">Specification / IS Code Reference:</span>{" "}
                {formData.specReference || "—"}
              </div>
            </div>

            {/* Improved checklist table */}
            <div className="border border-foreground/30 rounded-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-bold border-r border-foreground/20 w-10">Sl.</th>
                    <th className="text-left p-3 font-bold border-r border-foreground/20">
                      Document / Details Required
                    </th>
                    <th className="text-center p-3 font-bold border-r border-foreground/20 w-20">Status</th>
                    <th className="text-center p-3 font-bold border-r border-foreground/20 w-24">Annexure</th>
                    <th className="text-left p-3 font-bold w-40">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistItems.map((item) => {
                    const isProvided = formData.checklistProvided[item.slNo];
                    const annexureNo = annexureMap[item.slNo];
                    const hasFile = !!formData.checklistFiles[item.slNo];

                    let statusLabel = "NA";
                    if (isProvided && hasFile) {
                      statusLabel = "CP"; // Comply
                    } else if (isProvided && !hasFile) {
                      statusLabel = "PC"; // Partially comply
                    }

                    return (
                      <tr key={item.slNo} className="border-t border-foreground/20">
                        <td className="p-3 tabular-nums border-r border-foreground/10">{item.slNo}</td>
                        <td className="p-3 border-r border-foreground/10">
                          {item.description}
                          {item.slNo === 2 && (
                            <div className="mt-1 text-[10px]">
                              <span className="font-bold">Status: </span>
                              {makeStatusLabel}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center border-r border-foreground/10">{statusLabel}</td>
                        <td className="p-3 text-center border-r border-foreground/10 font-medium">
                          {isProvided && annexureNo ? `Annexure #${annexureNo}` : ""}
                        </td>
                        <td className="p-3">
                          {formData.checklistRemarks[item.slNo] || item.remarks}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend below checklist table */}
            <div className="text-[10px] text-muted-foreground mt-4 flex flex-wrap gap-x-6 gap-y-1">
              <span><strong>CP:</strong> Comply</span>
              <span><strong>NC:</strong> Not comply</span>
              <span><strong>PC:</strong> Partially comply</span>
              <span><strong>NA:</strong> Not applicable/available</span>
            </div>

            <PageFooter pageNo={2} rev="0" date={docIssueDate} />
          </div>
        </div>

        {/* Compliance Statement Tables */}
        {formData.complianceTables.length > 0 &&
          formData.complianceTables.map((table, idx) => (
            <div
              key={table.id}
              className="bg-surface shadow-2xl mx-auto print:shadow-none print:break-before-page flex flex-col"
              style={pageBoxStyle}
            >
              <div className="font-document flex flex-col flex-1 text-neutral-900">
                <LogoHeader />
                <h1 className="text-center text-base font-bold tracking-wide mb-4 border-b-2 border-neutral-900 pb-2">
                  COMPLIANCE STATEMENT FOR TECHNICAL REQUIREMENTS
                </h1>

                <div className="text-xs mb-3 space-y-1">
                  <div><span className="font-bold">Document Description:</span> {table.documentDescription || "—"}</div>
                  <div><span className="font-bold">Manufacturer / Supplier:</span> {formData.brand || "—"}</div>
                </div>

                <div className="border border-foreground/30 rounded-sm overflow-hidden flex-1">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2 font-bold border-r border-foreground/20 w-8">Sl.</th>
                        <th className="text-left p-2 font-bold border-r border-foreground/20">Technical Requirements</th>
                        <th className="text-left p-2 font-bold border-r border-foreground/20 w-[18%]">Limits (IS Code)</th>
                        <th className="text-left p-2 font-bold border-r border-foreground/20 w-[12%]">TDS</th>
                        <th className="text-left p-2 font-bold border-r border-foreground/20 w-[12%]">MTC</th>
                        <th className="text-center p-2 font-bold border-r border-foreground/20 w-[10%]">Status</th>
                        <th className="text-left p-2 font-bold w-[14%]">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row) => (
                        <tr key={row.id} className="border-t border-foreground/20">
                          <td className="p-2 tabular-nums border-r border-foreground/10">{row.slNo}</td>
                          <td className="p-2 border-r border-foreground/10">{row.technicalRequirement || "—"}</td>
                          <td className="p-2 border-r border-foreground/10">{row.limits || "—"}</td>
                          <td className="p-2 border-r border-foreground/10">{row.valuesPerTDS || "—"}</td>
                          <td className="p-2 border-r border-foreground/10">{row.valuesPerMTC || "—"}</td>
                          <td className="p-2 text-center border-r border-foreground/10 font-semibold">{row.status}</td>
                          <td className="p-2">{row.contractorsResponse || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-muted-foreground mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  <span><strong>CP:</strong> Comply</span>
                  <span><strong>NC:</strong> Not Comply</span>
                  <span><strong>PC:</strong> Partially Comply</span>
                  <span><strong>NA:</strong> Not Applicable</span>
                </div>

                <PageFooter pageNo={3 + idx} rev="0" date={docIssueDate} />
              </div>
            </div>
          ))}

        {/* Annexure Uploaded Documents - checklist files */}
        {annexureFiles.length > 0 &&
          annexureFiles.map(({ annexureNo, slNo, file }) => {
            const checklistItem = checklistItems.find((i) => i.slNo === slNo);
            return (
              <AnnexurePage
                key={`checklist-${annexureNo}`}
                annexureNo={annexureNo}
                description={checklistItem?.description}
                file={file}
                pageBoxStyle={pageBoxStyle}
                LogoHeader={LogoHeader}
              />
            );
          })}

        {/* Annexure Uploaded Documents - compliance table files */}
        {complianceAnnexures.length > 0 &&
          complianceAnnexures.map(({ annexureNo, table, file }) => (
            <AnnexurePage
              key={`compliance-${annexureNo}`}
              annexureNo={annexureNo}
              description={`Compliance Statement: ${table.documentDescription || "Technical Requirements"}`}
              file={file}
              pageBoxStyle={pageBoxStyle}
              LogoHeader={LogoHeader}
            />
          ))}
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="flex flex-col h-full min-h-[320px] border border-border rounded-sm bg-muted/10 shadow-sm xl:max-h-full print:h-auto print:max-h-none print:border-0 print:shadow-none">
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-surface shrink-0 print:hidden">
          <span className="text-xs font-semibold text-foreground">Live preview</span>
          <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-sm h-8 text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Print / Save PDF
          </Button>
        </div>
        {previewBody}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-muted-foreground/60 flex flex-col print:bg-surface">
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
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/10 rounded-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {previewBody}
    </div>
  );
};

export default DocumentPreview;
