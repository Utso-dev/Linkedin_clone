type ButtonProps = {
  title?: string | React.ReactNode | Element;
  className?: string;
  onClick?: () => void;
  icon?: any;
  disabled?: boolean;
  rightIcon?: any;
  loading?: boolean;
  sendingMsg?: any;
  type?: "button" | "submit" | "reset";
};

export default function ButtonReuseable({
  title,
  className,
  onClick,
  disabled,
  icon,
  rightIcon,
  loading,
  sendingMsg,
  type,
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-label={typeof title === "string" ? title : "undefined"}
      className={`md:py-3 active:scale-95 text-nowrap disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed md:px-4 text-sm md:text-base justify-center  py-2.5 px-3 rounded-md md:rounded-lg cursor-pointer bg-buttonColor text-white  hover:shadow-md hover:tracking-wider flex h-full items-center  gap-1.5 transition-all duration-200 ${className}`}
      onClick={onClick}
      type={type}
    >
      {icon} {loading ? sendingMsg : title} {rightIcon}
    </button>
  );
}
