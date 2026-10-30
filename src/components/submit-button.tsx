"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Disables itself the instant the enclosing form's action is in flight, so a
// second click before the page updates/navigates can't fire a second submit.
export function SubmitButton({
  children,
  pendingLabel,
  ...props
}: Omit<ComponentProps<typeof Button>, "type"> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  const t = useTranslations("Form");

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? (pendingLabel ?? t("saving")) : children}
    </Button>
  );
}
