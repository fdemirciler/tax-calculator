import { TaxBracket, GeneralCreditConfig, LabourCreditConfig } from './types';

// 2025 Tax Brackets configuration
export const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { rate: 35.82, low: 0, high: 38441 },
  { rate: 37.48, low: 38442, high: 76817 },
  { rate: 49.50, low: 76818, high: Infinity },
];

// 2025 Tax Credits configuration
export const GENERAL_TAX_CREDIT_2025: GeneralCreditConfig = {
  ageGroup: 'under AOW age',
  cap: 3068,
  phaseOutStart: 28406,
  phaseOutEnd: 76817,
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
  t4Cap: 5599,
  t4PhaseOutRate: 0.06510, // 6.510%
};