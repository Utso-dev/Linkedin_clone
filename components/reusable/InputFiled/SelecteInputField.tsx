import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string; icon?: React.ReactNode };

interface SelecteInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function SelecteInputField({
  value,
  onChange,
  onValueChange,
  options,
  placeholder = "Select",
  className = "",
  id,
  disabled = false,
}: SelecteInputFieldProps) {
  const handleChange = onChange ?? onValueChange;

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        id={id}
        className={`cursor-pointer w-full ${className}`}
        disabled={disabled}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {opt.icon && <span className="">{opt.icon}</span>} {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
