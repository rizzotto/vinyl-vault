import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/30 dark:bg-zinc-300/20",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
