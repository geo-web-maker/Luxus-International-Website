import { useEffect, useState } from "react";

/**
 * Classic type → pause → delete → next-phrase loop, matching the mechanic
 * of the old site's typewriter tagline widget. Plain timers, no dependency.
 *
 * If the user has requested reduced motion, this renders the first phrase
 * fully typed out with no cursor blink and does not loop — the animation
 * itself is skipped rather than sped up or hidden.
 */
export default function TypewriterText({
  phrases,
  typingSpeed = 42,
  deletingSpeed = 20,
  pauseDuration = 1700,
  className = "",
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(
    prefersReducedMotion && phrases && phrases.length ? phrases[0].length : 0
  );
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting

  useEffect(() => {
    if (!phrases || phrases.length === 0 || prefersReducedMotion) return undefined;

    const current = phrases[phraseIndex % phrases.length];
    let timeoutId;

    if (phase === "typing") {
      if (charCount < current.length) {
        timeoutId = setTimeout(() => setCharCount((c) => c + 1), typingSpeed);
      } else if (phrases.length > 1) {
        timeoutId = setTimeout(() => setPhase("deleting"), pauseDuration);
      }
      // single-phrase case: stop here, nothing to loop to
    } else if (phase === "deleting") {
      if (charCount > 0) {
        timeoutId = setTimeout(() => setCharCount((c) => c - 1), deletingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setPhase("typing");
        }, 250);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [phrases, phraseIndex, charCount, phase, typingSpeed, deletingSpeed, pauseDuration, prefersReducedMotion]);

  if (!phrases || phrases.length === 0) return null;

  const current = phrases[phraseIndex % phrases.length];
  const text = current.slice(0, charCount);

  return (
    <span className={`typewriter ${className}`}>
      {text}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
}
