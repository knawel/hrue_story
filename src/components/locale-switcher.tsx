import { getLocale, getTranslations } from "next-intl/server";
import { setLocaleAction } from "@/i18n/actions";
import { locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

export async function LocaleSwitcher() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Header")]);

  return (
    <form
      action={setLocaleAction}
      aria-label={t("language")}
      className="flex items-center gap-1 text-xs font-medium uppercase"
    >
      {locales.map((value, index) => (
        <span key={value} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          <button
            type="submit"
            name="locale"
            value={value}
            aria-pressed={value === locale}
            className={cn(
              "hover:underline",
              value === locale ? "text-brand" : "text-muted-foreground",
            )}
          >
            {value}
          </button>
        </span>
      ))}
    </form>
  );
}
