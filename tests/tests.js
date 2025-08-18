// Simple browser test harness for tax-app logic
// Uses window.__taxApp exposed by script.js

(function () {
  'use strict';

  const outputEl = document.getElementById('output');
  const summaryEl = document.getElementById('summary');
  const logs = [];
  const results = [];

  function log(line = '') {
    logs.push(String(line));
  }

  function assert(name, condition, details = '') {
    const passed = Boolean(condition);
    results.push({ name, passed, details });
    log(`${passed ? 'PASS' : 'FAIL'}: ${name}${details ? ' — ' + details : ''}`);
  }

  function approxEqual(a, b, eps = 1e-9) {
    return Math.abs(a - b) <= eps;
  }

  function run() {
    const app = window.__taxApp;
    if (!app) {
      summaryEl.textContent = 'ERROR: window.__taxApp missing. Did script.js load?';
      return;
    }

    const { computeResults } = app;

    // --- Test 0 income guard ---
    {
      const r = computeResults(0);
      assert('0 income -> displayedTax=0', r.displayedTax === 0);
      assert('0 income -> displayGeneral=0', r.displayGeneral === 0);
      assert('0 income -> displayLabour=0', r.displayLabour === 0);
      assert('0 income -> netIncomeDisplay=0', r.netIncomeDisplay === 0);
      assert('0 income -> ETR=0%', r.effectiveTaxRate === 0);
    }

    // --- Core thresholds and typical amounts ---
    const incomes = [
      1,
      1000,
      10_000,
      12_169, // labour t1 end
      26_288, // labour t3 start
      28_406, // general credit phase-out start
      43_071, // labour t4 start
      76_817, // general credit phase-out end
      129_078, // labour t4 end
      200_000,
    ];

    for (const income of incomes) {
      const r = computeResults(income);
      const namePrefix = `income=${income}`;

      // Basic invariants
      assert(`${namePrefix} -> displayedTax >= 0`, r.displayedTax >= 0);
      assert(`${namePrefix} -> displayGeneral >= 0`, r.displayGeneral >= 0);
      assert(`${namePrefix} -> displayLabour >= 0`, r.displayLabour >= 0);
      assert(`${namePrefix} -> credits <= tax`,
        (r.displayGeneral + r.displayLabour) <= r.displayedTax
      );

      // ETR bounds and formula
      assert(`${namePrefix} -> ETR within [0, 100]`,
        r.effectiveTaxRate >= 0 && r.effectiveTaxRate <= 100
      );
      assert(`${namePrefix} -> All displayed values are whole euros`,
        Number.isInteger(r.displayedTax) && Number.isInteger(r.displayGeneral) && Number.isInteger(r.displayLabour) && Number.isInteger(r.netIncomeDisplay)
      );
      const effectiveBase = Math.max(0, r.displayedTax - (r.displayLabour + r.displayGeneral));
      const expectedPct = income > 0 ? Math.round((effectiveBase / Math.round(income)) * 100) : 0;
      assert(`${namePrefix} -> ETR formula`, r.effectiveTaxRate === expectedPct);

      // Net income arithmetic
      const expectedNet = Math.round(income) - r.displayedTax + r.displayLabour + r.displayGeneral;
      assert(`${namePrefix} -> Net income arithmetic`, r.netIncomeDisplay === expectedNet);
      assert(`${namePrefix} -> Net income non-negative`, r.netIncomeDisplay >= 0);

      // When credits exceed tax theoretically, applied credits should equal displayed tax
      const theoreticalSum = r.theoretical.general + r.theoretical.labour;
      if (theoreticalSum > r.theoretical.tax) {
        assert(`${namePrefix} -> Restatement: credits == tax`,
          (r.displayGeneral + r.displayLabour) === r.displayedTax
        );
        assert(`${namePrefix} -> ETR zero when credits==tax`, r.effectiveTaxRate === 0);
      }
    }

    // --- Edge cases ---
    {
      const r = computeResults(-100); // negative should behave like 0
      assert('negative income -> displayedTax=0', r.displayedTax === 0);
      assert('negative income -> credits=0', r.displayGeneral === 0 && r.displayLabour === 0);
      assert('negative income -> ETR=0%', r.effectiveTaxRate === 0);
    }

    // Render summary
    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;
    summaryEl.innerHTML = `
      <div><strong>Total:</strong> ${results.length}</div>
      <div class="pass"><strong>Passed:</strong> ${passed}</div>
      <div class="fail"><strong>Failed:</strong> ${failed}</div>
    `;

    outputEl.textContent = logs.join('\n');
    if (failed > 0) document.title = 'Tax App Tests — FAIL';
    else document.title = 'Tax App Tests — PASS';
  }

  // Wait for DOM + production script to load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(run, 0);
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }
})();
