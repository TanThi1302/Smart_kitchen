"use client";

import { useEffect, useRef, useState } from "react";

export default function useRevealSection(options = {}) {
  const { threshold = 0.25, rootMargin = "0px 0px -10%", once = true } = options;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let observer;
    const handleEntries = (entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (entry.isIntersecting) {
        setVisible(true);
        if (once && observer) observer.disconnect();
      } else if (!once) {
        setVisible(false);
      }
    };

    observer = new IntersectionObserver(handleEntries, { threshold, rootMargin });
    observer.observe(element);

    return () => observer && observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
