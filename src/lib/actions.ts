"use server";

import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { entries, entryRevisions, NewEntryRevisionRow } from "@/lib/db/schema";
import { getEntryById } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { DatePrecision, EntryType } from "@/lib/types";

function readRevisionFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    eventDate: String(formData.get("event_date") ?? ""),
    datePrecision: formData.get("date_precision") as DatePrecision,
    imageUrl: (formData.get("image_url") as string) || null,
    youtubeUrl: (formData.get("youtube_url") as string) || null,
    killboardUrl: (formData.get("killboard_url") as string) || null,
    otherUrl: (formData.get("other_url") as string) || null,
  } satisfies Partial<NewEntryRevisionRow>;
}

async function authorName() {
  const user = await currentUser();
  return (
    user?.fullName?.trim() ||
    user?.username?.trim() ||
    user?.primaryEmailAddress?.emailAddress ||
    "Corp member"
  );
}

async function assertCanEdit(id: string, userId: string, role: string) {
  if (role === "officer") return true;
  const entry = await getEntryById(id);
  return !!entry && entry.owner_id === userId;
}

export async function submitEntryAction(formData: FormData) {
  const { userId } = await auth();
  const role = await getRole();
  if (!userId || !role) redirect("/");

  const type = formData.get("type") as EntryType;
  const fields = readRevisionFields(formData);
  const name = await authorName();

  const [entry] = await getDb()
    .insert(entries)
    .values({ type, status: type === "story" ? "approved" : "pending" })
    .returning({ id: entries.id });

  await getDb()
    .insert(entryRevisions)
    .values({
      ...fields,
      entryId: entry.id,
      authorId: userId,
      authorName: name,
    });

  redirect("/");
}

export async function editEntryAction(formData: FormData) {
  const { userId } = await auth();
  const role = await getRole();
  if (!userId || !role) redirect("/");

  const id = formData.get("id");
  if (typeof id !== "string" || !(await assertCanEdit(id, userId, role))) {
    redirect("/");
  }

  const fields = readRevisionFields(formData);

  await getDb()
    .insert(entryRevisions)
    .values({
      ...fields,
      entryId: id as string,
      authorId: userId,
      authorName: await authorName(),
    });

  redirect("/");
}

export async function hideEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const id = formData.get("id");
  if (typeof id === "string") {
    await getDb().update(entries).set({ hidden: true }).where(eq(entries.id, id));
  }

  redirect("/");
}

export async function unhideEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const id = formData.get("id");
  if (typeof id === "string") {
    await getDb().update(entries).set({ hidden: false }).where(eq(entries.id, id));
  }

  redirect("/");
}

export async function approveEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const id = formData.get("id");
  if (typeof id === "string") {
    await getDb()
      .update(entries)
      .set({ status: "approved" })
      .where(eq(entries.id, id));
  }

  redirect("/review");
}

export async function rejectEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const id = formData.get("id");
  if (typeof id === "string") {
    await getDb()
      .update(entries)
      .set({ status: "rejected" })
      .where(eq(entries.id, id));
  }

  redirect("/review");
}
