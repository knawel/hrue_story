// Plain-text excerpt for collapsed/clamped views — strips common Markdown
// syntax so a body that starts with a list or heading doesn't truncate ugly.
// Not a full parse; a handful of regexes covering what the editor hints at.
// Paragraph breaks (blank lines) are kept as a single "\n\n" — collapsing
// them away entirely reads as one unbroken run-on blob. Pair with
// `whitespace-pre-line` wherever this is rendered so the breaks show.
export function stripMarkdown(markdown: string): string {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^([-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/^-{3,}$|^\*{3,}$/gm, "");

  return stripped
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}
