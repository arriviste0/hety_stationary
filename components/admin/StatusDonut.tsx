"use client";

type StatusItem = {
  label: string;
  value: number;
  color: string;
};

export default function StatusDonut({ data }: { data: StatusItem[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;

  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32">
      {data.map((item) => {
        const start = (cumulative / total) * 2 * Math.PI;
        cumulative += item.value;
        const end = (cumulative / total) * 2 * Math.PI;

        const largeArc = end - start > Math.PI ? 1 : 0;
        const x1 = 60 + 50 * Math.cos(start);
        const y1 = 60 + 50 * Math.sin(start);
        const x2 = 60 + 50 * Math.cos(end);
        const y2 = 60 + 50 * Math.sin(end);

        const d = `M ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2}`;
        return (
          <path
            key={item.label}
            d={d}
            stroke={item.color}
            strokeWidth={12}
            fill="none"
          />
        );
      })}
      <circle cx="60" cy="60" r="34" fill="#fff" />
    </svg>
  );
}
