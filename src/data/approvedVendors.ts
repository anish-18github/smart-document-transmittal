export interface ProductVendor {
  srNo: number;
  product: string;
  vendors: string[];
}

export const approvedVendorList: ProductVendor[] = [
  { srNo: 1, product: "Chloropyriphos", vendors: ["Nocil", "Kanoria", "Kitnesa", "Dhawan", "Montari", "Cynamide", "Dow Agro Sciences"] },
  { srNo: 2, product: "Cement - OPC 43/53 Grade, PPC", vendors: ["ACC", "Ultratech", "Lafarge"] },
  { srNo: 3, product: "White Cement", vendors: ["Birla", "JK White Cement"] },
  { srNo: 4, product: "Reinforcement Steel (rolled)", vendors: ["SAIL", "RINL", "JSW", "TISCO"] },
  { srNo: 5, product: "Structural Steel", vendors: ["SAIL", "RINL", "JSW"] },
  { srNo: 6, product: "Ready Mix Concrete", vendors: ["RMC Readymix", "Lafarge", "Ultratech", "ACC"] },
  { srNo: 7, product: "Chemicals, Admixtures, Waterproofing Compounds", vendors: ["Fosroc", "BASF", "Sika", "Pidilite"] },
  { srNo: 8, product: "Aluminum Sections", vendors: ["Jindal", "Balco", "Hindalco"] },
  { srNo: 9, product: "PP Fiber", vendors: ["Reliance", "Fibermesh", "Duracem", "Becard", "Eurofaster", "Cetex"] },
  { srNo: 10, product: "Plaster Mesh, Cover Block", vendors: ["Arpitha Exports", "Elmich"] },
  { srNo: 11, product: "Mechanical and Chemical Anchor Fasteners", vendors: ["Fischer", "HILTI", "Bosch"] },
  { srNo: 12, product: "Water Stops", vendors: ["Hydrotight of Water Seal India Pvt Ltd"] },
  { srNo: 13, product: "Wall Putty", vendors: ["Birla White", "JK White"] },
  { srNo: 14, product: "Galvalume Sheets", vendors: ["TATA Bluescope", "JSW Steels"] },
  { srNo: 15, product: "Rockwool / Glass Wool Insulation", vendors: ["Twiga", "Owens Corning", "Rockwool"] },
  { srNo: 16, product: "Expansion Filler Board", vendors: ["Supreme Industries", "Fosroc"] },
  { srNo: 17, product: "Polycarbonate Sheets", vendors: ["Sabic/GE", "Palram", "Danpalon", "Dow", "Owens Corning"] },
  { srNo: 18, product: "Insulation Boards (Extruded Polystyrene)", vendors: ["H & R Johnson"] },
  { srNo: 19, product: "Ceramic / Glazed / Vitrified Tiles", vendors: ["Kajaria", "Nitco", "Somany", "Orient", "Khodiyar"] },
  { srNo: 20, product: "Acid Resistant Tile", vendors: ["Rustile", "AArcoy", "H & R Johnson", "Basant Beton"] },
  { srNo: 21, product: "Interlock Pavers / Cobble Stone", vendors: ["Shobha", "Nitco", "Pavers India", "Wonderfloor"] },
  { srNo: 22, product: "Vinyl Flooring", vendors: ["Armstrong", "RMG"] },
  { srNo: 23, product: "False Flooring", vendors: ["Comfloor"] },
  { srNo: 24, product: "Steel Doors", vendors: ["Shakti Hormann", "Met-Dor", "Signum"] },
  { srNo: 25, product: "Fire Doors", vendors: ["Shakti Hormann", "Met-Dor", "Signum", "Green Ply", "Euro"] },
  { srNo: 26, product: "Commercial Board, Ply, Flush Door", vendors: ["Bhutan Board", "Grenlam", "Kitply", "Century", "Anchor", "Novapan"] },
  { srNo: 27, product: "Prelam Particle Board", vendors: ["Kitply", "Formica", "Greenlam"] },
  { srNo: 28, product: "Plastic Laminates", vendors: ["Formica", "Bakelite Hylam"] },
  { srNo: 29, product: "Wood Adhesives", vendors: ["Fevicol", "Pidilite"] },
  { srNo: 30, product: "Dry Wall Partition", vendors: ["Gypsteel", "Metecno", "Saint Gobain"] },
  { srNo: 31, product: "Gypsum Board", vendors: ["Lafarge", "Boral"] },
  { srNo: 32, product: "Cementitious Sheets", vendors: ["Bison", "Hyderabad Industries"] },
  { srNo: 33, product: "Ceiling Systems", vendors: ["Armstrong", "Saint Gobain"] },
  { srNo: 34, product: "Hardware of Door and Windows", vendors: ["Dorma", "Dorset", "Ozone", "Nirmal Automation"] },
  { srNo: 35, product: "Motorized Rolling Shutters", vendors: ["Avvians", "Nivha", "Gandhi Automation", "Ditech"] },
  { srNo: 36, product: "Sectional Doors", vendors: ["Gandhi Automation", "Shakti Hormann", "Kelly India", "Rite Hite"] },
  { srNo: 37, product: "Glazing Works", vendors: ["Saint Gobain", "Asahi Float", "TATA"] },
  { srNo: 38, product: "G.I. Pipe", vendors: ["Jindal", "Zenith", "Metaflex", "Supreme"] },
  { srNo: 39, product: "UPVC / PVC Pipes", vendors: ["Finolex", "Jain", "Astral"] },
  { srNo: 40, product: "C.I. Pipes", vendors: ["Neo"] },
  { srNo: 41, product: "C.I. Chamber Covers", vendors: ["Neco"] },
  { srNo: 42, product: "PVC Water Tank", vendors: ["Sintex", "Supreme", "Parryware"] },
  { srNo: 43, product: "Sanitary Ware", vendors: ["Hindware", "TOTO"] },
  { srNo: 44, product: "Sanitary Fittings", vendors: ["Jaguar", "TOTO", "Hindware"] },
  { srNo: 45, product: "Steel Sinks", vendors: ["Nirali", "Asian Paints"] },
  { srNo: 46, product: "Paints (Acrylic / Enamel / Cement)", vendors: ["Jotun", "Nerolac", "ICI-Dulux"] },
  { srNo: 47, product: "Bitumen", vendors: ["IOCL", "HP", "BPCL"] },
];

export const documentTypes = [
  "Project Plans",
  "Material Submittal",
  "Method Statement",
  "Technical Submittal",
  "Pre-Qualification",
  "Reports",
  "Manuals",
  "Sample / Catalog",
  "Calculations",
  "Audit Report",
  "Test Reports",
  "Calibration Certificate",
  "Other Certificates",
  "Organization Chart",
  "Proposals",
  "Registers",
  "Drawings",
  "Design Mix",
  "NCR",
  "RFI",
  "Other Documents",
] as const;

export type DocumentType = (typeof documentTypes)[number];

export type MaterialType = "single" | "full_system";

export type MakeStatus = "approved" | "alternative" | "non_tender";

export interface ChecklistItem {
  slNo: number;
  description: string;
  remarks: string;
}

export const checklistItems: ChecklistItem[] = [
  {
    slNo: 1,
    description: "Company Profile, Technical Data Sheet (TDS) / Product Catalogue with All Accessories & Complete System",
    remarks: "If a Complete System / Assembly is proposed, then a List (TDS & Test Reports) of All Accessories shall be attached.",
  },
  {
    slNo: 2,
    description: "Approved Vendor/Brand/Make List (Highlighted)",
    remarks: "",
  },
  {
    slNo: 3,
    description: "Project Specification, BOQ, Drawings",
    remarks: "",
  },
  {
    slNo: 4,
    description: "Compliance Statement against WO/Specification/BOQ, Relevant Indian & International Standards Codes",
    remarks: "",
  },
  {
    slNo: 5,
    description: "Test Reports - MTC & 3rd Party (Sample)",
    remarks: "",
  },
];

export interface TransmittalFormData {
  transmittalRefNo: string;
  date: string;
  projectName: string;
  projectNo: string;
  location: string;
  workOrderNo: string;
  documentType: DocumentType | "";
  materialType: MaterialType | "";
  product: string;
  brand: string;
  materialRefNo: string;
  areaOfApplication: string;
  makeStatus: MakeStatus | "";
  checklistProvided: Record<number, boolean>;
  checklistRemarks: Record<number, string>;
  checklistFiles: Record<number, File | null>;
  transmittedFor: string;
  specReference: string;
}

function generateTransmittalRef(): string {
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `HIPPL/API/HLP/PPL/TMT/${num}`;
}

function generateWorkOrderNo(): string {
  const now = new Date();
  const fy1 = now.getMonth() >= 3 ? now.getFullYear() % 100 : (now.getFullYear() - 1) % 100;
  const fy2 = fy1 + 1;
  const seq = Math.floor(Math.random() * 9) + 1;
  return `WO/HLPBLDF/${fy1}-${fy2}/${seq}/1`;
}

export function createDefaultFormData(): TransmittalFormData {
  return {
    transmittalRefNo: generateTransmittalRef(),
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
    projectName: "Horizon Logistics Park",
    projectNo: "",
    location: "Fetching location…",
    workOrderNo: generateWorkOrderNo(),
    documentType: "",
    materialType: "",
    product: "",
    brand: "",
    materialRefNo: "",
    areaOfApplication: "",
    makeStatus: "",
    checklistProvided: {},
    checklistRemarks: {},
    checklistFiles: {},
    transmittedFor: "Approval",
    specReference: "",
  };
}

// Keep for backward compat but prefer createDefaultFormData()
export const defaultFormData: TransmittalFormData = createDefaultFormData();
