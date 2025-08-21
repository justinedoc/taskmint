import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusButton, TASK_PRIORITY } from "@/components/ui/priority-btn";
import { formatTime, timeLeft } from "@/lib/date";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlarmClock, Calendar, Clock, Ellipsis } from "lucide-react";

type upcomingTasks = {
  title: string;
  description: string;
  priority: (typeof TASK_PRIORITY)[number];
  dueDate: Date;
};

const sampleUpcomingTasks: upcomingTasks[] = [
  {
    title: "Brainstorming",
    description: "Brainstorming with team on storlly app",
    priority: "high",
    dueDate: new Date("2025-08-15"),
  },
  {
    title: "Re-branding Discussion",
    description: "Discussion on re-branding of dermo Brand",
    priority: "medium",
    dueDate: new Date("2025-08-19"),
  },
];

function UpcomingTasksTab() {
  return (
    <section className="space-y-4 py-4">
      <h1 className="text-3xl font-semibold font-heading">Upcoming Tasks</h1>
      <UpcomingTasks />
    </section>
  );
}

function UpcomingTasks() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {sampleUpcomingTasks.map((task) => (
        <UpcomingTasksCard key={task.title} task={task} />
      ))}
    </div>
  );
}

function UpcomingTasksCard({ task }: { task: upcomingTasks }) {
  return (
    <Card className="border-border/50 rounded-3xl pt-4 pb-0">
      <CardHeader className="px-4">
        <UpcomingTaskActions task={task} />
        <CardTitle className="truncate pb-1 text-xl">{task.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {task.description}
        </CardDescription>
        <StatusButton priority={task.priority}>{task.priority}</StatusButton>
      </CardHeader>
      <CardContent className="bg-accent/30 mt-auto flex items-center justify-between rounded-[inherit] p-4 text-sm">
        <div className="flex items-center gap-2">
          <Button variant={"outline"} size={"icon"}>
            <Calendar />
          </Button>
          <span>{format(task.dueDate, "dd MMM yyyy")}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={"outline"} size={"icon"}>
            <AlarmClock />
          </Button>
          <span>{formatTime(task.dueDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingTaskActions({ task }: { task: upcomingTasks }) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant={"ghost"}
        size={"sm"}
        className={cn(
          "h-6.5 rounded-md px-0! text-xs text-green-600 capitalize hover:bg-transparent! hover:text-green-500/60",
          {
            "text-red-600 hover:text-red-500/60":
              timeLeft(task.dueDate) === "Overdue",
          },
        )}
      >
        <Clock size={15} />
        {timeLeft(task.dueDate)}
      </Button>

      <Ellipsis size={17} />
    </div>
  );
}

export default UpcomingTasksTab;
