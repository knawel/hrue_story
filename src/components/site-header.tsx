import Image from "next/image";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { getRole } from "@/lib/get-role";

export async function SiteHeader() {
  const role = await getRole();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-semibold text-brand"
        >
          <Image src="/logo.png" alt="" width={24} height={24} className="rounded-sm" />
          HRUE
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {(role === "member" || role === "officer") && (
            <Link href="/submit" className="font-medium hover:underline">
              Add entry
            </Link>
          )}
          {role === "officer" && (
            <Link href="/review" className="font-medium hover:underline">
              Review
            </Link>
          )}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="font-medium hover:underline">
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
