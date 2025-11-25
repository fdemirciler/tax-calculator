import React, { useState, useEffect, useMemo } from 'react';
import TaxInput from './components/TaxInput';
import ResultSummary from './components/ResultSummary';
import TaxBreakdownTables from './components/TaxBreakdownTables';
import { computeResults } from './utils/taxCalculations';
import { Calculator, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [income, setIncome] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load initial state from local storage if available
  useEffect(() => {
    try {
      const savedIncome = localStorage.getItem('lastIncome');
      if (savedIncome) {
        setIncome(savedIncome);
      }

      // Check for saved theme or system preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
      }
    } catch (e) {
      console.warn('Failed to load from local storage', e);
    }
  }, []);

  // Update HTML class for dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Compute results whenever income changes
  const results = useMemo(() => {
    const numericIncome = parseFloat(income);
    return computeResults(isNaN(numericIncome) ? 0 : numericIncome);
  }, [income]);

  // Save income to local storage on change
  useEffect(() => {
    if (income) {
      try {
        localStorage.setItem('lastIncome', income);
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [income]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dutch Income Tax Calculator</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fiscal Year 2025</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Input Section */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-200">
          <TaxInput value={income} onChange={setIncome} />
        </section>

        {/* Results Section */}
        <ResultSummary result={results} />

        {/* Reference Tables */}
        <TaxBreakdownTables />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400 dark:text-gray-600 pb-8 transition-colors duration-200">
          <p>
            This calculator provides estimates based on 2025 tax brackets. 
            Actual tax liability may vary based on specific circumstances.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;