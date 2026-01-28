import { cn } from "@/utils/cn";

export default function Card({ children, className }) {
  return <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>{children}</div>;
}