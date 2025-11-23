"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import useRevealSection from "./hooks/useRevealSection";

export default function MissionVisionSection({ items = [] }) {
  const { ref: sectionRef, visible } = useRevealSection({ threshold: 0.2, rootMargin: "0px 0px -15%" });
  const easing = "cubic-bezier(0.33, 1, 0.68, 1)";
  const buildTransition = (delay = 0, duration = 900) => `${duration}ms ${easing} ${delay}ms`;

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-20 relative">
      {/* BG blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          style={{
            transform: visible ? "translateY(0)" : "translateY(80px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(0, 1200)}, opacity ${buildTransition(0, 1200)}`,
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"
          style={{
            transform: visible ? "translateY(0)" : "translateY(-80px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(0, 1200)}, opacity ${buildTransition(0, 1200)}`,
          }}
        />
      </div>

      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto mb-16 relative">
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6"
          style={{
            transform: visible ? "translateY(0)" : "translateY(24px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(80)}, opacity ${buildTransition(80)}`,
          }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-blue-700">Sứ mệnh & Tầm nhìn</span>
        </div>
        <h2
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6"
          style={{
            transform: visible ? "translateY(0)" : "translateY(20px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(120)}, opacity ${buildTransition(120)}`,
          }}
        >
          Định hướng phát triển bền vững
        </h2>
        <p
          className="text-xl text-gray-600 leading-relaxed"
          style={{
            transform: visible ? "translateY(0)" : "translateY(16px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(160)}, opacity ${buildTransition(160)}`,
          }}
        >
          Mọi chiến lược của Kitchen Store đều xoay quanh việc mang lại trải nghiệm bếp tối ưu cho gia đình Việt.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto relative">
        {items.map((item, idx) => (
          <div
            key={item.title ?? idx}
            style={{
              transform: visible
                ? "translateY(0) scale(1)"
                : `translateY(${idx === 0 ? 40 : -40}px) scale(0.95)`,
              opacity: visible ? 1 : 0,
              transition: `transform ${buildTransition(180 + idx * 160)}, opacity ${buildTransition(
                180 + idx * 160
              )}`,
            }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500"
          >
            {/* Gradient header */}
            <div className="relative h-40 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div
                  className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 transition-transform duration-700"
                  style={{
                    transform: visible
                      ? "translate(50%, -50%) scale(1)"
                      : "translate(50%, -50%) scale(0.7)",
                    opacity: visible ? 0.3 : 0,
                    transition: `transform ${buildTransition(260 + idx * 160, 1100)}, opacity ${buildTransition(
                      260 + idx * 160,
                      1100
                    )}`,
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 transition-transform duration-700"
                  style={{
                    transform: visible
                      ? "translate(-50%, 50%) scale(1)"
                      : "translate(-50%, 50%) scale(0.75)",
                    opacity: visible ? 0.25 : 0,
                    transition: `transform ${buildTransition(260 + idx * 160, 1100)}, opacity ${buildTransition(
                      260 + idx * 160,
                      1100
                    )}`,
                  }}
                />
              </div>

              {/* Floating icon */}
              <div className="absolute -bottom-8 left-8">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {item.icon ? <item.icon className="w-8 h-8 text-blue-600" strokeWidth={2} /> : null}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-14">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{item.desc}</p>

              <div className="space-y-3">
                {(item.bullets ?? []).map((bullet, bulletIdx) => (
                  <div
                    key={bulletIdx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 transition-all duration-300"
                    style={{
                      transform: visible
                        ? "translateX(0)"
                        : `translateX(${bulletIdx % 2 === 0 ? 28 : -28}px)`,
                      opacity: visible ? 1 : 0,
                      transition: `transform ${buildTransition(260 + idx * 160 + bulletIdx * 80)}, opacity ${buildTransition(
                        260 + idx * 160 + bulletIdx * 80
                      )}`,
                    }}
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 text-base leading-relaxed">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        ))}
      </div>
    </div>
  );
}
