import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => (
    <input
      ref={ref}
      className="border rounded px-3 py-2 w-full"
      {...props}
    />
  )
);

Input.displayName = "Input";