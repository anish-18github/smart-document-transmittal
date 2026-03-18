import { approvedVendorList } from "@/data/approvedVendors";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProductBrandSelectorProps {
  product: string;
  brand: string;
  areaOfApplication: string;
  specReference: string;
  onProductChange: (val: string) => void;
  onBrandChange: (val: string) => void;
  onAreaChange: (val: string) => void;
  onSpecChange: (val: string) => void;
}

const ProductBrandSelector = ({
  product,
  brand,
  areaOfApplication,
  specReference,
  onProductChange,
  onBrandChange,
  onAreaChange,
  onSpecChange,
}: ProductBrandSelectorProps) => {
  const selectedProduct = approvedVendorList.find((p) => p.product === product);
  const vendors = selectedProduct?.vendors || [];

  return (
    <div className="space-y-4">
      <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-4">
        Material Details
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Product
          </Label>
          <Select value={product} onValueChange={(val) => { onProductChange(val); onBrandChange(""); }}>
            <SelectTrigger className="mt-1 rounded-sm bg-surface">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {approvedVendorList.map((item) => (
                <SelectItem key={item.srNo} value={item.product}>
                  {item.product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Brand / Manufacturer
          </Label>
          <Select value={brand} onValueChange={onBrandChange} disabled={!product}>
            <SelectTrigger className="mt-1 rounded-sm bg-surface">
              <SelectValue placeholder={product ? "Select brand" : "Select product first"} />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Area of Application
          </Label>
          <Input
            className="mt-1 rounded-sm bg-surface"
            value={areaOfApplication}
            onChange={(e) => onAreaChange(e.target.value)}
            placeholder="e.g., Block E, F and Associated Infra Works"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Specification / IS Code Reference
          </Label>
          <Input
            className="mt-1 rounded-sm bg-surface"
            value={specReference}
            onChange={(e) => onSpecChange(e.target.value)}
            placeholder="e.g., IS 1786:2008"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductBrandSelector;
