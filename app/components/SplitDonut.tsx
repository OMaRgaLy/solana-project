type Part = { label: string; value: number; color: string };

export default function SplitDonut({ parts, center }: { parts: Part[]; center: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label="Split distribution">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#12233b" strokeWidth="18" />
        {parts.map((p) => {
          const len = (p.value / total) * c;
          const el = (
            <circle
              key={p.label}
              cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
              style={{ transition: "stroke-dasharray .25s, stroke-dashoffset .25s" }}
            />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="70" transform="rotate(90 70 70)" textAnchor="middle" dominantBaseline="middle" fill="#e8eef7" fontSize="15" fontWeight="700">
          {center}
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300">{p.label}</span>
            <span className="ml-auto pl-4 font-semibold">{p.value.toFixed(p.value % 1 ? 2 : 0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
