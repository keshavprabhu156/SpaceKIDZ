import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortalLayout from "@/layouts/PortalLayout";
import { studentSidebar } from "@/configs/portalSidebarConfig";
import LessonContent from "@/components/learn/LessonContent";
import LessonFooter from "@/components/learn/LessonFooter";
import { findLesson, lessonTypeMeta } from "@/data/curriculum";
import { getSession } from "@/utils/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const ref = findLesson(lessonId);
  return { title: ref ? `${ref.lesson.title} — Lesson` : "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const ref = findLesson(lessonId);
  if (!ref) notFound();

  const session = await getSession();
  const meta = lessonTypeMeta[ref.lesson.type];
  const gradeHref = `/curriculum/${ref.grade.grade}`;

  return (
    <PortalLayout
      title="Mission Control"
      role={`Student · Grade ${session?.grade ?? ref.grade.grade}`}
      userName={session?.name ?? "Cadet"}
      userId={session?.sub ?? "ISC-S-XXXX-XXXXXX"}
      nav={studentSidebar}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-star/40">
        <Link href="/curriculum" className="hover:text-electric">Curriculum</Link>
        <span>›</span>
        <Link href={gradeHref} className="hover:text-electric">
          Grade {ref.grade.grade} · {ref.grade.codename}
        </Link>
        <span>›</span>
        <span className="text-star/60">{ref.chapter.title}</span>
      </nav>

      {/* Lesson header */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-base text-electric">
              {meta.icon}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric/70">
              {meta.label} · {ref.lesson.duration} min
            </span>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold">
              +{ref.lesson.xp} XP
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-star sm:text-3xl">
            {ref.lesson.title}
          </h1>
        </div>
      </div>

      {/* Lesson body */}
      <div className="mt-8">
        <LessonContent
          type={ref.lesson.type}
          title={ref.lesson.title}
          briefing={ref.chapter.description}
        />
      </div>

      <LessonFooter
        lessonId={ref.lesson.id}
        xp={ref.lesson.xp}
        prevId={ref.prev?.id ?? null}
        nextId={ref.next?.id ?? null}
        gradeHref={gradeHref}
      />
    </PortalLayout>
  );
}
