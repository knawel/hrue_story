import {
  Image as ImageIcon,
  Link as LinkIcon,
  Swords,
  Video,
} from "lucide-react";
import { Entry } from "@/lib/types";

const LINK_CHIPS = [
  { field: "youtube_url", icon: Video, label: "Watch video" },
  { field: "killboard_url", icon: Swords, label: "Battle report" },
  { field: "image_url", icon: ImageIcon, label: "Image" },
  { field: "other_url", icon: LinkIcon, label: "Link" },
] as const;

export function EntryLinks({ entry }: { entry: Entry }) {
  const links = LINK_CHIPS.flatMap(({ field, icon: Icon, label }) => {
    const href = entry[field];
    return href ? [{ href, icon: Icon, label, field }] : [];
  });

  if (links.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map(({ href, icon: Icon, label, field }) => (
        <a
          key={field}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Icon className="size-3" />
          {label}
        </a>
      ))}
    </div>
  );
}
