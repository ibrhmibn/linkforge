import { Coins } from "lucide-react";
import { cn, padScore } from "@/lib/utils";

/**
 * Bar HUD di atas layar: 1UP, HI-SCORE, dan CREDIT.
 * Props: score, hiScore, credits, className.
 */
export default function HUDBar({
  score = 0,
  hiScore = 99999,
  credits = 1,
  className,
}) {
  return (
    <header
      className={cn(
        "grid grid-cols-3 gap-2 border-b-4 border-white bg-arcade-bg px-3 py-3 font-pixel text-[10px] sm:px-6 sm:text-xs",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="animate-blink text-arcade-red">1UP</span>
        <span className="text-white">{padScore(score)}</span>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-arcade-yellow">ibra_dev</span>
        <span className="text-white">{padScore(hiScore)}</span>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="flex items-center gap-1 text-arcade-red">
          <Coins size={14} aria-hidden="true" />
          CREDIT
        </span>
        <span className="text-white">{String(credits).padStart(2, "0")}</span>
      </div>
    </header>
  );
}
