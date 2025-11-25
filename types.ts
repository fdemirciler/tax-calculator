export interface TaxBracket {
  rate: number;
  low: number;
  high: number;
}

export interface GeneralCreditConfig {
  ageGroup: string;
  cap: number;
  phaseOutStart: number;
  phaseOutEnd: number;
  phaseOutRate: number;
}

export interface LabourCreditConfig {
  ageGroup: string;
  t1End: number;
  t1Rate: number;
  t2Start: number;
  t2End: number;
  t2Rate: number;
  t3Start: number;
  t3End: number;
  t3Rate: number;
  t4Start: number;
  t4End: number;
  t4Cap: number;
  t4PhaseOutRate: number;
}

export interface TaxResult {
  incomeRounded: number;
  displayedTax: number;
  displayGeneral: number;
  displayLabour: number;
  netIncomeDisplay: number;
  monthlyIncomeDisplay: number;
  effectiveTaxRate: number;
  theoretical: {
    tax: number;
    general: number;
    labour: number;
  };
}