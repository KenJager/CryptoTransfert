import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface StyledTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Signed price delta (positive = green flash, negative = red flash). */
  change?: number;
  /** When true, the row is highlighted with a pulsing animation. */
  isFlashing?: boolean;
}

/**
 * A table row that flashes green or red when the price changes.
 *
 * The flash is purely visual: the parent is responsible for setting
 * `isFlashing` to `true` when a price update occurs, and back to `false`
 * after a delay.
 */
export const StyledTableRow = ({
  change = 0,
  isFlashing = false,
  className,
  children,
  ...props
}: StyledTableRowProps) => {
  const flashClass = isFlashing
    ? change > 0
      ? "bg-green-500/15"
      : change < 0
      ? "bg-red-500/15"
      : ""
    : "";

  return (
    <tr
      className={cn(
        "transition-colors duration-500 hover:bg-neutral-500/5",
        isFlashing && "animate-row-pulse",
        flashClass,
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};