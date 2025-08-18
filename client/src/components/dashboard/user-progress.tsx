import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

function UserProgress() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-muted-foreground flex items-center gap-4 font-medium">
      <h3>Today</h3>
      <Progress value={progress} className="flex-1" />
      <p>{progress}% complete</p>
    </div>
  );
}

export default UserProgress;
