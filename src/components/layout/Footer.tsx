import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-space-deep">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-lg font-bold uppercase tracking-[0.2em] text-star">
              International <span className="text-electric">Space Curriculum</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-star/50">
              A global Space Academy for Grades 4–10. Interactive 3D lessons, real mission
              simulations, and a worldwide community of young explorers preparing for the
              space age.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-star/30">
              Mission Control · Earth · Sol System
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-electric/70">Navigate</p>
            <ul className="mt-4 space-y-2.5 text-sm text-star/60">
              <li><Link href="/curriculum" className="hover:text-electric">Curriculum</Link></li>
              <li><Link href="/demo" className="hover:text-electric">Interactive Demo</Link></li>
              <li><Link href="/games" className="hover:text-electric">Games</Link></li>
              <li><Link href="/register" className="hover:text-electric">Student Registration</Link></li>
              <li><Link href="/login" className="hover:text-electric">Teacher Portal</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-electric/70">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-star/60">
              <li>missions@spacecurriculum.org</li>
              <li>partnerships@spacecurriculum.org</li>
              <li className="pt-2 font-mono text-[11px] uppercase tracking-widest text-star/30">
                For schools & institutions
              </li>
              <li>schools@spacecurriculum.org</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-star/30">
            © {new Date().getFullYear()} International Space Curriculum. All systems nominal.
          </p>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-star/30">
            <span className="hover:text-electric">Privacy</span>
            <span className="hover:text-electric">Terms</span>
            <span className="hover:text-electric">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
