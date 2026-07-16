export const dummyLeads = [
  { id: 1, name: "Ahmed Raza", company: "Tech Solutions", email: "ahmed@techsol.com", phone: "0300-1234567", source: "Website", stage: "New", assignedTo: "Bilal" },
  { id: 2, name: "Sara Khan", company: "Khan Textiles", email: "sara@khantex.com", phone: "0321-9876543", source: "Referral", stage: "New", assignedTo: "Ayesha" },
  { id: 3, name: "Usman Ali", company: "Ali Traders", email: "usman@alitraders.com", phone: "0333-4567890", source: "Cold Call", stage: "Contacted", assignedTo: "Bilal" },
  { id: 4, name: "Fatima Noor", company: null, email: "fatima.noor@gmail.com", phone: "0345-1112223", source: "Website", stage: "Contacted", assignedTo: "Hamza" },
  { id: 5, name: "Bilal Sheikh", company: "Sheikh Enterprises", email: "bilal@sheikhent.com", phone: "0301-2223334", source: "Referral", stage: "Qualified", assignedTo: "Ayesha" },
  { id: 6, name: "Mariam Iqbal", company: "Iqbal Furnitures", email: "mariam@iqbalfurn.com", phone: "0312-3334445", source: "Other", stage: "Won", assignedTo: "Bilal" },
  { id: 7, name: "Hassan Javed", company: "Javed & Co.", email: "hassan@javedco.com", phone: "0334-5556667", source: "Cold Call", stage: "Lost", assignedTo: "Hamza" },
];

export const stages = ["New", "Contacted", "Qualified", "Won", "Lost"];

export const stageColors = {
  New: { border: "#6B7280", bg: "#F3F4F6", text: "#374151" },
  Contacted: { border: "#D97706", bg: "#FEF3C7", text: "#92400E" },
  Qualified: { border: "#2563EB", bg: "#DBEAFE", text: "#1E40AF" },
  Won: { border: "#16A34A", bg: "#DCFCE7", text: "#166534" },
  Lost: { border: "#DC2626", bg: "#FEE2E2", text: "#991B1B" },
};

export const dummyActivities = [
  { id: 1, leadId: 1, type: "Call", summary: "Initial call, interested in bulk pricing", loggedBy: "Bilal", date: "2026-07-10T10:30:00" },
  { id: 2, leadId: 1, type: "Email", summary: "Sent product catalog via email", loggedBy: "Bilal", date: "2026-07-11T14:00:00" },
  { id: 3, leadId: 3, type: "Note", summary: "Follow up next week, currently comparing vendors", loggedBy: "Bilal", date: "2026-07-09T09:15:00" },
];

export const dummyTasks = [
  { id: 1, leadId: 1, title: "Send updated quotation", dueDate: "2026-07-16T17:00:00", assignedTo: "Bilal", status: "Pending" },
  { id: 2, leadId: 3, title: "Follow-up call", dueDate: "2026-07-15T11:00:00", assignedTo: "Bilal", status: "Pending" },
];