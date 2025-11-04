"use client";

import React from "react";
import { CheckCircle, Sparkles } from "lucide-react";
import useRevealSection from "./hooks/useRevealSection";

export default function ValuesSection({ items = [], colorClasses = {} }) {
  const { ref: sectionRef, visible } = useRevealSection({ threshold: 0.25, rootMargin: "0px 0px -12%" });
  const easing = "cubic-bezier(0.33, 1, 0.68, 1)";
  const buildTransition = (delay = 0, duration = 900) => `${duration}ms ${easing} ${delay}ms`;

  const defaults = {
    bg: "bg-blue-100",
    text: "text-blue-600",
    gradFrom: "from-blue-400",
    gradTo: "to-blue-600",
  };

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-20 relative">
      {/* BG blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          style={{
            transform: visible ? "translate3d(0,0,0)" : "translate3d(-40px,60px,0)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(0, 1200)}, opacity ${buildTransition(0, 1200)}`,
          }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl"
          style={{
            transform: visible ? "translate3d(0,0,0)" : "translate3d(40px,-60px,0)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(0, 1200)}, opacity ${buildTransition(0, 1200)}`,
          }}
        />
      </div>

      {/* Heading */}
      <div className="text-center mb-16 max-w-4xl mx-auto relative">
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 mb-6"
          style={{
            transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.92)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(80)}, opacity ${buildTransition(80)}`,
          }}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">Core Values</span>
        </div>
        <h2
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-6"
          style={{
            transform: visible ? "translateY(0)" : "translateY(20px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(120)}, opacity ${buildTransition(120)}`,
          }}
        >
          Giá trị cốt lõi
        </h2>
        <p
          className="text-xl text-gray-600"
          style={{
            transform: visible ? "translateY(0)" : "translateY(16px)",
            opacity: visible ? 1 : 0,
            transition: `transform ${buildTransition(160)}, opacity ${buildTransition(160)}`,
          }}
        >
          Những nguyên tắc định hướng mọi hành động của chúng tôi
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto relative">
        {items.map((value, idx) => {
          const cc = colorClasses[value.colorKey] || defaults;
          const direction = idx % 2 === 0 ? 1 : -1;
          const cardDelay = 200 + idx * 160;

          return (
            <div
              key={value.title ?? idx}
              style={{
                transform: visible
                  ? "translateY(0) scale(1)"
                  : `translateY(${36 * direction}px) scale(0.95)`,
                opacity: visible ? 1 : 0,
                transition: `transform ${buildTransition(cardDelay)}, opacity ${buildTransition(cardDelay)}`,
              }}
              className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cc.gradFrom} ${cc.gradTo} ${
                  visible ? "opacity-5" : "opacity-0"
                } rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
                style={{
                  transform: visible ? "scale(1)" : "scale(0.7)",
                  transition: `transform ${buildTransition(cardDelay, 1000)}, opacity ${buildTransition(
                    cardDelay,
                    1000
                  )}`,
                }}
              />

              <div className="relative p-8">
                {/* Icon */}
                <div
                  className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${cc.gradFrom} ${cc.gradTo} p-0.5 shadow-lg mb-6 transition-transform duration-500 group-hover:scale-110`}
                  style={{
                    transform: visible ? "rotate(0deg)" : "rotate(-10deg)",
                    transition: `transform ${buildTransition(cardDelay + 80, 900)}`,
                  }}
                >
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    {value.icon ? <value.icon className={`w-10 h-10 ${cc.text}`} strokeWidth={2} /> : null}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{value.desc}</p>

                <div className="space-y-3">
                  {(value.points ?? []).map((point, pointIdx) => (
                    <div
                      key={pointIdx}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      style={{
                        transform: visible
                          ? "translateX(0)"
                          : `translateX(${pointIdx % 2 === 0 ? 28 : -28}px)`,
                        opacity: visible ? 1 : 0,
                        transition: `transform ${buildTransition(
                          cardDelay + 120 + pointIdx * 80
                        )}, opacity ${buildTransition(cardDelay + 120 + pointIdx * 80)}`,
                      }}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${cc.gradFrom} ${cc.gradTo} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`h-1.5 bg-gradient-to-r ${cc.gradFrom} ${cc.gradTo} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
