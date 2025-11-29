import { Card } from "@/components/ui/card";

const categories = [
  { name: "Crime", color: "#ef4444", icon: "🚨" },
  { name: "Accident", color: "#f97316", icon: "⚠️" },
  { name: "Paranormal", color: "#8b5cf6", icon: "👻" },
  { name: "Protest", color: "#eab308", icon: "📢" },
  { name: "Strange", color: "#06b6d4", icon: "❓" },
];

export default function MapLegend() {
  return (
    <Card className="absolute bottom-6 left-6 z-[1000] p-3 bg-white/95 backdrop-blur-sm shadow-lg">
      <h3 className="text-xs font-semibold mb-2 text-foreground">Event Types</h3>
      <div className="space-y-1.5">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <svg width="20" height="26" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z"
                  fill={category.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>
              <span className="absolute text-[10px] top-[1px]">{category.icon}</span>
            </div>
            <span className="text-xs text-foreground">{category.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
