import type { Locale } from "@/i18n/config";
import type messages from "../../messages/en.json";

// Type-checks every t("...") key against the English message file.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
