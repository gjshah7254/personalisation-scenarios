import Link from "next/link";
import { getUsers, getEmailToSegmentMap } from "@/lib/users";
import { UserSwitcher } from "@/app/components/UserSwitcher";
import { MobileNavLink } from "@/app/components/MobileNavLink";

/** Async header that fetches users. Used inside Suspense so layout can prerender (cacheComponents). */
export async function HeaderWithUsers() {
  const users = await getUsers();
  const userSegments = getEmailToSegmentMap();

  return (
    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold text-white">
          Personalisation Scenarios
        </Link>
        <MobileNavLink />
      </div>
      <UserSwitcher users={users} userSegments={userSegments} />
    </div>
  );
}
