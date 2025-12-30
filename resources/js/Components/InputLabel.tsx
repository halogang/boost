import { LabelHTMLAttributes } from 'react';

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
}

export default function InputLabel({ value, className = '', children, ...props }: Props) {
  return (
    <label
      {...props}
      className={`block font-medium text-sm text-gray-700 dark:text-gray-300 ${className}`}
    >
      {value ? value : children}
    </label>
  );
}
