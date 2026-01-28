import { cn } from "@/utils/cn";

export default function Button({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  return <button className={cn("px-4 py-2 rounded-md font-medium transition-colors", variants[variant], className)} {...props} />;
}