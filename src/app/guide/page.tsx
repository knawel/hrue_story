import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import type { Components } from "react-markdown";
import { getLocale, getTranslations } from "next-intl/server";
import { EntryMarkdown } from "@/components/entry-markdown";

// Guide text lives in content/guide/<locale>.md so it can be edited without
// touching code. Rendered with the same Markdown as entries, so the
// formatting examples show exactly what authors will get.
const guideComponents: Components = {
  h2: ({ children }) => (
    <h2 className="font-heading pt-6 text-xl font-semibold text-brand">
      {children}
    </h2>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-muted px-4 py-3 text-sm [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm [&_td]:border-t [&_td]:py-2 [&_td]:pr-4 [&_th]:py-2 [&_th]:pr-4 [&_th]:font-semibold">
        {children}
      </table>
    </div>
  ),
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Guide");
  return { title: `${t("title")} — HRUE` };
}

export default async function GuidePage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Guide"),
  ]);
  const body = await readFile(
    path.join(process.cwd(), "content/guide", `${locale}.md`),
    "utf8",
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-2xl font-semibold text-brand">
        {t("title")}
      </h1>
      <EntryMarkdown
        body={body}
        overrides={guideComponents}
        className="mt-4 space-y-3 text-base leading-relaxed"
      />
    </div>
  );
}
