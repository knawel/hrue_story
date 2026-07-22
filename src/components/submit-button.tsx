"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

// Disables itself the instant the enclosing form's action is in flight, so a
// second click before the page updates/navigates can't fire a second submit.
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  ...props
}: Omit<ComponentProps<typeof Button>, "type"> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
