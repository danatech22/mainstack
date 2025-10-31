import type { ChartDataPoint } from "@/types/revenue";
import { useEffect, useRef } from "react";

interface BalanceChartProps {
  data: ChartDataPoint[];
  startDate: string;
  endDate: string;
}

export function BalanceChart({ data, startDate, endDate }: BalanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Get min and max values
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Draw curve
    ctx.beginPath();
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * rect.width;
      const normalizedValue = (point.value - minValue) / range;
      const y =
        rect.height - normalizedValue * rect.height * 0.8 - rect.height * 0.1;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [data]);

  return (
    <div className="relative w-full h-64">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute bottom-0 left-0 text-xs text-gray-500">
        {new Date(startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-500">
        {new Date(endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
