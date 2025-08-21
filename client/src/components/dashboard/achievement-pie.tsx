import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const LongTermGoals = () => {
  const achievedValue = 25;

  const data = [
    { name: "Achieved", value: achievedValue },
    { name: "Remaining", value: 100 - achievedValue },
  ];

  const COLORS = ["#5624B2", "#270f50dc"];

  return (
    <div className="bg-card mx-auto w-full max-w-sm rounded-xl p-2 shadow-sm md:p-4">
      <div className="text-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Long term Goals</h2>
          {/* <ChevronDown size={16} /> */}
        </div>
        <Button size={"icon"} variant="ghost">
          <Ellipsis size={16} />
        </Button>
      </div>

      {/* Chart Area */}
      <div className="relative mt-4" style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={90}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              cornerRadius={100}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Percentage text centered over the chart */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary text-5xl font-semibold">{`${achievedValue}%`}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-start gap-2">
        <span className="bg-primary/60 size-3 rounded-full"></span>
        <span className="text-md text-muted-foreground">Goal Achieved</span>
      </div>
    </div>
  );
};

export default LongTermGoals;
