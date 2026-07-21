import { DatePrecision } from "@/lib/types";

export function formatEntryDate(eventDate: string, precision: DatePrecision) {
  const date = new Date(`${eventDate}T00:00:00Z`);

  if (precision === "year") {
    return date.toLocaleDateString("en-US", { year: "numeric", timeZone: "UTC" });
  }
  if (precision === "month") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
