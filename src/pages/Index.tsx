import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransmittalHeader from "@/components/TransmittalHeader";
import DocTypeSelector from "@/components/DocTypeSelector";
import MaterialTypeSelector from "@/components/MaterialTypeSelector";
import ProductBrandSelector from "@/components/ProductBrandSelector";
import MaterialChecklist from "@/components/MaterialChecklist";
import DocumentPreview from "@/components/DocumentPreview";
import {
  type TransmittalFormData,
  type DocumentType,
  type MaterialType,
  type MakeStatus,
  createDefaultFormData,
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
  const [showPreview, setShowPreview] = useState(false);

  // Fetch geolocation on mount
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

  const isFormComplete =
    formData.documentType === "Material Submittal" &&
    formData.materialType &&
    formData.product &&
    formData.brand &&
    formData.areaOfApplication &&
    formData.makeStatus;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-bold text-foreground tracking-tight">Transmittal of Documents</h1>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm ml-auto tabular-nums">
            HIPPL/QAP/FM/TDC/01 • Rev 1
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Auto-populated header */}
        <TransmittalHeader formData={formData} />

        {/* Document Type Selection */}
        <section className="bg-surface border border-border rounded-sm p-6">
          <DocTypeSelector selected={formData.documentType} onSelect={handleDocTypeSelect} />
        </section>

        {/* Material Submittal Flow */}
        <AnimatePresence mode="wait">
          {formData.documentType === "Material Submittal" && (
            <motion.section
              key="material-type"
              variants={section}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-surface border border-border rounded-sm p-6 overflow-hidden"
            >
              <MaterialTypeSelector selected={formData.materialType} onSelect={handleMaterialTypeSelect} />
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {formData.documentType === "Material Submittal" && formData.materialType === "single" && (
            <motion.section
              key="product-brand"
              variants={section}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-surface border border-border rounded-sm p-6 overflow-hidden"
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
            formData.materialType === "single" &&
            formData.product &&
            formData.brand && (
              <motion.section
                key="checklist"
                variants={section}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-surface border border-border rounded-sm p-6 overflow-hidden"
              >
                <MaterialChecklist
                  materialRefNo={formData.materialRefNo}
                  materialDescription={formData.product}
                  manufacturer={formData.brand}
                  makeStatus={formData.makeStatus}
                  checklistProvided={formData.checklistProvided}
                  checklistRemarks={formData.checklistRemarks}
                  checklistFiles={formData.checklistFiles}
                  onMakeStatusChange={(makeStatus: MakeStatus) => update({ makeStatus })}
                  onChecklistToggle={handleChecklistToggle}
                  onChecklistRemarkChange={handleChecklistRemarkChange}
                  onFileUpload={handleFileUpload}
                />
              </motion.section>
            )}
        </AnimatePresence>

        {/* Generate / Preview Button */}
        <AnimatePresence>
          {isFormComplete && (
            <motion.div variants={section} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
              <Button onClick={() => setShowPreview(true)} className="w-full h-12 rounded-sm text-sm font-semibold press-effect">
                <Eye className="w-4 h-4 mr-2" />
                Preview & Generate Document
              </Button>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Ensure all technical attachments are verified against the Approved Vendor List (AVL).
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Document Preview Modal */}
      {showPreview && <DocumentPreview formData={formData} onClose={() => setShowPreview(false)} />}
    </div>
  );
};

export default Index;
