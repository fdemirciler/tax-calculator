import React from 'react';
import { Euro } from 'lucide-react';

interface TaxInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TaxInput: React.FC<TaxInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters except decimal point
    const cleanValue = e.target.value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimals
    if ((cleanValue.match(/\./g) || []).length > 1) {
      return;
    }

    onChange(cleanValue);
  };

  return (
    <div className="w-full mb-6">
      <div className="relative group">
        <label 
          htmlFor="income" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1"
        >
          Annual Gross Income
        </label>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
            <Euro size={20} />
          </div>
          <input
            type="text"
            id="income"
            value={value ? Number(value).toLocaleString('en-US') : ''}
            onChange={handleChange}
            placeholder="0"
            className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default TaxInput;