"use client";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className="block mb-1 font-medium text-gray-700" />
  );
}

export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning 🌞";
  if (hour >= 12 && hour < 17) return "Good afternoon 🙌🏻";
  if (hour >= 17 && hour < 22) return "Good evening 🌙";
  return "Good night 🌌";
}