// Simple className utility function (similar to clsx/classnames)
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}