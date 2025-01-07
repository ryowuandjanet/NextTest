'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-4 py-2 rounded font-medium focus:outline-none transition';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles[variant]} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? '處理中...' : children}
    </button>
  );
}
