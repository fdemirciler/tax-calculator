// 2026 Tax Credits configuration 
const GENERAL_TAX_CREDIT_2026 = {
  ageGroup: 'under AOW age',
  cap: 3115,
  phaseOutStart: 29736,
  phaseOutEnd: 78426,
  phaseOutRate: 0.06337 // 6.337%
};

const LABOUR_TAX_CREDIT_2026 = {
  ageGroup: 'under AOW age',
  t1End: 12169,
  t1Rate: 0.08053, // 8.053%
  t2Start: 12169,
  t2End: 26288,
  t2Rate: 0.30030, // 30.030%
  t3Start: 26288,
  t3End: 43071,
  t3Rate: 0.02258, // 2.258%
  t4Start: 43071,
  t4End: 129078,
  t4Cap: 5685,
  t4PhaseOutRate: 0.06510 // 6.510%
};

// DOM Elements
const incomeInput = document.getElementById('income');
const taxRateElement = document.getElementById('taxRate');
const taxAmountElement = document.getElementById('taxAmount');
const netIncomeElement = document.getElementById('netIncome');
const monthlyIncomeElement = document.getElementById('monthlyIncome');
const taxBracketsBody = document.getElementById('taxBracketsBody');
const generalTaxCreditElement = document.getElementById('generalTaxCredit');
const labourTaxCreditElement = document.getElementById('labourTaxCredit');
const generalCreditBracketsBody = document.getElementById('generalCreditBracketsBody');
const labourCreditBracketsBody = document.getElementById('labourCreditBracketsBody');

// Format numbers with international format (Euro currency)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value));
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value));
};

// For displaying percentage constants in formulas (keep decimals as needed)
const formatPercentFixed = (fraction, digits = 3) => `${(fraction * 100).toFixed(digits)}%`;



// Calculate tax based on income
const calculateTax = (income) => {
  let tax = 0
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (income > bracket.low) {
      tax += (bracket.rate/100) * (Math.min(income, bracket.high) - bracket.low);
    }
    if (income <= bracket.high) {
      break;
    }
  }
  return tax;
}

// General Tax Credit (piecewise, capped and phased out)
const calculateGeneralTaxCredit = (income, cfg = GENERAL_TAX_CREDIT_2026) => {
  if (income <= cfg.phaseOutStart) return cfg.cap;
  if (income < cfg.phaseOutEnd) {
    const credit = cfg.cap - cfg.phaseOutRate * (income - cfg.phaseOutStart);
    return Math.max(0, credit);
  }
  return 0;
};

// Labour Tax Credit (piecewise, cumulative with cap and phase-out)
const calculateLabourTaxCredit = (income, cfg = LABOUR_TAX_CREDIT_2026) => {
  if (income <= 0) return 0;
