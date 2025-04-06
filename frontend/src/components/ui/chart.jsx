import React from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { cn } from "@/lib/utils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Chart = React.forwardRef(({ className, type = "bar", data, options, ...props }, ref) => {
  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    scatter: Scatter,
  }[type];

  if (!ChartComponent) {
    console.error(`Chart type "${type}" is not supported. Available types: bar, line, pie, scatter`);
    return null;
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          },
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleFont: {
          size: 13,
          family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
      },
    },
    scales: type !== 'pie' ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          borderDash: [2, 4],
          color: "rgba(156, 163, 175, 0.15)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    } : undefined,
  };

  return (
    <div ref={ref} className={cn("w-full h-full min-h-[300px]", className)} {...props}>
      <ChartComponent data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
});

Chart.displayName = "Chart";

export { Chart }; 