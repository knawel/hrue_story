"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getEntryById } from "@/lib/get-entries";
import { getRole } from "@/lib/get-role";

function readEntryFields(formData: FormData) {
  return {
    type: formData.get("type"),
    title: formData.get("title"),
    body: formData.get("body"),
    event_date: formData.get("event_date"),
    date_precision: formData.get("date_precision"),
    image_url: formData.get("image_url") || null,
    youtube_url: formData.get("youtube_url") || null,
    killboard_url: formData.get("killboard_url") || null,
    other_url: formData.get("other_url") || null,
  };
}

export async function submitEntryAction(formData: FormData) {
  const { userId } = await auth();
  const role = await getRole();
  if (!userId || !role) redirect("/");

  console.log("[stub] submit entry — not persisted", {
    ...readEntryFields(formData),
    author_id: userId,
    author_role: role,
  });

  redirect("/");
}

export async function editEntryAction(formData: FormData) {
  const { userId } = await auth();
  const role = await getRole();
  if (!userId || !role) redirect("/");

  const id = formData.get("id");
  const entry = typeof id === "string" ? await getEntryById(id) : undefined;
  const canEdit = !!entry && (role === "officer" || entry.author_id === userId);
  if (!canEdit) redirect("/");

  console.log("[stub] edit entry — not persisted", {
    id,
    ...readEntryFields(formData),
    edited_by: userId,
    edited_by_role: role,
  });

  redirect("/");
}

export async function approveEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  console.log("[stub] approve entry — not persisted", formData.get("id"));
  redirect("/review");
}

export async function rejectEntryAction(formData: FormData) {
  const role = await getRole();
  if (role !== "officer") redirect("/");

  console.log("[stub] reject entry — not persisted", formData.get("id"));
  redirect("/review");
}
