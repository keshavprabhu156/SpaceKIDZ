import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-star/10 bg-space-deep">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-semibold tracking-tight text-star">
              Space Curriculum
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-star/55">
              An international space school for Grades 4–10. Interactive 3D lessons, real
              mission simulations, and a worldwide community of young explorers learning the
              night sky together.
            </p>
            <p className="mt-6 text-xs text-star/35">Earth · Sol System</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-star/40">The school</p>
            <ul className="mt-4 space-y-2.5 text-sm text-star/60">
              <li><Link href="/curriculum" className="hover:text-electric">Syllabus</Link></li>
              <li><Link href="/demo" className="hover:text-electric">The observatory</Link></li>
              <li><Link href="/games" className="hover:text-electric">Practical exercises</Link></li>
              <li><Link href="/register" className="hover:text-electric">Admissions</Link></li>
              <li><Link href="/login" className="hover:text-electric">Teacher portal</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-star/40">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-star/60">
              <li>missions@spacecurriculum.org</li>
              <li>partnerships@spacecurriculum.org</li>
              <li className="pt-2 text-xs text-star/35">For schools &amp; institutions</li>
              <li>schools@spacecurriculum.org</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-star/10 pt-8 sm:flex-row">
          <p className="text-xs text-star/35">
            © {new Date().getFullYear()} International Space Curriculum
          </p>
          <div className="flex gap-6 text-xs text-star/40">
            <span className="hover:text-electric">Privacy</span>
            <span className="hover:text-electric">Terms</span>
            <span className="hover:text-electric">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
