import { TaxBracket, GeneralCreditConfig, LabourCreditConfig } from './types';

// 2026 Tax Brackets configuration
export const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { rate: 35.75, low: 0, high: 38883 },
  { rate: 37.56, low: 38883, high: 78426 },
  { rate: 49.50, low: 78426, high: Infinity },
];

// 2026 Tax Credits configuration
export const GENERAL_TAX_CREDIT_2025: GeneralCreditConfig = {
  ageGroup: 'under AOW age',
  cap: 3115,
  phaseOutStart: 29736,
  phaseOutEnd: 78426,
  phaseOutRate: 0.06337, // 6.337%
};

export const LABOUR_TAX_CREDIT_2025: LabourCreditConfig = {
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
  t4PhaseOutRate: 0.06510, // 6.510%
};
