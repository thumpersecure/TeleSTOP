import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
}) => {
  const variants = {
    default: 'bg-dark-800 border border-dark-700',
    elevated: 'bg-dark-800 border border-dark-700 shadow-xl',
    outlined: 'bg-transparent border-2 border-dark-600',
    gradient: 'bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hoverable
    ? 'hover:border-dark-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      className={`
        rounded-xl transition-all duration-200
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
