"use client";

type SalesChartProps = {
  data: number[];
};

export default function SalesChart({ data }: SalesChartProps) {
  const max = Math.max(...data, 1);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 280;
      const y = 90 - (value / max) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 280 100" className="h-28 w-full">
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="3"
        points={points}
      />
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * 280;
        const y = 90 - (value / max) * 70;
        return <circle key={index} cx={x} cy={y} r={3} fill="#2563eb" />;
      })}
    </svg>
  );
}
