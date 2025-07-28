"use client";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className="block mb-1 font-medium text-gray-700" />
  );
}
