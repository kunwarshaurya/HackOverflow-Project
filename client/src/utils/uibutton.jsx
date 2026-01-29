import { cn } from "./cn";

export default function Button({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5",
    outline: "border-2 border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors",
    ghost: "hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
  };
  return <button className={cn("transition-colors", variants[variant], className)} {...props} />;
}