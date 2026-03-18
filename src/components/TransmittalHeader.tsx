import { defaultFormData, type TransmittalFormData } from "@/data/approvedVendors";

interface TransmittalHeaderProps {
  formData: TransmittalFormData;
}

const TransmittalHeader = ({ formData }: TransmittalHeaderProps) => {
  const fields = [
    { label: "Transmittal Ref. No", value: formData.transmittalRefNo },
    { label: "Date", value: formData.date },
    { label: "Project Name", value: formData.projectName },
    { label: "Project No", value: formData.projectNo || "—" },
    { label: "Location", value: formData.location },
    { label: "Work Order #", value: formData.workOrderNo },
    { label: "From", value: formData.from },
  ];

  return (
    <div className="bg-secondary rounded-sm border border-border p-6">
      <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-4">
        Project Information
      </h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {fields.map((field) => (
          <div key={field.label}>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              {field.label}
            </span>
            <span className="text-sm font-medium text-foreground tabular-nums">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransmittalHeader;
