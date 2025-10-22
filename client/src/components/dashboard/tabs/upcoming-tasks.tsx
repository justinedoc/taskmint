import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StatusButton } from "@/components/ui/priority-btn";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Task } from "@/data/get-tasks";
import { useTasks } from "@/hooks/use-tasks";
import { formatTime, timeLeft } from "@/lib/date";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlarmClock,
  AlertTriangle,
  Calendar,
  Clock,
  Ellipsis,
  Inbox,
} from "lucide-react";

function UpcomingTasksTab() {
  return (
    <section className="space-y-6 py-4">
      <h1 className="text-3xl font-semibold">Upcoming Tasks</h1>
      <UpcomingTasks />
    </section>
  );
}

function UpcomingTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, isPending, isError } = useTasks({
    dueDate: today.toISOString(),
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <UpcomingTaskSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="bg-destructive/10 flex h-20 w-20 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-10 w-10" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Error Loading Tasks</h2>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Something went wrong while fetching your tasks. Please try again
          later.
        </p>
      </div>
    );
  }

  if (!data || data.data.tasks.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>No Upcoming Tasks</EmptyTitle>
          <EmptyDescription>
            You're all caught up! There are no tasks scheduled.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Go to Tasks</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.data.tasks.map((task) => (
        <UpcomingTasksCard key={task._id} task={task} />
      ))}
    </div>
  );
}

function UpcomingTasksCard({ task }: { task: Task }) {
  return (
    <Card className="border-border/50 rounded-3xl pt-4 pb-0 shadow-lg">
      <CardHeader className="px-4">
        <UpcomingTaskActions task={task} />
        <CardTitle className="truncate pb-1 text-xl">{task.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {task.description}
        </CardDescription>
        <StatusButton priority={task.priority}>{task.priority}</StatusButton>
      </CardHeader>
      <CardContent className="from-primary/12 to-accent/20 mt-auto flex items-center justify-between rounded-t-xl rounded-b-[inherit] bg-gradient-to-b p-4 text-sm">
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

function UpcomingTaskActions({ task }: { task: Task }) {
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

      <Ellipsis size={17} className="" />
    </div>
  );
}

function UpcomingTaskSkeletonCard() {
  return (
    <Card className="border-border/50 rounded-3xl pt-4 pb-0 shadow-lg">
      <CardHeader className="px-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </CardHeader>
      <CardContent className="from-primary/12 to-accent/20 mt-auto flex items-center justify-between rounded-t-xl rounded-b-[inherit] bg-gradient-to-b p-4 text-sm">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default UpcomingTasksTab;
