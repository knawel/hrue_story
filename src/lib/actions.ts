"use server";

import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { entries, NewEntryRow } from "@/lib/db/schema";
import { getEntryById } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";
import { DatePrecision, EntryType } from "@/lib/types";

function readEntryFields(formData: FormData) {
  return {
    type: formData.get("type") as EntryType,
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    eventDate: String(formData.get("event_date") ?? ""),
    datePrecision: formData.get("date_precision") as DatePrecision,
    imageUrl: (formData.get("image_url") as string) || null,
    youtubeUrl: (formData.get("youtube_url") as string) || null,
    killboardUrl: (formData.get("killboard_url") as string) || null,
    otherUrl: (formData.get("other_url") as string) || null,
  } satisfies Partial<NewEntryRow>;
}

async function authorName(userId: string) {
  const user = await currentUser();
  return (
    user?.username ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    userId
  );
}

async function assertCanEdit(id: string, userId: string, role: string) {
  const entry = await getEntryById(id);
  return !!entry && (role === "officer" || entry.author_id === userId);
}

export async function submitEntryAction(formData: FormData) {
  const { userId } = await auth();
  const role = await getRole();
  if (!userId || !role) redirect("/");

  const fields = readEntryFields(formData);

  await getDb()
    .insert(entries)
    .values({
      ...fields,
      authorId: userId,
      authorName: await authorName(userId),
      status: fields.type === "story" ? "approved" : "pending",
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

  const fields = readEntryFields(formData);

  await getDb()
    .update(entries)
    .set({ ...fields, updatedAt: new Date().toISOString() })
    .where(eq(entries.id, id as string));

  redirect("/");
}

export async function deleteEntryAction(formData: FormData) {
  const { userId } = await auth();
  const role = await getRole();
  if (!userId || !role) redirect("/");

  const id = formData.get("id");
  if (typeof id !== "string" || !(await assertCanEdit(id, userId, role))) {
    redirect("/");
  }

  await getDb()
    .delete(entries)
    .where(eq(entries.id, id as string));

  redirect("/");
}

export async function approveEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  const id = formData.get("id");
  if (typeof id === "string") {
    await getDb()
      .update(entries)
      .set({ status: "approved", updatedAt: new Date().toISOString() })
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
      .set({ status: "rejected", updatedAt: new Date().toISOString() })
      .where(eq(entries.id, id));
  }

  redirect("/review");
}
