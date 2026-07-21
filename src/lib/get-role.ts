import { currentUser } from "@clerk/nextjs/server";

export type Role = "member" | "officer";

export async function getRole(): Promise<Role | null> {
  const user = await currentUser();
  if (!user) return null;
  return user.publicMetadata?.role === "officer" ? "officer" : "member";
}
