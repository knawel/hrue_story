import type { Element, ElementContent, Root } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const ATTRIBUTION = /^\s*(—|–|--)\s*/;
// Same, but as the final line of the quote's last paragraph ("> — Рори"
// typed right under the quote, without the blank ">" line in between).
const TRAILING_ATTRIBUTION = /\n\s*(?:—|–|--)\s*([^\n]+)$/;

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

function figure(quote: Element, author: ElementContent[]): Element {
  return {
    type: "element",
    tagName: "figure",
    properties: {},
    children: [
      quote,
      { type: "element", tagName: "figcaption", properties: {}, children: author },
    ],
  };
}

// A quote ending in a dash line is attributed:
//   > Было замечательно, мы всех победили
//   >
//   > — Рори
// becomes <figure><blockquote>…</blockquote><figcaption>Рори</figcaption></figure>.
function withQuoteAttribution(node: Element): Element {
  const paragraphs = node.children.filter(
    (child): child is Element => child.type === "element",
  );
  const last = paragraphs.at(-1);
  if (last?.tagName !== "p") return node;

  const tail = last.children.at(-1);
  const trailing =
    tail?.type === "text" ? tail.value.match(TRAILING_ATTRIBUTION) : null;
  if (tail?.type === "text" && trailing) {
    const quoteParagraph: Element = {
      ...last,
      children: [
        ...last.children.slice(0, -1),
        { ...tail, value: tail.value.slice(0, trailing.index) },
      ],
    };
    return figure(
      {
        ...node,
        children: node.children.map((child) =>
          child === last ? quoteParagraph : child,
        ),
      },
      [{ type: "text", value: trailing[1] }],
    );
  }

  if (paragraphs.length < 2 || !ATTRIBUTION.test(textOf(last))) return node;

  const [first, ...rest] = last.children;
  const author =
    first?.type === "text"
      ? [{ ...first, value: first.value.replace(ATTRIBUTION, "") }, ...rest]
      : last.children;

  return figure(
    { ...node, children: node.children.filter((child) => child !== last) },
    author,
  );
}

function rehypeQuoteAttribution() {
  const walk = (children: ElementContent[]): ElementContent[] =>
    children.map((child) => {
      if (child.type !== "element") return child;
      const node = { ...child, children: walk(child.children) };
      return node.tagName === "blockquote" ? withQuoteAttribution(node) : node;
    });

  return (tree: Root) => {
    tree.children = walk(tree.children as ElementContent[]);
  };
}

// Deliberately no rehype-raw: react-markdown ignores raw HTML in the source
// by default, which is what keeps user-submitted bodies safe on this public
// page. Do not add it.
const components: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand underline hover:text-brand-bright hover:no-underline"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => <p className="font-semibold">{children}</p>,
  h2: ({ children }) => <p className="font-semibold">{children}</p>,
  h3: ({ children }) => <p className="font-semibold">{children}</p>,
  img: () => null,
  figure: ({ children }) => <figure className="py-2">{children}</figure>,
  blockquote: ({ children }) => (
    <blockquote className="space-y-2 rounded-lg border border-brand/30 bg-muted/60 px-4 py-3 italic">
      {children}
    </blockquote>
  ),
  figcaption: ({ children }) => (
    <figcaption className="mt-1.5 text-right text-sm text-muted-foreground">
      — {children}
    </figcaption>
  ),
};

export function EntryMarkdown({
  body,
  className,
  overrides,
}: {
  body: string;
  className?: string;
  // Lets non-entry pages (the guide) render real headings, tables, etc.
  overrides?: Components;
}) {
  return (
    <div
      className={cn(
        "space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_strong]:font-semibold [&_em]:italic",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeQuoteAttribution]}
        components={{ ...components, ...overrides }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
