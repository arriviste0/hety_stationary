export const summaryCards = [
  { label: "Today’s Sales", value: "₹48,920", trend: "+12.4%" },
  { label: "Orders Today", value: "86", trend: "+4.6%" },
  { label: "Pending Orders", value: "14", trend: "-2.1%" },
  { label: "Low Stock SKUs", value: "9", trend: "Urgent" },
  { label: "Out of Stock SKUs", value: "3", trend: "Restock" }
];

export const sales7Days = [12, 18, 25, 22, 30, 26, 32];
export const sales30Days = [
  10, 12, 14, 16, 18, 21, 24, 20, 23, 28, 30, 26, 24, 22, 25, 29, 31, 27,
  24, 26, 30, 34, 36, 33, 31, 29, 28, 26, 24, 22
];

export const orderStatus = [
  { label: "New", value: 14, color: "#2563eb" },
  { label: "Confirmed", value: 22, color: "#0ea5e9" },
  { label: "Packed", value: 18, color: "#f59e0b" },
  { label: "Shipped", value: 26, color: "#10b981" },
  { label: "Delivered", value: 42, color: "#22c55e" }
];

export const topProducts = [
  { name: "Premium Gel Pen", revenue: 12840, units: 220 },
  { name: "Classic A5 Notebook", revenue: 9830, units: 140 },
  { name: "Watercolor Set 24", revenue: 8420, units: 52 },
  { name: "Desk Organizer Kit", revenue: 7320, units: 34 },
  { name: "Drawing Pencils (12)", revenue: 6110, units: 120 },
  { name: "Sticky Notes Pack", revenue: 5780, units: 210 },
  { name: "Calligraphy Set", revenue: 5210, units: 44 },
  { name: "Premium Diary", revenue: 4980, units: 28 },
  { name: "Index Dividers", revenue: 4710, units: 190 },
  { name: "Gel Highlighters", revenue: 4520, units: 86 }
];

export const recentOrders = [
  { id: "ORD-10029", customer: "Riya Shah", total: "₹640", status: "Packed" },
  { id: "ORD-10028", customer: "Aman Singh", total: "₹1,200", status: "Confirmed" },
  { id: "ORD-10027", customer: "Sneha Patel", total: "₹420", status: "Shipped" },
  { id: "ORD-10026", customer: "Kabir Joshi", total: "₹980", status: "New" },
  { id: "ORD-10025", customer: "Zara Mehta", total: "₹1,740", status: "Delivered" },
  { id: "ORD-10024", customer: "Avinash Rao", total: "₹520", status: "Packed" },
  { id: "ORD-10023", customer: "Prisha Jain", total: "₹2,120", status: "Confirmed" },
  { id: "ORD-10022", customer: "Tara Singh", total: "₹680", status: "New" },
  { id: "ORD-10021", customer: "Riya Shah", total: "₹640", status: "Packed" },
  { id: "ORD-10020", customer: "Aditya Kulkarni", total: "₹350", status: "Delivered" }
];

export const alerts = [
  { label: "Low stock: 9 SKUs need replenishment", type: "warning" },
  { label: "Marg sync failed for 2 items", type: "danger" },
  { label: "Payment failures: 3 orders require review", type: "warning" }
];
