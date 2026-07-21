"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "@/lib/get-role";

function readEntryFields(formData: FormData) {
  return {
    type: formData.get("type"),
    title: formData.get("title"),
    body: formData.get("body"),
    event_date: formData.get("event_date"),
    date_precision: formData.get("date_precision"),
    image_url: formData.get("image_url") || null,
  };
}

export async function submitEntryAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  console.log("[stub] submit entry — not persisted", {
    ...readEntryFields(formData),
    author_id: userId,
  });

  redirect("/");
}

export async function editEntryAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const role = await getRole();

  console.log("[stub] edit entry — not persisted", {
    id: formData.get("id"),
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
