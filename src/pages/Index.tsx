import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import TransmittalHeader from "@/components/TransmittalHeader";
import DocTypeSelector from "@/components/DocTypeSelector";
import MaterialTypeSelector from "@/components/MaterialTypeSelector";
import ProductBrandSelector from "@/components/ProductBrandSelector";
import MaterialChecklist from "@/components/MaterialChecklist";
import ComplianceStatement from "@/components/ComplianceStatement";
import DocumentPreview from "@/components/DocumentPreview";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  type TransmittalFormData,
  type DocumentType,
  type MaterialType,
  type MakeStatus,
  type ComplianceTable,
  createDefaultFormData,
  createComplianceTable,
} from "@/data/approvedVendors";

const section = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

const Index = () => {
  const [formData, setFormData] = useState<TransmittalFormData>(createDefaultFormData);
  const [masNumber] = useState(() => Math.floor(Math.random() * 900) + 100);
  const isMobile = useIsMobile();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`
            );
            const data = await res.json();
            const addr = data.address || {};
            const locationStr = [
              addr.suburb || addr.neighbourhood || addr.village || addr.town || "",
              addr.city || addr.state_district || "",
              addr.state || "",
            ]
              .filter(Boolean)
              .join(", ");
            setFormData((prev) => ({ ...prev, location: locationStr || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          } catch {
            setFormData((prev) => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
        },
        () => {
          setFormData((prev) => ({ ...prev, location: "Location unavailable" }));
        }
      );
    }
  }, []);

  const update = useCallback(
    (patch: Partial<TransmittalFormData>) => setFormData((prev) => ({ ...prev, ...patch })),
    []
  );

  const handleDocTypeSelect = (type: DocumentType) => {
    update({ documentType: type, materialType: "", product: "", brand: "", materialRefNo: "" });
  };

  const handleMaterialTypeSelect = (type: MaterialType) => {
    update({ materialType: type });
  };

  const handleProductChange = (product: string) => {
    const refNo = `HIPPL/API/HLP/QUA/MAS/${String(masNumber).padStart(3, "0")}`;
    update({ product, brand: "", materialRefNo: refNo });
  };

  const handleChecklistToggle = (slNo: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistProvided: {
        ...prev.checklistProvided,
        [slNo]: !prev.checklistProvided[slNo],
      },
    }));
  };

  const handleChecklistRemarkChange = (slNo: number, remark: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistRemarks: { ...prev.checklistRemarks, [slNo]: remark },
    }));
  };

  const handleFileUpload = (slNo: number, file: File) => {
    setFormData((prev) => ({
      ...prev,
      checklistFiles: { ...prev.checklistFiles, [slNo]: file },
    }));
  };

  const formContent = (
    <div className="space-y-6 min-w-0 print:hidden p-4 sm:p-6 overflow-y-auto h-full">
      <TransmittalHeader formData={formData} />

      <section className="bg-surface border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-4">
          Type of Document / Material Submittal Type
        </h2>
        <div className="space-y-4">
          <DocTypeSelector selected={formData.documentType} onSelect={handleDocTypeSelect} showTitle={false} />
          <AnimatePresence mode="wait">
            {formData.documentType === "Material Submittal" && (
              <motion.div
                key="material-type"
                variants={section}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <MaterialTypeSelector
                  selected={formData.materialType}
                  onSelect={handleMaterialTypeSelect}
                  showTitle={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {formData.documentType === "Material Submittal" && formData.materialType && (
          <motion.section
            key="product-brand"
            variants={section}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-surface border border-border rounded-xl p-5 shadow-sm overflow-hidden"
          >
            <ProductBrandSelector
              product={formData.product}
              brand={formData.brand}
              areaOfApplication={formData.areaOfApplication}
              specReference={formData.specReference}
              onProductChange={handleProductChange}
              onBrandChange={(brand) => update({ brand })}
              onAreaChange={(areaOfApplication) => update({ areaOfApplication })}
              onSpecChange={(specReference) => update({ specReference })}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {formData.documentType === "Material Submittal" &&
          formData.materialType &&
          formData.product &&
          formData.brand && (
            <motion.section
              key="checklist"
              variants={section}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-surface border border-border rounded-xl p-5 shadow-sm overflow-hidden"
            >
              <MaterialChecklist
                materialRefNo={formData.materialRefNo}
                materialDescription={formData.product}
                manufacturer={formData.brand}
                materialRemarks={formData.materialRemarks}
                makeStatus={formData.makeStatus}
                checklistProvided={formData.checklistProvided}
                checklistRemarks={formData.checklistRemarks}
                checklistFiles={formData.checklistFiles}
                onMaterialRemarksChange={(materialRemarks) => update({ materialRemarks })}
                onMakeStatusChange={(makeStatus: MakeStatus) => update({ makeStatus })}
                onChecklistToggle={handleChecklistToggle}
                onChecklistRemarkChange={handleChecklistRemarkChange}
                onFileUpload={handleFileUpload}
              />
            </motion.section>
          )}
      </AnimatePresence>

      <p className="text-[11px] text-muted-foreground pb-4">
        The document on the right updates as you fill the form. Drag the divider to resize panels.
      </p>
    </div>
  );

  const previewContent = (
    <div className="h-full flex flex-col print:static print:block print:h-auto">
      <DocumentPreview formData={formData} variant="embedded" />
    </div>
  );

  return (
    <div className="min-h-screen h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-surface print:hidden shrink-0">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-bold text-foreground tracking-tight">Transmittal of Documents</h1>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg ml-auto tabular-nums">
            HIPPL/QAP/FM/TDC/01 • Rev 1
          </span>
        </div>
      </header>

      <div className="flex-1 min-h-0 print:block print:h-auto">
        {isMobile ? (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex-1 min-h-0">{formContent}</div>
            <div className="border-t border-border min-h-[50vh]">{previewContent}</div>
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={55} minSize={30} className="overflow-y-auto">
              {formContent}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={45} minSize={25} className="overflow-hidden">
              {previewContent}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default Index;
