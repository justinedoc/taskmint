import logger from "@server/lib/logger";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  ENV: z.enum(["development", "production"]),
  PORT: z.string().transform(Number),
  MONGODB_URI: z.url({ message: "DB_URL must be a valid URL" }),
  SUPERADMIN_EMAIL: z.string(),
  SUPERADMIN_PASS: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_COOKIE_SECRET: z.string(),
  ACCESS_COOKIE_SECRET: z.string(),
  SMTP_USER: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_ADDR: z.string(),
  REDIS_URL: z.string(),
  REDIS_PORT: z.string().transform(Number),
  REDIS_PASS: z.string(),
  ENCRYPTION_KEY: z.string(),
  OTP_COOKIE_SECRET: z.string(),
  OTP_TOKEN_SECRET: z.string(),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(z.prettifyError(parsedEnv.error));
  process.exit(1);
}

const env = parsedEnv.data;

export default env;
