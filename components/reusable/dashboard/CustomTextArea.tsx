import React from "react";

interface CustomTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

const CustomTextArea = React.forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(
  (
    {
      label,
      error,
      required,
      helperText,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || props.name;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-[#4A4C56] font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px]"
          >
            {label}
            {required && <span className="ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full resize-none rounded-lg border border-gray-300 px-3.5 py-3 text-sm text-gray-900
            placeholder:text-gray-400
            focus:outline-none focus:border-gray-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
          {...props}
        />

        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;