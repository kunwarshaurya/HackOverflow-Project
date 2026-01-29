import { cn } from "./cn";

export default function Card({ children, className }) {
  return <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm p-6", className)}>{children}</div>;
}