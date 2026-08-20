export function formatKES(amount: number, options?: { compact?: boolean }) {
  if (options?.compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const CHURCH = {
  name: 'MKUSDA Church',
  system: 'MKUSDA Church Treasury System',
  tagline: 'Faithful Stewardship Through Transparent Financial Management',
  financialYear: '2026',
  location: 'Mount Kenya University, Thika',
}

export const summary = {
  totalIncome: 8_642_500,
  totalExpenses: 5_318_900,
  bankBalance: 6_120_450,
  cashOnHand: 348_200,
  titheReceived: 4_210_000,
  offeringReceived: 1_985_300,
  buildingFund: 3_540_000,
  developmentFund: 1_275_600,
}

export const summaryTrends = {
  totalIncome: 12.4,
  totalExpenses: 6.1,
  bankBalance: 8.9,
  cashOnHand: -3.2,
  titheReceived: 9.7,
  offeringReceived: 4.5,
  buildingFund: 15.3,
  developmentFund: 2.8,
}

export const monthlyIncomeExpense = [
  { month: 'Jan', income: 612000, expenses: 428000 },
  { month: 'Feb', income: 588000, expenses: 401000 },
  { month: 'Mar', income: 704000, expenses: 462000 },
  { month: 'Apr', income: 668000, expenses: 445000 },
  { month: 'May', income: 742000, expenses: 498000 },
  { month: 'Jun', income: 715000, expenses: 470000 },
  { month: 'Jul', income: 690000, expenses: 452000 },
  { month: 'Aug', income: 758000, expenses: 512000 },
  { month: 'Sep', income: 726000, expenses: 468000 },
  { month: 'Oct', income: 802000, expenses: 534000 },
  { month: 'Nov', income: 781000, expenses: 505000 },
  { month: 'Dec', income: 856500, expenses: 543900 },
]

export const fundDistribution = [
  { fund: 'Tithe', amount: 4210000, key: 'tithe' },
  { fund: 'Offering', amount: 1985300, key: 'offering' },
  { fund: 'Development Fund', amount: 1275600, key: 'development' },
  { fund: 'Building Fund', amount: 3540000, key: 'building' },
  { fund: 'Youth Fund', amount: 486000, key: 'youth' },
  { fund: 'Mission Fund', amount: 612400, key: 'mission' },
]

export const annualOverview = [
  { year: '2021', income: 4820000, expenses: 3610000 },
  { year: '2022', income: 5640000, expenses: 4120000 },
  { year: '2023', income: 6380000, expenses: 4560000 },
  { year: '2024', income: 7410000, expenses: 4980000 },
  { year: '2025', income: 8080000, expenses: 5210000 },
  { year: '2026', income: 8642500, expenses: 5318900 },
]

export const departments = [
  { name: 'Youth Department', budget: 620000, income: 486000, expenses: 402000, leader: 'James Mwangi' },
  { name: "Women's Ministry", budget: 540000, income: 512000, expenses: 388000, leader: 'Grace Achieng' },
  { name: "Men's Ministry", budget: 480000, income: 431000, expenses: 356000, leader: 'Peter Otieno' },
  { name: "Children's Ministry", budget: 360000, income: 298000, expenses: 274000, leader: 'Mary Wanjiru' },
  { name: 'Pathfinder Club', budget: 420000, income: 372000, expenses: 341000, leader: 'Daniel Kimani' },
  { name: 'Adventurer Club', budget: 280000, income: 214000, expenses: 198000, leader: 'Esther Njeri' },
  { name: 'Music Department', budget: 510000, income: 468000, expenses: 452000, leader: 'Samuel Barasa' },
  { name: 'Evangelism Department', budget: 780000, income: 690000, expenses: 712000, leader: 'John Kamau' },
  { name: 'Community Services', budget: 340000, income: 286000, expenses: 251000, leader: 'Ruth Adhiambo' },
]

export type MemberStatus = 'Active' | 'Inactive' | 'Transferred'

export const members = [
  { id: 'MK-0142', name: 'John Kamau', phone: '+254 712 445 190', email: 'j.kamau@mkusda.org', department: 'Evangelism', baptismDate: '2009-04-12', status: 'Active' as MemberStatus, family: 'Kamau Family' },
  { id: 'MK-0143', name: 'Grace Achieng', phone: '+254 720 118 774', email: 'g.achieng@mkusda.org', department: "Women's Ministry", baptismDate: '2012-08-03', status: 'Active' as MemberStatus, family: 'Achieng Family' },
  { id: 'MK-0144', name: 'Peter Otieno', phone: '+254 733 552 018', email: 'p.otieno@mkusda.org', department: "Men's Ministry", baptismDate: '2007-11-20', status: 'Active' as MemberStatus, family: 'Otieno Family' },
  { id: 'MK-0145', name: 'Mary Wanjiru', phone: '+254 701 903 265', email: 'm.wanjiru@mkusda.org', department: "Children's Ministry", baptismDate: '2015-02-14', status: 'Active' as MemberStatus, family: 'Wanjiru Family' },
  { id: 'MK-0146', name: 'Daniel Kimani', phone: '+254 748 210 887', email: 'd.kimani@mkusda.org', department: 'Pathfinder', baptismDate: '2011-06-25', status: 'Active' as MemberStatus, family: 'Kimani Family' },
  { id: 'MK-0147', name: 'Esther Njeri', phone: '+254 726 664 320', email: 'e.njeri@mkusda.org', department: 'Adventurer', baptismDate: '2018-09-08', status: 'Inactive' as MemberStatus, family: 'Njeri Family' },
  { id: 'MK-0148', name: 'Samuel Barasa', phone: '+254 715 887 441', email: 's.barasa@mkusda.org', department: 'Music', baptismDate: '2005-03-30', status: 'Active' as MemberStatus, family: 'Barasa Family' },
  { id: 'MK-0149', name: 'Ruth Adhiambo', phone: '+254 738 229 605', email: 'r.adhiambo@mkusda.org', department: 'Community Services', baptismDate: '2013-12-01', status: 'Active' as MemberStatus, family: 'Adhiambo Family' },
  { id: 'MK-0150', name: 'James Mwangi', phone: '+254 707 145 992', email: 'j.mwangi@mkusda.org', department: 'Youth', baptismDate: '2016-07-17', status: 'Active' as MemberStatus, family: 'Mwangi Family' },
  { id: 'MK-0151', name: 'Lydia Chebet', phone: '+254 719 330 084', email: 'l.chebet@mkusda.org', department: "Women's Ministry", baptismDate: '2019-05-22', status: 'Transferred' as MemberStatus, family: 'Chebet Family' },
]

export const tithes = [
  { receipt: 'THE-2026-0489', member: 'John Kamau', date: '2026-07-11', amount: 42000, method: 'M-Pesa' },
  { receipt: 'THE-2026-0490', member: 'Grace Achieng', date: '2026-07-11', amount: 18500, method: 'Cash' },
  { receipt: 'THE-2026-0491', member: 'Peter Otieno', date: '2026-07-11', amount: 25000, method: 'Bank Transfer' },
  { receipt: 'THE-2026-0492', member: 'Samuel Barasa', date: '2026-07-04', amount: 31000, method: 'M-Pesa' },
  { receipt: 'THE-2026-0493', member: 'Ruth Adhiambo', date: '2026-07-04', amount: 12000, method: 'Cash' },
  { receipt: 'THE-2026-0494', member: 'James Mwangi', date: '2026-06-27', amount: 15500, method: 'M-Pesa' },
  { receipt: 'THE-2026-0495', member: 'Mary Wanjiru', date: '2026-06-27', amount: 9000, method: 'Cash' },
  { receipt: 'THE-2026-0496', member: 'Daniel Kimani', date: '2026-06-20', amount: 22000, method: 'Bank Transfer' },
]

export const offerings = [
  { type: 'Sabbath Offering', date: '2026-07-11', amount: 86400, method: 'Cash' },
  { type: 'Thanksgiving Offering', date: '2026-07-04', amount: 124500, method: 'Mixed' },
  { type: 'Mission Offering', date: '2026-06-27', amount: 58200, method: 'M-Pesa' },
  { type: 'Special Offering', date: '2026-06-20', amount: 210000, method: 'Bank Transfer' },
  { type: 'Camp Meeting Offering', date: '2026-06-13', amount: 342800, method: 'Mixed' },
  { type: 'Sabbath Offering', date: '2026-06-06', amount: 79600, method: 'Cash' },
]

export const expenses = [
  { id: 'EXP-2026-0311', category: 'Utilities', description: 'Electricity & water — June', date: '2026-07-08', amount: 48500, status: 'Approved', method: 'Bank Transfer' },
  { id: 'EXP-2026-0312', category: 'Pastor Support', description: 'Monthly stipend', date: '2026-07-05', amount: 180000, status: 'Approved', method: 'Bank Transfer' },
  { id: 'EXP-2026-0313', category: 'Church Maintenance', description: 'Roof repairs — sanctuary', date: '2026-07-03', amount: 96000, status: 'Pending', method: 'M-Pesa' },
  { id: 'EXP-2026-0314', category: 'Evangelism', description: 'Crusade materials & PA hire', date: '2026-06-29', amount: 142000, status: 'Approved', method: 'Cash' },
  { id: 'EXP-2026-0315', category: 'Youth Ministry', description: 'Youth camp transport', date: '2026-06-25', amount: 63500, status: 'Pending', method: 'M-Pesa' },
  { id: 'EXP-2026-0316', category: 'Welfare', description: 'Benevolent support — 3 families', date: '2026-06-22', amount: 45000, status: 'Approved', method: 'Cash' },
  { id: 'EXP-2026-0317', category: 'Administration', description: 'Office supplies & printing', date: '2026-06-18', amount: 21800, status: 'Approved', method: 'M-Pesa' },
  { id: 'EXP-2026-0318', category: 'Building Projects', description: 'Cement & sand delivery', date: '2026-06-15', amount: 315000, status: 'Rejected', method: 'Bank Transfer' },
  { id: 'EXP-2026-0319', category: 'Transportation', description: 'Fuel — church vehicle', date: '2026-06-12', amount: 28400, status: 'Approved', method: 'Cash' },
]

export const income = [
  { id: 'INC-2026-0522', source: 'Tithe Collection', date: '2026-07-11', amount: 210000, method: 'Mixed', fund: 'Tithe' },
  { id: 'INC-2026-0523', source: 'Sabbath Offering', date: '2026-07-11', amount: 86400, method: 'Cash', fund: 'Offering' },
  { id: 'INC-2026-0524', source: 'Building Fund Pledge', date: '2026-07-09', amount: 350000, method: 'Bank Transfer', fund: 'Building Fund' },
  { id: 'INC-2026-0525', source: 'Development Fund Drive', date: '2026-07-06', amount: 128000, method: 'M-Pesa', fund: 'Development Fund' },
  { id: 'INC-2026-0526', source: 'Mission Offering', date: '2026-06-27', amount: 58200, method: 'M-Pesa', fund: 'Mission Fund' },
  { id: 'INC-2026-0527', source: 'Harvest Sale', date: '2026-06-21', amount: 94500, method: 'Cash', fund: 'General' },
]

export const bankAccounts = [
  { id: 'ACC-1', bank: 'KCB Bank', accountNumber: '****4821', branch: 'Nairobi Main', balance: 4120450, type: 'Current' },
  { id: 'ACC-2', bank: 'Equity Bank', accountNumber: '****1093', branch: 'Kenyatta Avenue', balance: 1685000, type: 'Savings' },
  { id: 'ACC-3', bank: 'Co-operative Bank', accountNumber: '****7756', branch: 'City Centre', balance: 315000, type: 'Building Fund' },
]

export const bankTransactions = [
  { id: 'TXN-1', date: '2026-07-11', description: 'Sabbath collection deposit', account: 'KCB Bank', type: 'Deposit', amount: 296400 },
  { id: 'TXN-2', date: '2026-07-09', description: 'Building fund pledge', account: 'Co-operative Bank', type: 'Deposit', amount: 350000 },
  { id: 'TXN-3', date: '2026-07-08', description: 'Electricity & water payment', account: 'KCB Bank', type: 'Withdrawal', amount: 48500 },
  { id: 'TXN-4', date: '2026-07-05', description: 'Pastor stipend', account: 'KCB Bank', type: 'Withdrawal', amount: 180000 },
  { id: 'TXN-5', date: '2026-07-02', description: 'Transfer to savings', account: 'Equity Bank', type: 'Deposit', amount: 200000 },
  { id: 'TXN-6', date: '2026-06-29', description: 'Crusade materials', account: 'KCB Bank', type: 'Withdrawal', amount: 142000 },
]

export const expenseCategories = [
  'Utilities',
  'Pastor Support',
  'Church Maintenance',
  'Evangelism',
  'Youth Ministry',
  'Welfare',
  'Administration',
  'Building Projects',
  'Transportation',
]

export const projects = [
  { name: 'Sanctuary Construction', budget: 12500000, spent: 7850000, progress: 63, status: 'In Progress' },
  { name: 'Building Renovation', budget: 3200000, spent: 2880000, progress: 90, status: 'In Progress' },
  { name: 'Sound System Upgrade', budget: 1450000, spent: 1450000, progress: 100, status: 'Completed' },
  { name: 'Mission Outreach — Kilombero', budget: 2100000, spent: 630000, progress: 30, status: 'In Progress' },
]

export const budgets = [
  { category: 'Pastor Support', allocated: 2160000, actual: 1260000 },
  { category: 'Utilities', allocated: 620000, actual: 342000 },
  { category: 'Evangelism', allocated: 1400000, actual: 986000 },
  { category: 'Church Maintenance', allocated: 900000, actual: 612000 },
  { category: 'Youth Ministry', allocated: 620000, actual: 402000 },
  { category: 'Welfare', allocated: 480000, actual: 315000 },
  { category: 'Administration', allocated: 360000, actual: 214000 },
  { category: 'Building Projects', allocated: 4500000, actual: 3180000 },
]

export const reports = [
  { name: 'Monthly Treasury Report — June 2026', type: 'Monthly', date: '2026-07-02', period: 'Jun 2026' },
  { name: 'Quarterly Report — Q2 2026', type: 'Quarterly', date: '2026-07-05', period: 'Q2 2026' },
  { name: 'Income Statement — H1 2026', type: 'Income Statement', date: '2026-07-06', period: 'Jan–Jun 2026' },
  { name: 'Expense Statement — H1 2026', type: 'Expense Statement', date: '2026-07-06', period: 'Jan–Jun 2026' },
  { name: 'Cash Flow Report — June 2026', type: 'Cash Flow', date: '2026-07-03', period: 'Jun 2026' },
  { name: 'Fund Balances Report — Q2 2026', type: 'Fund Balances', date: '2026-07-04', period: 'Q2 2026' },
  { name: 'Annual Financial Report — 2025', type: 'Annual', date: '2026-01-28', period: '2025' },
]

export const auditLogs = [
  { time: '2026-07-11 10:42', user: 'A. Mushi (Treasurer)', action: 'Recorded tithe THE-2026-0489', amount: 42000 },
  { time: '2026-07-11 09:15', user: 'A. Mushi (Treasurer)', action: 'Approved expense EXP-2026-0312', amount: 180000 },
  { time: '2026-07-09 16:03', user: 'B. Njau (Asst. Treasurer)', action: 'Recorded income INC-2026-0524', amount: 350000 },
  { time: '2026-07-08 14:20', user: 'A. Mushi (Treasurer)', action: 'Reconciled KCB Bank account', amount: 0 },
  { time: '2026-07-06 11:47', user: 'C. Auditor', action: 'Generated Income Statement H1 2026', amount: 0 },
  { time: '2026-06-15 13:31', user: 'A. Mushi (Treasurer)', action: 'Rejected expense EXP-2026-0318', amount: 315000 },
]

export const users = [
  { name: 'Anna Mushi', role: 'Treasurer', email: 'treasurer@mkusda.org', status: 'Active' },
  { name: 'Baraka Njau', role: 'Assistant Treasurer', email: 'asst.treasurer@mkusda.org', status: 'Active' },
  { name: 'Pastor E. Mella', role: 'Pastor', email: 'pastor@mkusda.org', status: 'Active' },
  { name: 'James Mwangi', role: 'Department Leader', email: 'youth@mkusda.org', status: 'Active' },
  { name: 'Catherine Auma', role: 'Auditor', email: 'auditor@mkusda.org', status: 'Active' },
  { name: 'David Mwakalinga', role: 'Church Administrator', email: 'admin@mkusda.org', status: 'Active' },
]

export const documents = [
  { name: 'June 2026 Bank Statement — KCB', category: 'Bank Statements', date: '2026-07-02', size: '480 KB', type: 'PDF' },
  { name: 'Q2 2026 Audit Report', category: 'Audit Reports', date: '2026-07-07', size: '1.2 MB', type: 'PDF' },
  { name: '2026 Annual Budget', category: 'Budget Documents', date: '2026-01-15', size: '320 KB', type: 'XLSX' },
  { name: 'Financial Policy Handbook', category: 'Financial Policies', date: '2025-11-30', size: '890 KB', type: 'PDF' },
  { name: 'Receipt — Cement Delivery', category: 'Receipts', date: '2026-06-15', size: '210 KB', type: 'JPG' },
  { name: 'Receipt — PA System Hire', category: 'Receipts', date: '2026-06-29', size: '175 KB', type: 'JPG' },
]

export const notifications = [
  { title: 'Building Projects budget at 71%', kind: 'warning', detail: 'Sanctuary construction spending is approaching allocation.' },
  { title: 'Cash on hand below threshold', kind: 'danger', detail: 'Cash on hand is under KES 400,000.' },
  { title: 'Upcoming payment: Pastor stipend', kind: 'info', detail: 'Due in 4 days — KES 180,000.' },
  { title: 'Audit reminder', kind: 'info', detail: 'Q3 internal review scheduled for October.' },
  { title: 'Monthly report ready', kind: 'success', detail: 'June 2026 Treasury Report generated.' },
]
