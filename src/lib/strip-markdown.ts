// Plain-text excerpt for collapsed/clamped views — strips common Markdown
// syntax so a body that starts with a list or heading doesn't truncate ugly.
// Not a full parse; a handful of regexes covering what the editor hints at.
export function stripMarkdown(markdown: string): string {
  return markdown
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
    .replace(/^-{3,}$|^\*{3,}$/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
