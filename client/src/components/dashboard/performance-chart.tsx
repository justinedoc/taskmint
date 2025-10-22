import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyProductivity } from "@/hooks/use-analytics";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-primary rounded-lg px-4 py-2 shadow-lg">
        <div className="text-center">
          <p className="font-bold">
            Hurraaahhh! <span className="text-white">{value}%</span>
          </p>
          <p className="text-muted-foreground text-sm">Super Productive</p>
        </div>
      </div>
    );
  }
  return null;
};

const ProductivityChart = () => {
  const { data, isPending, isError } = useWeeklyProductivity();

  const chartData = data?.data;

  if (isPending) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (!chartData || chartData.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No productivity data available.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Failed to load productivity data.
      </p>
    );
  }

  const peakProductivity = chartData.reduce(
    (max, current, index) => {
      if (current.value > max.value) {
        return { value: current.value, index };
      }
      return max;
    },
    { value: -Infinity, index: -1 },
  );

  const chart = chartData.map((item, index) => ({
    ...item,
    isHighlighted: index === peakProductivity.index,
  }));

  return (
    <div className="font-base mx-auto w-full shadow-md md:max-w-md">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 14, fill: "#9CA3AF" }}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              radius={[100, 100, 100, 100]}
              className="hover:bg-muted"
            >
              {chart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighlighted ? "#5624B2" : "#220D45"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityChart;
