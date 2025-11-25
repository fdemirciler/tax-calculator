import { INCOME_TAX_BRACKETS, GENERAL_TAX_CREDIT_2025, LABOUR_TAX_CREDIT_2025 } from '../constants';
import { TaxResult, GeneralCreditConfig, LabourCreditConfig } from '../types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};

export const formatPercentFixed = (fraction: number, digits: number = 3): string => {
  return `${(fraction * 100).toFixed(digits)}%`;
};

const calculateTax = (income: number): number => {
  let tax = 0;
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (income > bracket.low) {
      tax += (bracket.rate / 100) * (Math.min(income, bracket.high) - bracket.low);
    }
    if (income <= bracket.high) {
      break;
    }
  }
  return tax;
};

const calculateGeneralTaxCredit = (income: number, cfg: GeneralCreditConfig = GENERAL_TAX_CREDIT_2025): number => {
  if (income <= cfg.phaseOutStart) return cfg.cap;
  if (income < cfg.phaseOutEnd) {
    const credit = cfg.cap - cfg.phaseOutRate * (income - cfg.phaseOutStart);
    return Math.max(0, credit);
  }
  return 0;
};

const calculateLabourTaxCredit = (income: number, cfg: LabourCreditConfig = LABOUR_TAX_CREDIT_2025): number => {
  if (income <= 0) return 0;
  const base1 = cfg.t1Rate * cfg.t1End; // credit at end of tier 1
  if (income <= cfg.t1End) return cfg.t1Rate * income;
  if (income <= cfg.t2End) return base1 + cfg.t2Rate * (income - cfg.t2Start);
  
  const base2 = base1 + cfg.t2Rate * (cfg.t3Start - cfg.t2Start); // credit at start of tier 3
  if (income <= cfg.t3End) return base2 + cfg.t3Rate * (income - cfg.t3Start);
  
  if (income < cfg.t4End) {
    const credit = cfg.t4Cap - cfg.t4PhaseOutRate * (income - cfg.t4Start);
    return Math.max(0, credit);
  }
  return 0;
};

export const computeResults = (income: number): TaxResult => {
  const incomeRounded = Math.round(income || 0);
  if (incomeRounded <= 0) {
    return {
      incomeRounded,
      displayedTax: 0,
      displayGeneral: 0,
      displayLabour: 0,
      netIncomeDisplay: 0,
      monthlyIncomeDisplay: 0,
      effectiveTaxRate: 0,
      theoretical: { tax: 0, general: 0, labour: 0 },
    };
  }

  const tax = calculateTax(income);
  const generalCredit = calculateGeneralTaxCredit(income);
  const labourCredit = calculateLabourTaxCredit(income);

  const displayedTax = Math.round(tax);
  let displayLabour = Math.round(labourCredit);
  let displayGeneral = Math.round(generalCredit);

  // Logic to ensure credits do not exceed tax
  if ((generalCredit + labourCredit) > tax) {
    const appliedLabourFloat = Math.min(labourCredit, tax);
    const appliedGeneralFloat = Math.min(generalCredit, tax - appliedLabourFloat);

    displayLabour = Math.round(appliedLabourFloat);
    displayGeneral = Math.round(appliedGeneralFloat);

    let sum = displayLabour + displayGeneral;
    if (sum !== displayedTax) {
      const generalCap = Math.round(appliedGeneralFloat);
      displayGeneral = Math.min(generalCap, Math.max(0, displayedTax - displayLabour));
      sum = displayLabour + displayGeneral;
    }
    if (sum !== displayedTax) {
      const labourCap = Math.round(appliedLabourFloat);
      displayLabour = Math.min(labourCap, Math.max(0, displayedTax - displayGeneral));
      const over = (displayLabour + displayGeneral) - displayedTax;
      if (over > 0) displayGeneral = Math.max(0, displayGeneral - over);
    }
  }

  // Final safety: rounding must not make credits exceed rounded tax
  if ((displayLabour + displayGeneral) > displayedTax) {
    const over = (displayLabour + displayGeneral) - displayedTax;
    // Prefer adjusting General first, aligning with application order
    displayGeneral = Math.max(0, displayGeneral - over);
    if ((displayLabour + displayGeneral) > displayedTax) {
      displayLabour = Math.max(0, displayedTax - displayGeneral);
    }
  }

  const netIncomeDisplay = incomeRounded - displayedTax + displayLabour + displayGeneral;
  const monthlyIncomeDisplay = Math.round(netIncomeDisplay / 12);
  const effectiveBase = Math.max(0, displayedTax - (displayLabour + displayGeneral));
  const effectiveTaxRate = incomeRounded > 0 ? Math.round((effectiveBase / incomeRounded) * 100) : 0;

  return {
    incomeRounded,
    displayedTax,
    displayGeneral,
    displayLabour,
    netIncomeDisplay,
    monthlyIncomeDisplay,
    effectiveTaxRate,
    theoretical: { tax, general: generalCredit, labour: labourCredit },
  };
};