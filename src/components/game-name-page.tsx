"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GameNamePage() {
  const { user } = useUser();
  const [value, setValue] = useState(
    () => (user?.unsafeMetadata?.game_name as string | undefined) ?? "",
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    await user!.update({
      unsafeMetadata: { ...user!.unsafeMetadata, game_name: value.trim() },
    });
    setStatus("saved");
  }

  return (
    <div className="px-1 py-4">
      <h1 className="text-lg font-semibold">Game name</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Shown as your author name on the corp timeline instead of your
        Discord handle.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="game_name">In-game character name</Label>
          <Input
            id="game_name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setStatus("idle");
            }}
            placeholder="e.g. Ария Восс"
          />
        </div>
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save"}
        </Button>
        {status === "saved" && (
          <p className="text-sm text-muted-foreground">Saved.</p>
        )}
      </form>
    </div>
  );
}
