'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2">{label}</label>
      <input
        {...props}
        className={`w-full p-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${props.className || ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
