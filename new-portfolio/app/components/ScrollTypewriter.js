"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTypewriter({ text }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const characters = element.querySelectorAll(".scroll-typewriter-char");
    if (!characters.length) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        characters,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.01,
          ease: "none",
          stagger: Math.min(0.022, 1.8 / characters.length),
          onComplete: () => element.classList.remove("is-typing"),
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            once: true,
            onEnter: () => element.classList.add("is-typing"),
          },
        }
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <span className="scroll-typewriter" ref={elementRef}>
      <span className="scroll-typewriter-visual" aria-hidden="true">
        {Array.from(text, (character, index) => (
          <span className="scroll-typewriter-char" key={`${index}-${character}`}>
            {character}
          </span>
        ))}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}
