import { currentUser } from "@clerk/nextjs/server";

export type Role = "member" | "officer";

export async function getRole(): Promise<Role | null> {
  const user = await currentUser();
  if (!user) return null;
  const role = user.publicMetadata?.role;
  return role === "officer" || role === "member" ? role : null;
}
