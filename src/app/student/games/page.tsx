import type { Metadata } from "next";
import PortalLayout from "@/layouts/PortalLayout";
import PortalPageHeader from "@/components/common/PortalPageHeader";
import { studentSidebar } from "@/configs/portalSidebarConfig";
import { getSession } from "@/utils/session";
import GamesClient from "@/app/games/GamesClient";

export const metadata: Metadata = { title: "Game Deck" };
export const dynamic = "force-dynamic";

/**
 * Games, kept INSIDE the portal shell — the public /games page swaps in the
 * logged-out marketing navbar and drops the portal entirely, the same issue
 * already fixed for Curriculum. GamesClient itself is unchanged and fully
 * functional (real playable games); only its surrounding chrome differs here.
 */
export default async function StudentGamesPage() {
  const session = await getSession();

  return (
    <PortalLayout
      title="Game Deck"
      role={`Student · Grade ${session?.grade ?? "—"}`}
      roleValue="student"
      userName={session?.name ?? "Student"}
      userId={session?.sub ?? "—"}
      nav={studentSidebar}
    >
      <PortalPageHeader eyebrow="Practice arcade" title="Game Deck" />
      <p className="mt-2 max-w-xl text-sm text-star/50">
        Six games are playable now; the rest unlock as they ship. Every game awards XP toward
        your rank.
      </p>
      <GamesClient />
    </PortalLayout>
  );
}
