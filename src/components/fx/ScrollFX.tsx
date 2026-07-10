"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Declarative GSAP ScrollTrigger layer.
 *
 * Sections opt in with data attributes — no per-section animation code:
 *   data-reveal            → fade + rise when scrolled into view
 *   data-reveal-stagger    → children of this node reveal in sequence
 *   data-parallax="0.2"    → vertical parallax at the given speed factor
 */
export default function ScrollFX() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((el) => {
        gsap.fromTo(
          el.children,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "0.2");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
