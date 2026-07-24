import { useEffect, useState } from "react";

/**
 * Rotates through a list of short strings with a crossfade/slide transition.
 * No external animation library — a plain interval + CSS keyframe (see
 * .hero-rotator in components.css), consistent with the rest of this
 * codebase, which has no animation dependency.
 *
 * Respects prefers-reduced-motion globally via the rule already defined in
 * tokens.css (animation-duration is forced to ~0 for every element), so no
 * extra handling is needed here.
 */
export default function HeroRotator({ words, interval = 2600, className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length < 2) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);

  if (!words || words.length === 0) return null;

  return (
    <span className={`hero-rotator ${className}`}>
      <span key={index} className="hero-rotator-word">
        {words[index]}
      </span>
    </span>
  );
}
