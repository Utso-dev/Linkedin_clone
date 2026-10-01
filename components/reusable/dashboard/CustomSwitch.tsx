import React from "react";

interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const CustomSwitch = React.forwardRef<HTMLButtonElement, CustomSwitchProps>(
  ({ checked, onChange, disabled = false, className = "" }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          disabled
            ? "cursor-not-allowed opacity-50 bg-gray-300"
            : `cursor-pointer ${checked ? "bg-primaryColor" : "bg-gray-300"}`
        } ${className}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    );
  }
);

CustomSwitch.displayName = "CustomSwitch";

export default CustomSwitch;