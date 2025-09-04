
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  variant: 'success' | 'danger';
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, text, variant, disabled = false }) => {
  const baseClasses = 'flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transform transition-all duration-200';
  
  const variantClasses = {
    success: 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : 'hover:scale-105'}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
