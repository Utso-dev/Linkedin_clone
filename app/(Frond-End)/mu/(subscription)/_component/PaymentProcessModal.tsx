export const PaymentProcessModal = ({
  status,
  onClose,
}: {
  status: "loading" | "error";
  onClose: () => void;
}) => {
  return (
    <div className="p-6 relative text-center">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-borderColor/40 pb-3">
        <h3 className="text-base font-semibold text-headerColor">
          Payment Process
        </h3>
        
      </div>

      {/* Body: Loading */}
      {status === "loading" ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative w-14 h-14 mb-6">
            <svg
              className="animate-spin w-full h-full text-emerald-500"
              viewBox="0 0 50 50"
            >
              <circle
                className="opacity-20"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth={5}
                fill="none"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M25 5 a 20 20 0 0 1 20 20 h -5 a 15 15 0 0 0 -15 -15 z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Waiting For Payment Process
          </p>
        </div>
      ) : (
        /* Body: Failed Error State */
        <div className="py-10 flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-6 stroke-[1.5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" />
            <line
              x1="9"
              y1="9"
              x2="9.01"
              y2="9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="15"
              y1="9"
              x2="15.01"
              y2="9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm font-normal text-red-500">
            Payment process failed try again!
          </p>
        </div>
      )}
    </div>
  );
};