import { cn } from "@/lib/utils/cn";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary-100", className)}
      {...props}
    />
  );
}

export { Skeleton };
