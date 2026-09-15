"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import clsx from "clsx";

type CloseButtonConfig =
  | {
      closeButtonType?: "shadcn";
      closeButtonProps?: React.ComponentProps<typeof DialogClose>;
    }
  | {
      closeButtonType: "custom";
      closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    };

type CustomModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "mmd" | "xsm";
  className?: string;
  showCloseButton?: boolean;
} & CloseButtonConfig;

export default function CustomModal(props: CustomModalProps) {
  const {
    open,
    onOpenChange,
    children,
    title,
    size = "md",
    className,
    showCloseButton = true,
  } = props;

  const closeButtonType = props.closeButtonType ?? "shadcn";

  const sizeClasses = {
    xsm: "w-[calc(100%-1.5rem)] !max-w-[500px]",
    sm: "w-[calc(100%-1.5rem)] !max-w-[580px]",
    md: "w-[calc(100%-1.5rem)] !max-w-[680px]",
    mmd: "w-[calc(100%-1.5rem)] !max-w-[684px]",
    lg: "w-[calc(100%-1.5rem)] !max-w-[858px]",
  };

  const shadcnCloseProps =
    closeButtonType === "shadcn" ? props.closeButtonProps : undefined;
  const { className: shadcnCloseClassName, ...shadcnCloseRest } =
    shadcnCloseProps ?? {};

  const customCloseProps =
    props.closeButtonType === "custom" ? props.closeButtonProps : undefined;
  const { className: customCloseClassName, ...customCloseRest } =
    customCloseProps ?? {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={clsx(
          "!max-w-none",
          "flex flex-col items-start gap-3 [background:var(--Greyscale-0,#FFF)] px-4 py-5 md:px-4 md:py-8 rounded-2xl",
          "max-h-[95vh] overflow-hidden",
          sizeClasses[size],
          className,
        )}
      >
        <div className="flex justify-between items-center w-full px-3">
          {title && (
            <div className="flex justify-between items-center w-full -mt-3">
              <h3 className="text-[#0B0B0B] font-['Segoe_UI'] text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
                {title}
              </h3>
            </div>
          )}

          {showCloseButton &&
            (closeButtonType === "shadcn" ? (
              <DialogClose
                className={clsx(shadcnCloseClassName)}
                {...shadcnCloseRest}
              ></DialogClose>
            ) : (
              <button
                type="button"
                className={clsx(
                  "absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors",
                  customCloseClassName,
                )}
                {...customCloseRest}
              ></button>
            ))}
        </div>

        <div className="w-full min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(8,14,30,0.15)]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// "use client";
// import * as React from "react";
// import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
// import { XIcon } from "lucide-react";
// import clsx from "clsx";

// type CloseButtonConfig =
//   | {
//       closeButtonType?: "shadcn";
//       closeButtonProps?: React.ComponentProps<typeof DialogClose>;
//     }
//   | {
//       closeButtonType: "custom";
//       closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
//     };

// type CustomModalProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   children: React.ReactNode;
//   title?: string;
//   size?: "sm" | "md" | "lg" | "mmd" | "xsm";
//   className?: string;
//   showCloseButton?: boolean;
// } & CloseButtonConfig;

// interface FormData {
//   companySize: string;
// }

// const COMPANY_SIZE_OPTIONS = [
//   { value: "1-10", label: "1 - 10 employees" },
//   { value: "11-50", label: "11 - 50 employees" },
//   { value: "51-200", label: "51 - 200 employees" },
//   { value: "201+", label: "201+ employees" },
// ];

// export default function CustomModal(props: CustomModalProps) {
//   const {
//     open,
//     onOpenChange,
//     children,
//     title,
//     size = "md",
//     className,
//     showCloseButton = true,
//   } = props;

//   const closeButtonType = props.closeButtonType ?? "shadcn";

//   const sizeClasses = {
//     sm: "sm:max-w-[580px]",
//     md: "sm:max-w-[680px]",
//     mmd: "sm:max-w-[684px]",
//     lg: "sm:max-w-[858px]",
//     xsm: "sm:max-w-[500px]",
//   };

//   const shadcnCloseProps =
//     closeButtonType === "shadcn" ? props.closeButtonProps : undefined;
//   const { className: shadcnCloseClassName, ...shadcnCloseRest } =
//     shadcnCloseProps ?? {};

//   const customCloseProps =
//     props.closeButtonType === "custom" ? props.closeButtonProps : undefined;
//   const { className: customCloseClassName, ...customCloseRest } =
//     customCloseProps ?? {};

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent
//         className={clsx(
//           "flex flex-col items-start gap-3 [background:var(--Greyscale-0,#FFF)] px-4 py-5 md:px-4 md:py-8 rounded-2xl",
//           "max-h-[95vh] overflow-hidden",
//           sizeClasses[size],
//           className,
//         )}
//       >
//         {/* Header Section */}
//         <div className="flex justify-between items-center w-full px-3">
//           {title && (
//             <div className="flex justify-between items-center w-full -mt-3">
//               <h3 className="text-[#0B0B0B] font-['Segoe_UI'] text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
//                 {title}
//               </h3>
//             </div>
//           )}

//           {/* Close Button - Placed Top Right */}
//           {showCloseButton &&
//             (closeButtonType === "shadcn" ? (
//               <DialogClose
//                 className={clsx(shadcnCloseClassName)}
//                 {...shadcnCloseRest}
//               >
//                 {/* <XIcon size={20} /> */}
//               </DialogClose>
//             ) : (
//               <button
//                 type="button"
//                 className={clsx(
//                   "absolute top-6 right-6 p-2  rounded-full border border-white/10 hover:bg-white/10 transition-colors",
//                   customCloseClassName,
//                 )}
//                 {...customCloseRest}
//               >
//                 {/* <XIcon size={20} /> */}
//               </button>
//             ))}
//         </div>
//         {/* Content Area */}
//         {/* Content Area - Enable scroll dynamically */}
//         <div className="w-full min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(8,14,30,0.15)]">
//           {children}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
