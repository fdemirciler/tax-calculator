import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { INCOME_TAX_BRACKETS, GENERAL_TAX_CREDIT_2025, LABOUR_TAX_CREDIT_2025 } from '../constants';
import { formatCurrency, formatPercentFixed } from '../utils/taxCalculations';

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 mb-4 transition-colors duration-200 shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Info size={16} className="text-gray-400" />
          {title}
        </span>
        {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="overflow-x-auto">
           {children}
        </div>
      )}
    </div>
  );
};

const TaxBreakdownTables: React.FC = () => {
  const g = GENERAL_TAX_CREDIT_2025;
  const l = LABOUR_TAX_CREDIT_2025;
  const l_base1 = l.t1Rate * l.t1End;
  const l_base2 = l_base1 + l.t2Rate * (l.t3Start - l.t2Start);

  return (
    <div className="mt-8 space-y-4">
      <CollapsibleSection title="Income Tax Brackets (2026)">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {INCOME_TAX_BRACKETS.map((bracket, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">{formatCurrency(bracket.low)}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {bracket.high === Infinity ? '∞' : formatCurrency(bracket.high)}
                </td>
                <td className="px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{bracket.rate.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>
