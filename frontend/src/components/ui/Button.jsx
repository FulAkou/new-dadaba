import { cn } from "@/lib/utils/cn";
import React from "react";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm",
      secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
      outline:
        "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
      ghost: "hover:bg-secondary-100 text-secondary-700",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
