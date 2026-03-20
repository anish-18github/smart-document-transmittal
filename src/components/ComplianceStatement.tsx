import { useRef } from "react";
import { Plus, Trash2, Upload, FileCheck, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ComplianceTable,
  type ComplianceStatus,
  createComplianceRow,
} from "@/data/approvedVendors";

interface ComplianceStatementProps {
  tables: ComplianceTable[];
  onTablesChange: (tables: ComplianceTable[]) => void;
  onAddTable: () => void;
}

const statusOptions: { value: ComplianceStatus; label: string; color: string }[] = [
  { value: "CP", label: "CP – Comply", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "NC", label: "NC – Not Comply", color: "text-red-700 bg-red-50 border-red-200" },
  { value: "PC", label: "PC – Partially Comply", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "NA", label: "NA – Not Applicable", color: "text-muted-foreground bg-muted border-border" },
];

const ComplianceStatement = ({ tables, onTablesChange, onAddTable }: ComplianceStatementProps) => {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateTable = (tableId: string, patch: Partial<ComplianceTable>) => {
    onTablesChange(tables.map((t) => (t.id === tableId ? { ...t, ...patch } : t)));
  };

  const updateRow = (tableId: string, rowId: string, patch: Record<string, string>) => {
    onTablesChange(
      tables.map((t) =>
        t.id === tableId
          ? { ...t, rows: t.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) }
          : t
      )
    );
  };

  const addRow = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    const nextSlNo = table.rows.length + 1;
    updateTable(tableId, { rows: [...table.rows, createComplianceRow(nextSlNo)] });
  };

  const removeRow = (tableId: string, rowId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || table.rows.length <= 1) return;
    const newRows = table.rows.filter((r) => r.id !== rowId).map((r, i) => ({ ...r, slNo: i + 1 }));
    updateTable(tableId, { rows: newRows });
  };

  const removeTable = (tableId: string) => {
    onTablesChange(tables.filter((t) => t.id !== tableId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          Compliance Statement for Technical Requirements
        </h2>
      </div>

      {tables.map((table, tableIndex) => (
        <div key={table.id} className="border border-border rounded-xl bg-surface p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground">
              Table {tableIndex + 1}
            </span>
            {tables.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTable(table.id)}
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Table
              </Button>
            )}
          </div>

          {/* Document Description */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">
              Document Description
            </label>
            <Input
              value={table.documentDescription}
              onChange={(e) => updateTable(table.id, { documentDescription: e.target.value })}
              className="h-9 text-xs rounded-lg border-border bg-background"
              placeholder="Enter document description"
            />
          </div>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs min-w-[700px]">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5 w-10">Sl.</th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5">Technical Requirements</th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5 w-[130px]">Limits (IS Code)</th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5 w-[100px]">Values (TDS)</th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5 w-[100px]">Values (MTC)</th>
                  <th className="text-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5 w-[120px]">Status</th>
                  <th className="text-left text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2.5 w-[120px]">Response</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.id} className="border-t border-border hover:bg-accent/30 transition-colors">
                    <td className="px-3 py-2 text-muted-foreground tabular-nums">{row.slNo}</td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.technicalRequirement}
                        onChange={(e) => updateRow(table.id, row.id, { technicalRequirement: e.target.value })}
                        className="h-7 text-xs rounded-md border-border bg-background"
                        placeholder="Requirement"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.limits}
                        onChange={(e) => updateRow(table.id, row.id, { limits: e.target.value })}
                        className="h-7 text-xs rounded-md border-border bg-background"
                        placeholder="Limits"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.valuesPerTDS}
                        onChange={(e) => updateRow(table.id, row.id, { valuesPerTDS: e.target.value })}
                        className="h-7 text-xs rounded-md border-border bg-background"
                        placeholder="TDS"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.valuesPerMTC}
                        onChange={(e) => updateRow(table.id, row.id, { valuesPerMTC: e.target.value })}
                        className="h-7 text-xs rounded-md border-border bg-background"
                        placeholder="MTC"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Select
                        value={row.status}
                        onValueChange={(val) => updateRow(table.id, row.id, { status: val })}
                      >
                        <SelectTrigger className="h-7 text-xs rounded-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.contractorsResponse}
                        onChange={(e) => updateRow(table.id, row.id, { contractorsResponse: e.target.value })}
                        className="h-7 text-xs rounded-md border-border bg-background"
                        placeholder="Response"
                      />
                    </td>
                    <td className="px-1 py-2">
                      {table.rows.length > 1 && (
                        <button
                          onClick={() => removeRow(table.id, row.id)}
                          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addRow(table.id)}
              className="h-8 text-xs rounded-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
            </Button>

            {/* Document upload */}
            <button
              onClick={() => fileRefs.current[table.id]?.click()}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer
                ${table.attachedFile
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
                  : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                }`}
            >
              {table.attachedFile ? (
                <>
                  <FileCheck className="w-3.5 h-3.5" />
                  {table.attachedFile.name.length > 20
                    ? table.attachedFile.name.slice(0, 20) + "…"
                    : table.attachedFile.name}
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Attach Document
                </>
              )}
            </button>
            <input
              type="file"
              ref={(el) => { fileRefs.current[table.id] = el; }}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateTable(table.id, { attachedFile: file });
              }}
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={onAddTable}
        className="w-full h-10 text-xs rounded-xl border-dashed"
      >
        <PlusCircle className="w-4 h-4 mr-1.5" /> Add Another Compliance Table
      </Button>
    </div>
  );
};

export default ComplianceStatement;
