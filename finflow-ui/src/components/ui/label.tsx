"use client";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className="block mb-1 font-medium text-gray-700" />
  );
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Günaydın";
  if (hour < 17) return "İyi günler";
  return "İyi akşamlar";
}
