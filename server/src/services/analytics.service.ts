import Task from "@server/db/models/task.model";
import { format } from "date-fns";

class AnalyticsService {
  async getGoalSummary(userId: string) {
    const totalTasks = await Task.countDocuments({ user: userId });

    const completedTasks = await Task.countDocuments({
      user: userId,
      completed: true,
    });

    let achievedValue = 0;
    if (totalTasks > 0) {
      achievedValue = (completedTasks / totalTasks) * 100;
    }

    return {
      achievedValue: Math.round(achievedValue),
      totalTasks,
      completedTasks,
    };
  }

  async getWeeklyProductivity(userId: string) {
    const productivityData = [];
    const today = new Date();

    // Loop from 6 days ago up to today (7 days total)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Define start and end of the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // 1. Find all tasks due on this day
      const totalTasksDue = await Task.countDocuments({
        user: userId,
        dueDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      // 2. Find tasks completed that were due on this day
      const completedTasksDue = await Task.countDocuments({
        user: userId,
        completed: true,
        dueDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      // 3. Calculate percentage
      let percentage = 0;
      if (totalTasksDue > 0) {
        percentage = (completedTasksDue / totalTasksDue) * 100;
      }

      productivityData.push({
        label: format(date, "d MMM"),
        value: Math.round(percentage),
      });
    }

    return productivityData;
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
