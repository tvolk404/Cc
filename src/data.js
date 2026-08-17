/**
 * Dummy portfolio data for Haven.
 * Everything here is fabricated — no real people, addresses or figures.
 */

export const org = {
  name: "Haven Property Group",
  manager: "Tomaž Volk",
  currency: "EUR",
  locale: "en-IE",
};

export const properties = [
  {
    id: "p-ravnik",
    name: "Ravnik Residences",
    street: "Slovenska cesta 41",
    city: "Ljubljana",
    country: "SI",
    type: "Residential",
    units: 24,
    occupied: 23,
    sqm: 2140,
    value: 6_420_000,
    monthlyRent: 31_800,
    yield: 5.9,
    year: 2019,
    manager: "Ana Kovač",
    rating: 4.8,
    hue: 208,
  },
  {
    id: "p-marina",
    name: "Marina Court",
    street: "Obala 118",
    city: "Portorož",
    country: "SI",
    type: "Mixed use",
    units: 16,
    occupied: 14,
    sqm: 1780,
    value: 4_980_000,
    monthlyRent: 24_600,
    yield: 5.4,
    year: 2016,
    manager: "Ana Kovač",
    rating: 4.5,
    hue: 190,
  },
  {
    id: "p-lindenhof",
    name: "Lindenhof Lofts",
    street: "Bergmannstraße 7",
    city: "Munich",
    country: "DE",
    type: "Residential",
    units: 32,
    occupied: 31,
    sqm: 3260,
    value: 11_750_000,
    monthlyRent: 58_400,
    yield: 5.1,
    year: 2021,
    manager: "Jonas Weber",
    rating: 4.9,
    hue: 268,
  },
  {
    id: "p-atrium",
    name: "Atrium Offices",
    street: "Praterstraße 22",
    city: "Vienna",
    country: "AT",
    type: "Commercial",
    units: 12,
    occupied: 10,
    sqm: 4100,
    value: 9_300_000,
    monthlyRent: 47_900,
    yield: 6.2,
    year: 2014,
    manager: "Lena Fischer",
    rating: 4.2,
    hue: 24,
  },
  {
    id: "p-seehaus",
    name: "Seehaus Terraces",
    street: "Seestrasse 9",
    city: "Zurich",
    country: "CH",
    type: "Residential",
    units: 18,
    occupied: 18,
    sqm: 2380,
    value: 14_200_000,
    monthlyRent: 71_500,
    yield: 6.0,
    year: 2022,
    manager: "Lena Fischer",
    rating: 5.0,
    hue: 152,
  },
  {
    id: "p-navona",
    name: "Navona Suites",
    street: "Via Tortona 5",
    city: "Milan",
    country: "IT",
    type: "Short stay",
    units: 20,
    occupied: 17,
    sqm: 1620,
    value: 5_640_000,
    monthlyRent: 33_200,
    yield: 7.1,
    year: 2018,
    manager: "Marco Bianchi",
    rating: 4.6,
    hue: 340,
  },
  {
    id: "p-tabor",
    name: "Tabor Workshops",
    street: "Metelkova 12",
    city: "Ljubljana",
    country: "SI",
    type: "Commercial",
    units: 9,
    occupied: 7,
    sqm: 1950,
    value: 3_150_000,
    monthlyRent: 16_400,
    yield: 6.3,
    year: 2012,
    manager: "Ana Kovač",
    rating: 4.0,
    hue: 44,
  },
  {
    id: "p-donau",
    name: "Donau Garden",
    street: "Handelskai 84",
    city: "Vienna",
    country: "AT",
    type: "Residential",
    units: 28,
    occupied: 26,
    sqm: 2870,
    value: 8_100_000,
    monthlyRent: 41_300,
    yield: 6.1,
    year: 2020,
    manager: "Jonas Weber",
    rating: 4.7,
    hue: 118,
  },
];

export const tenants = [
  { id: "t-01", name: "Nika Zupan", unit: "A-204", propertyId: "p-ravnik", rent: 1450, since: "2022-03-01", leaseEnd: "2027-02-28", status: "current", score: 96 },
  { id: "t-02", name: "Erik Lund", unit: "B-112", propertyId: "p-ravnik", rent: 1320, since: "2023-09-15", leaseEnd: "2026-09-14", status: "notice", score: 88 },
  { id: "t-03", name: "Sofia Rossi", unit: "L-07", propertyId: "p-navona", rent: 1810, since: "2024-01-10", leaseEnd: "2027-01-09", status: "current", score: 92 },
  { id: "t-04", name: "Matteo Conti", unit: "L-11", propertyId: "p-navona", rent: 1640, since: "2021-06-01", leaseEnd: "2026-11-30", status: "late", score: 61 },
  { id: "t-05", name: "Hannah Vogt", unit: "3.OG-2", propertyId: "p-lindenhof", rent: 2180, since: "2023-04-01", leaseEnd: "2028-03-31", status: "current", score: 99 },
  { id: "t-06", name: "Felix Braun", unit: "1.OG-4", propertyId: "p-lindenhof", rent: 1980, since: "2022-11-01", leaseEnd: "2026-10-31", status: "current", score: 94 },
  { id: "t-07", name: "Ivan Petrov", unit: "C-3", propertyId: "p-atrium", rent: 5400, since: "2020-02-01", leaseEnd: "2027-01-31", status: "current", score: 90 },
  { id: "t-08", name: "Clara Meier", unit: "S-9", propertyId: "p-seehaus", rent: 4250, since: "2023-07-01", leaseEnd: "2027-06-30", status: "current", score: 98 },
  { id: "t-09", name: "Luka Horvat", unit: "M-2", propertyId: "p-marina", rent: 1180, since: "2024-05-01", leaseEnd: "2026-10-31", status: "notice", score: 79 },
  { id: "t-10", name: "Petra Novak", unit: "M-6", propertyId: "p-marina", rent: 1240, since: "2021-08-15", leaseEnd: "2027-08-14", status: "current", score: 95 },
  { id: "t-11", name: "Oskar Lindqvist", unit: "T-1", propertyId: "p-tabor", rent: 2100, since: "2019-04-01", leaseEnd: "2026-09-30", status: "late", score: 68 },
  { id: "t-12", name: "Marie Dubois", unit: "D-405", propertyId: "p-donau", rent: 1560, since: "2022-01-15", leaseEnd: "2027-01-14", status: "current", score: 93 },
  { id: "t-13", name: "Jonas Keller", unit: "D-118", propertyId: "p-donau", rent: 1490, since: "2024-09-01", leaseEnd: "2028-08-31", status: "current", score: 91 },
  { id: "t-14", name: "Elena Marković", unit: "A-301", propertyId: "p-ravnik", rent: 1380, since: "2020-10-01", leaseEnd: "2026-09-30", status: "current", score: 97 },
];

export const workOrders = [
  { id: "WO-4821", title: "Boiler losing pressure", propertyId: "p-ravnik", unit: "B-112", category: "Heating", priority: "urgent", status: "open", assignee: "Ana Kovač", opened: "2026-08-14", cost: 780 },
  { id: "WO-4819", title: "Lobby intercom offline", propertyId: "p-lindenhof", unit: "Common", category: "Electrical", priority: "high", status: "open", assignee: "Jonas Weber", opened: "2026-08-13", cost: 340 },
  { id: "WO-4816", title: "Balcony railing inspection", propertyId: "p-seehaus", unit: "S-9", category: "Structural", priority: "normal", status: "open", assignee: "Lena Fischer", opened: "2026-08-11", cost: 0 },
  { id: "WO-4812", title: "Elevator annual service", propertyId: "p-atrium", unit: "Common", category: "Mechanical", priority: "normal", status: "progress", assignee: "Lena Fischer", opened: "2026-08-08", cost: 1_250 },
  { id: "WO-4809", title: "Repaint stairwell C", propertyId: "p-donau", unit: "Common", category: "Cosmetic", priority: "low", status: "progress", assignee: "Jonas Weber", opened: "2026-08-06", cost: 620 },
  { id: "WO-4804", title: "Water ingress under sink", propertyId: "p-navona", unit: "L-11", category: "Plumbing", priority: "high", status: "progress", assignee: "Marco Bianchi", opened: "2026-08-04", cost: 210 },
  { id: "WO-4799", title: "Replace parking barrier motor", propertyId: "p-tabor", unit: "Garage", category: "Mechanical", priority: "normal", status: "done", assignee: "Ana Kovač", opened: "2026-07-29", cost: 890 },
  { id: "WO-4791", title: "Fire alarm certification", propertyId: "p-marina", unit: "Common", category: "Compliance", priority: "high", status: "done", assignee: "Ana Kovač", opened: "2026-07-24", cost: 1_480 },
  { id: "WO-4787", title: "Window seal replacement", propertyId: "p-lindenhof", unit: "1.OG-4", category: "Cosmetic", priority: "low", status: "done", assignee: "Jonas Weber", opened: "2026-07-20", cost: 460 },
];

/** 12 months of portfolio income vs. operating cost, in EUR. */
export const monthly = [
  { month: "Sep", income: 296_400, expense: 91_200 },
  { month: "Oct", income: 301_800, expense: 96_500 },
  { month: "Nov", income: 299_100, expense: 112_300 },
  { month: "Dec", income: 305_600, expense: 128_900 },
  { month: "Jan", income: 308_200, expense: 121_400 },
  { month: "Feb", income: 311_700, expense: 104_800 },
  { month: "Mar", income: 314_900, expense: 99_100 },
  { month: "Apr", income: 318_400, expense: 94_700 },
  { month: "May", income: 322_100, expense: 89_300 },
  { month: "Jun", income: 327_800, expense: 92_600 },
  { month: "Jul", income: 331_500, expense: 101_900 },
  { month: "Aug", income: 336_200, expense: 97_400 },
];

export const expenseBreakdown = [
  { label: "Maintenance & repairs", amount: 32_400, color: "var(--blue)" },
  { label: "Utilities", amount: 24_100, color: "var(--teal)" },
  { label: "Property management", amount: 18_600, color: "var(--indigo)" },
  { label: "Insurance & tax", amount: 13_900, color: "var(--purple)" },
  { label: "Marketing & leasing", amount: 8_400, color: "var(--orange)" },
];

export const transactions = [
  { id: "tx-1", date: "2026-08-16", label: "Rent — Seehaus Terraces", propertyId: "p-seehaus", type: "income", method: "SEPA", amount: 71_500 },
  { id: "tx-2", date: "2026-08-15", label: "Rent — Lindenhof Lofts", propertyId: "p-lindenhof", type: "income", method: "SEPA", amount: 58_400 },
  { id: "tx-3", date: "2026-08-14", label: "Boiler parts — Ravnik", propertyId: "p-ravnik", type: "expense", method: "Card", amount: -780 },
  { id: "tx-4", date: "2026-08-13", label: "Rent — Atrium Offices", propertyId: "p-atrium", type: "income", method: "SEPA", amount: 47_900 },
  { id: "tx-5", date: "2026-08-12", label: "Municipal utilities — Vienna", propertyId: "p-donau", type: "expense", method: "Direct debit", amount: -6_240 },
  { id: "tx-6", date: "2026-08-11", label: "Rent — Donau Garden", propertyId: "p-donau", type: "income", method: "SEPA", amount: 41_300 },
  { id: "tx-7", date: "2026-08-10", label: "Elevator service contract", propertyId: "p-atrium", type: "expense", method: "Invoice", amount: -1_250 },
  { id: "tx-8", date: "2026-08-09", label: "Rent — Navona Suites", propertyId: "p-navona", type: "income", method: "Card", amount: 33_200 },
  { id: "tx-9", date: "2026-08-08", label: "Insurance premium Q3", propertyId: null, type: "expense", method: "SEPA", amount: -13_900 },
  { id: "tx-10", date: "2026-08-07", label: "Rent — Ravnik Residences", propertyId: "p-ravnik", type: "income", method: "SEPA", amount: 31_800 },
  { id: "tx-11", date: "2026-08-05", label: "Rent — Marina Court", propertyId: "p-marina", type: "income", method: "SEPA", amount: 24_600 },
  { id: "tx-12", date: "2026-08-04", label: "Landscaping — Seehaus", propertyId: "p-seehaus", type: "expense", method: "Invoice", amount: -2_180 },
];

export const activity = [
  { id: "a-1", kind: "payment", title: "Rent received — Clara Meier", sub: "Seehaus Terraces · S-9", time: "12 min ago", amount: 4_250 },
  { id: "a-2", kind: "maintenance", title: "WO-4821 escalated to urgent", sub: "Ravnik Residences · B-112", time: "1 h ago" },
  { id: "a-3", kind: "lease", title: "Lease signed — Jonas Keller", sub: "Donau Garden · D-118 · 36 months", time: "3 h ago" },
  { id: "a-4", kind: "viewing", title: "Viewing booked", sub: "Marina Court · M-4 · Thu 14:30", time: "5 h ago" },
  { id: "a-5", kind: "alert", title: "Payment overdue — Matteo Conti", sub: "Navona Suites · L-11 · 9 days", time: "Yesterday", amount: -1_640 },
  { id: "a-6", kind: "payment", title: "Rent received — Hannah Vogt", sub: "Lindenhof Lofts · 3.OG-2", time: "Yesterday", amount: 2_180 },
];

/* ── Derived helpers ─────────────────────────────────────────── */

export const propertyById = (id) => properties.find((p) => p.id === id);

export const portfolio = () => {
  const units = properties.reduce((n, p) => n + p.units, 0);
  const occupied = properties.reduce((n, p) => n + p.occupied, 0);
  const value = properties.reduce((n, p) => n + p.value, 0);
  const rent = properties.reduce((n, p) => n + p.monthlyRent, 0);
  const open = workOrders.filter((w) => w.status !== "done").length;
  const overdue = tenants.filter((t) => t.status === "late").length;
  return {
    units,
    occupied,
    vacant: units - occupied,
    occupancy: occupied / units,
    value,
    rent,
    open,
    overdue,
    noi: monthly.at(-1).income - monthly.at(-1).expense,
    collected: 0.964,
  };
};
