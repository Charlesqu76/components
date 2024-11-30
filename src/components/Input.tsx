import { cn } from "@/lib/utils";
import React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <span className="relative">
        <input
          type={type}
          className={cn(
            "peer flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {props.placeholder && (
          <span className="absolute top-0 left-3 peer-placeholder-shown:invisible peer-placeholder-shown:opacity-0 peer-placeholder-shown:translate-y-0 translate-y-[-12px] transition-all z-10 bg-white">
            {props.placeholder}
          </span>
        )}
      </span>
    );
  }
);
Input.displayName = "Input";

export { Input };
