import { z } from "zod";

const configSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z
    .string()
    .default("postgres://postgres:postgres@localhost:5432/drizzle"),
  JWT_SECRET: z.string().default("secret"),
});

export const { PORT, DATABASE_URL, JWT_SECRET } = configSchema.parse(Bun.env);
