"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";

export default function StoryCarousel({ slides, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const timerRef = useRef(null);

  const go = useCallback(
    (i) => {
      const n = slides.length;
      setIndex(((i % n) + n) % n);
    },
    [slides.length]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setTimeout(() => next(), interval);
    return () => timerRef.current && window.clearTimeout(timerRef.current);
  }, [index, next, interval, paused]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(calc(${-index * 100}% + ${touchDeltaX.current}px))`;
    }
  };
  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    else if (trackRef.current) trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="relative group rounded-3xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-500/20 to-pink-500/20" />

      <div
        ref={trackRef}
        className="relative flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full shrink-0 relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-96 md:h-[28rem] object-cover select-none"
              draggable={false}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative text-white">
                <h3 className="text-2xl md:text-3xl font-bold drop-shadow mb-1">{slide.title}</h3>
                <p className="text-sm md:text-base text-white/90">{slide.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight className="w-6 h-6 text-white rotate-180" />
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* progress bars */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 pb-4 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 bg-white/25 rounded">
            <div
              className={`h-full rounded ${i === index ? "bg-white" : "bg-white/50"}`}
              style={{
                width: i === index ? "100%" : "0%",
                transition: i === index && !paused ? `width ${interval}ms linear` : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* thumbnails */}
      <div className="absolute top-3 right-3 hidden md:flex gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative w-12 h-8 rounded overflow-hidden ring-2 transition
              ${i === index ? "ring-white" : "ring-white/40 hover:ring-white/70"}`}
            title={s.title}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </button>
        ))}
      </div>

      {/* mobile hint */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-white/70 md:hidden select-none animate-bounce">
        Vuốt để xem thêm →
      </div>
    </div>
  );
}
