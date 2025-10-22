import { Button } from "@/components/ui/button";
import { useGoalSummary } from "@/hooks/use-analytics";
import { Ellipsis, Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const LongTermGoals = () => {
  const { data, isPending } = useGoalSummary();

  const achievedValue = data?.data?.achievedValue ?? 0;
  const totalTasksCompleted = data?.data?.completedTasks ?? 0;

  const pieData = [
    { name: "Achieved", value: achievedValue },
    { name: "Remaining", value: 100 - achievedValue },
  ];

  const COLORS = ["#5624B2", "#270f50dc"];

  return (
    <div className="card_gradient border border-border/50 mx-auto w-full max-w-sm rounded-xl p-2 shadow-sm md:p-4">
      <div className="text-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Long term Goals</h2>
        </div>
        <Button size={"icon"} variant="ghost">
          <Ellipsis size={16} />
        </Button>
      </div>

      <div className="relative mt-4" style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
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
              {pieData.map((_, index) => ( 
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center">
          {isPending ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <span className="text-primary text-5xl font-semibold">
              {`${achievedValue}%`}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-start gap-2">
        <span className="bg-primary/60 size-3 rounded-full"></span>
        <span className="text-md text-muted-foreground">{totalTasksCompleted} {`Goal${totalTasksCompleted === 1 ? "" : "s"} Achieved`}</span>
      </div>
    </div>
  );
};

export default LongTermGoals;