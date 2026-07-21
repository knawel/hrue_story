import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!cached) {
    cached = drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  return cached;
}
