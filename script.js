// 2025 Tax Brackets configuration 
const INCOME_TAX_BRACKETS = [
  { rate: 35.82, low: 0, high: 38441 },
  { rate: 37.48, low: 38442, high: 76817 },
  { rate: 49.50, low: 76818, high: Infinity }
];

// 2025 Tax Credits configuration 
const GENERAL_TAX_CREDIT_2025 = {
  ageGroup: 'under AOW age',
  cap: 3068,
  phaseOutStart: 28406,
  phaseOutEnd: 76817,
  phaseOutRate: 0.06337 // 6.337%
};

const LABOUR_TAX_CREDIT_2025 = {
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
  t4PhaseOutRate: 0.06510 // 6.510%
};

// DOM Elements
const incomeInput = document.getElementById('income');
const taxRateElement = document.getElementById('taxRate');
const taxAmountElement = document.getElementById('taxAmount');
const netIncomeElement = document.getElementById('netIncome');
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
const calculateGeneralTaxCredit = (income, cfg = GENERAL_TAX_CREDIT_2025) => {
  if (income <= cfg.phaseOutStart) return cfg.cap;
  if (income < cfg.phaseOutEnd) {
    const credit = cfg.cap - cfg.phaseOutRate * (income - cfg.phaseOutStart);
    return Math.max(0, credit);
  }
  return 0;
};

// Labour Tax Credit (piecewise, cumulative with cap and phase-out)
const calculateLabourTaxCredit = (income, cfg = LABOUR_TAX_CREDIT_2025) => {
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

// Input validation
const validateInput = (value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue) || numericValue < 0) return 0;
  if (numericValue > 100000000) return 100000000;
  return numericValue;
};

// Local storage operations
const saveToLocalStorage = (income) => {
  try {
    localStorage.setItem('lastIncome', income.toString());
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const lastIncome = localStorage.getItem('lastIncome');
    if (lastIncome) {
      const numericValue = parseFloat(lastIncome);
      incomeInput.value = formatNumber(numericValue);
      updateResults(numericValue);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
};

// Update the results display
const updateResults = (income) => {
  const tax = calculateTax(income);
  const generalCredit = calculateGeneralTaxCredit(income);
  const labourCredit = calculateLabourTaxCredit(income);
  const netIncome = income + generalCredit + labourCredit - tax;
  // Effective Tax Rate = (Tax amount - total credits) / Gross income
  const totalCredits = generalCredit + labourCredit;
  const effectiveTaxRate = income > 0 ? Math.round(((tax - totalCredits) / income) * 100) : 0;

  if (taxRateElement) taxRateElement.textContent = `${effectiveTaxRate}%`;
  if (taxAmountElement) taxAmountElement.textContent = formatCurrency(-tax);
  if (generalTaxCreditElement) generalTaxCreditElement.textContent = formatCurrency(generalCredit);
  if (labourTaxCreditElement) labourTaxCreditElement.textContent = formatCurrency(labourCredit);
  if (netIncomeElement) netIncomeElement.textContent = formatCurrency(netIncome);

  // Save to localStorage
  saveToLocalStorage(income);
};

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Handle income input changes with debounce
const handleIncomeInput = (e) => {
  // Store cursor position
  const cursorPosition = e.target.selectionStart;

  // Remove all non-digit characters except decimal point
  const value = e.target.value.replace(/[^\d.]/g, '');
  
  // Validate and format input
  const validatedValue = validateInput(value);
  const formattedValue = validatedValue > 0 ? formatNumber(validatedValue) : '';
  e.target.value = formattedValue;

  // Adjust cursor position
  const newPosition = cursorPosition + (formattedValue.length - value.length);
  e.target.setSelectionRange(newPosition, newPosition);

  updateResults(validatedValue);
};

// Keyboard navigation
const handleKeyboardNavigation = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    incomeInput.blur();
  }
  
  if (e.key === 'Escape') {
    e.preventDefault();
    incomeInput.value = '';
    updateResults(0);
  }
};

// Populate tax brackets table
const populateTaxBrackets = () => {
  taxBracketsBody.innerHTML = INCOME_TAX_BRACKETS.map(bracket => `
    <tr>
      <td>${formatNumber(bracket.low)}</td>
      <td>${bracket.high === Infinity ? 'Above' : formatNumber(bracket.high)}</td>
      <td>${bracket.rate.toFixed(2)}%</td>
    </tr>
  `).join('');
};

// Populate credit brackets tables
const populateCreditBrackets = () => {
  if (generalCreditBracketsBody) {
    const g = GENERAL_TAX_CREDIT_2025;
    generalCreditBracketsBody.innerHTML = `
      <tr>
        <td>≤ ${formatCurrency(g.phaseOutStart)}</td>
        <td>${formatCurrency(g.cap)}</td>
      </tr>
      <tr>
        <td>${formatCurrency(g.phaseOutStart)} – ${formatCurrency(g.phaseOutEnd)}</td>
        <td>${formatCurrency(g.cap)} − ${formatPercentFixed(g.phaseOutRate)} × (income − ${formatCurrency(g.phaseOutStart)})</td>
      </tr>
      <tr>
        <td>≥ ${formatCurrency(g.phaseOutEnd)}</td>
        <td>${formatCurrency(0)}</td>
      </tr>
    `;
  }

  if (labourCreditBracketsBody) {
    const l = LABOUR_TAX_CREDIT_2025;
    const base1 = l.t1Rate * l.t1End;
    const base2 = base1 + l.t2Rate * (l.t3Start - l.t2Start);
    labourCreditBracketsBody.innerHTML = `
      <tr>
        <td>≤ ${formatCurrency(l.t1End)}</td>
        <td>${formatPercentFixed(l.t1Rate)} × income</td>
      </tr>
      <tr>
        <td>${formatCurrency(l.t2Start)} – ${formatCurrency(l.t2End)}</td>
        <td>${formatCurrency(base1)} + ${formatPercentFixed(l.t2Rate)} × (income − ${formatCurrency(l.t2Start)})</td>
      </tr>
      <tr>
        <td>${formatCurrency(l.t3Start)} – ${formatCurrency(l.t3End)}</td>
        <td>${formatCurrency(base2)} + ${formatPercentFixed(l.t3Rate)} × (income − ${formatCurrency(l.t3Start)})</td>
      </tr>
      <tr>
        <td>${formatCurrency(l.t4Start)} – ${formatCurrency(l.t4End)}</td>
        <td>${formatCurrency(l.t4Cap)} − ${formatPercentFixed(l.t4PhaseOutRate)} × (income − ${formatCurrency(l.t4Start)})</td>
      </tr>
      <tr>
        <td>≥ ${formatCurrency(l.t4End)}</td>
        <td>${formatCurrency(0)}</td>
      </tr>
    `;
  }
};

// Initialize collapsible sections with event delegation
const initCollapsibles = () => {
  // Sync initial ARIA and hidden state
  document.querySelectorAll('.collapsible .section-title').forEach(header => {
    const section = header.closest('.collapsible');
    const expanded = !section.classList.contains('collapsed');
    header.setAttribute('aria-expanded', String(expanded));
    const controlsId = header.getAttribute('aria-controls');
    if (controlsId) {
      const content = document.getElementById(controlsId);
      if (content) content.hidden = !expanded;
    }
  });

  const toggle = (header) => {
    const section = header.closest('.collapsible');
    if (!section) return;
    const collapsed = section.classList.toggle('collapsed');
    header.setAttribute('aria-expanded', String(!collapsed));
    const controlsId = header.getAttribute('aria-controls');
    if (controlsId) {
      const content = document.getElementById(controlsId);
      if (content) content.hidden = collapsed;
    }
  };

  document.addEventListener('click', (e) => {
    const header = e.target.closest && e.target.closest('.section-title');
    if (header) toggle(header);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = e.target.closest && e.target.closest('.section-title');
    if (!header) return;
    e.preventDefault();
    toggle(header);
  });
};

// Event listeners
incomeInput.addEventListener('input', debounce(handleIncomeInput, 300));
incomeInput.addEventListener('keydown', handleKeyboardNavigation);
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  populateTaxBrackets();
  populateCreditBrackets();
  initCollapsibles();
  if (!incomeInput.value) updateResults(0);
});
