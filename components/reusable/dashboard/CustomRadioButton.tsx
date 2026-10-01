import React from "react";

interface CustomRadioButtonOption {
  label: string;
  value: string;
}

interface CustomRadioButtonProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomRadioButtonOption[];
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

const CustomRadioButton = React.forwardRef<
  HTMLDivElement,
  CustomRadioButtonProps
>(
  (
    {
      label,
      value,
      onChange,
      options,
      required,
      className = "",
      containerClassName = "",
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`w-full ${containerClassName}`}>
        {label && (
          <label className="mb-1.5 block text-[#4A4C56] font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px]">
            {label}
            {required && <span className="ml-0.5">*</span>}
          </label>
        )}

        <div className={`flex flex-wrap items-center gap-4 ${className}`}>
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <button
                type="button"
                role="radio"
                aria-checked={value === option.value}
                onClick={() => onChange(option.value)}
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                  value === option.value
                    ? "border-[#04A1B7]"
                    : "border-gray-300"
                }`}
              >
                {value === option.value && (
                  <span className="h-2 w-2 rounded-full bg-[#04A1B7]" />
                )}
              </button>
              <span className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }
);

CustomRadioButton.displayName = "CustomRadioButton";

export default CustomRadioButton;