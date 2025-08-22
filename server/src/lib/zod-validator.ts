import { zValidator as zv } from "@hono/zod-validator";
import { handleZodError } from "@server/errors/handlers/zod-error.handler";
import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodError, ZodType } from "zod";

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      const { error, message } = handleZodError(
        result.error as unknown as ZodError<unknown>
      );
      throw new HTTPException(400, { message, cause: error });
    }
  });
