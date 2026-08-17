"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Declarative scroll-animation layer (Apple-style).
 *
 * Sections opt in with data attributes — no per-section animation code:
 *   data-reveal            → fade + rise when scrolled into view
 *   data-reveal-stagger    → children reveal in sequence
 *   data-parallax="0.2"    → vertical parallax at the given speed factor
 *   data-words             → child [data-word] spans rise in sequence (headlines)
 *   data-count="37700"     → number counts up when it enters view
 *   data-hero-media        → scales up + fades as the hero scrolls away
 *   data-hero-copy         → drifts up + fades as the hero scrolls away
 *
 * Everything respects prefers-reduced-motion.
 */
export default function ScrollFX() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Never leave opted-in content invisible for reduced-motion users.
      gsap.set(
        "[data-reveal], [data-reveal-stagger] > *, [data-word]",
        { autoAlpha: 1, y: 0, yPercent: 0 }
      );
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        el.textContent = target.toLocaleString() + (el.dataset.countSuffix ?? "");
      });
      return;
    }

    const ctx = gsap.context(() => {
      /* ---------- Simple reveals ---------- */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      /* ---------- Staggered children ---------- */
      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((el) => {
        gsap.fromTo(
          el.children,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      /* ---------- Word-by-word headline reveal ---------- */
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        const words = el.querySelectorAll("[data-word]");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { yPercent: 115, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.055,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      /* ---------- Count-up numbers ---------- */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        const suffix = el.dataset.countSuffix ?? "";
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(proxy.v).toLocaleString() + suffix;
          },
        });
      });

      /* ---------- Parallax layers ---------- */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "0.2");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });

      /* ---------- Hero departure (scroll-scrubbed zoom) ----------
       * Transform + opacity only, and the media layer is a STATIC canvas —
       * so the compositor handles this entirely on the GPU. (Scaling a
       * live-rendering WebGL canvas here is what previously tanked the
       * frame rate: it forces a full texture re-upload every frame.)
       */
      const heroMedia = document.querySelector<HTMLElement>("[data-hero-media]");
      const heroCopy = document.querySelector<HTMLElement>("[data-hero-copy]");
      const hero = heroMedia?.closest("section") ?? heroCopy?.closest("section");

      if (hero) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        if (heroMedia) tl.to(heroMedia, { scale: 1.38, autoAlpha: 0.3, ease: "none" }, 0);
        if (heroCopy) tl.to(heroCopy, { y: -80, autoAlpha: 0, ease: "none" }, 0);
      }
    });

    // Pinned/sticky sections settle after fonts and the 3D canvas mount.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}
