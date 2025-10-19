import type { AppBindings } from "@server/app/create-app";
import { authMiddleware } from "@server/middlewares/auth.middleware";
import { Hono } from "hono";

const app = new Hono<AppBindings>()
  .basePath("/tasks")

  .use(authMiddleware)


  .get("/", async (c) => {
    // Placeholder response
    return c.json(
      {
        success: true,
        message: "Fetched all tasks",
        data: [
          { id: 1, title: "Sample Task 1", completed: false },
          { id: 2, title: "Sample Task 2", completed: true },
        ],
      },
      200
    );
  })

  .get("/:id", async (c) => {
    const taskId = c.req.param("id");

    // Placeholder response
    return c.json(
      {
        success: true,
        message: `Fetched task with ID: ${taskId}`,
        data: { id: taskId, title: "Sample Task", completed: false },
      },
      200
    );
  })