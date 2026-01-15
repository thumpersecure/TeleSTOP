import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-dark-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-white placeholder-dark-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            hover:border-dark-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightElement ? 'pr-24' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-dark-600'}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-sm text-dark-400">{hint}</p>}
    </div>
  );
};

export default Input;
