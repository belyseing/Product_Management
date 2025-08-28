import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full px-4 py-3 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
