import React from 'react';
import { TaxResult } from '../types';
import { formatCurrency } from '../utils/taxCalculations';
import { TrendingDown, TrendingUp, Percent, Calendar } from 'lucide-react';

interface ResultSummaryProps {
  result: TaxResult;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  // Calculate the actual tax paid (Gross Tax - Credits)
  const taxPaid = Math.max(0, result.displayedTax - result.displayGeneral - result.displayLabour);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Net Income - Highlighted */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg flex flex-col justify-between h-full transition-all duration-200">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Net Income</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-500">
            {formatCurrency(result.netIncomeDisplay)}
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg flex flex-col justify-between h-full transition-all duration-200">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Calendar size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Income</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(result.monthlyIncomeDisplay)}
          </div>
        </div>

        {/* Tax Amount */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg flex flex-col justify-between h-full transition-all duration-200">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <TrendingDown size={16} className="text-red-500 dark:text-red-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Tax Amount</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(taxPaid)}
          </div>
        </div>

        {/* Tax Percentage */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg flex flex-col justify-between h-full transition-all duration-200">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Percent size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Tax Rate</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {result.effectiveTaxRate}%
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden transition-colors duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Tax Breakdown</h3>
        </div>
        <div className="p-6 space-y-4">
          
          {/* Breakdown Items */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Calculated Income Tax</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">-{formatCurrency(result.displayedTax)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-green-600 dark:text-green-400 font-medium">General Tax Credit</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Algemene Heffingskorting</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(result.displayGeneral)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-green-600 dark:text-green-400 font-medium">Labour Tax Credit</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Arbeidskorting</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(result.displayLabour)}</span>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
             
             <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">Total Tax Paid</span>
              <span className="font-bold text-gray-900 dark:text-white">-{formatCurrency(taxPaid)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;