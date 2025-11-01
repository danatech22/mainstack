import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  amount: number;
  tooltip?: string;
}

export function StatCard({ label, amount, tooltip }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center gap-2 justify-between">
        <span className="text-sm text-[#56616B] tracking-tighter font-medium">
          {label}
        </span>
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="outline-none focus:outline-none">
                  <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="text-3xl font-bold leading-none tracking-tighter text-[#131316]">
        {formatCurrency(amount)}
      </div>
    </div>
  );
}
