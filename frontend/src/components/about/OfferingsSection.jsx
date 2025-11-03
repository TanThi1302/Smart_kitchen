"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import useRevealSection from "./hooks/useRevealSection";

export default function OfferingsSection({ items = [] }) {
  const { ref: sectionRef, visible } = useRevealSection({ threshold: 0.25, rootMargin: "0px 0px -15%" });
  const easing = "cubic-bezier(0.33, 1, 0.68, 1)";
  const buildTransition = (delay = 0, duration = 900) => `${duration}ms ${easing} ${delay}ms`;

  return (
    <section ref={sectionRef} className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm"
            style={{
              transform: visible ? "translateY(0)" : "translateY(24px)",
              opacity: visible ? 1 : 0,
              transition: `transform ${buildTransition(60)}, opacity ${buildTransition(60)}`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Dịch vụ & Giải pháp
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{
              transform: visible ? "translateY(0)" : "translateY(20px)",
              opacity: visible ? 1 : 0,
              transition: `transform ${buildTransition(120)}, opacity ${buildTransition(120)}`,
            }}
          >
            Giải pháp bếp toàn diện cho gia đình bạn
          </h2>
          <p
            className="text-lg text-gray-600"
            style={{
              transform: visible ? "translateY(0)" : "translateY(16px)",
              opacity: visible ? 1 : 0,
              transition: `transform ${buildTransition(140)}, opacity ${buildTransition(140)}`,
            }}
          >
            Từ sản phẩm chủ lực đến dịch vụ hậu mãi, Kitchen Store đồng hành cùng bạn trong mọi giai đoạn xây dựng căn bếp mơ ước.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item, idx) => (
            <article
              key={item.title ?? idx}
              className="group relative rounded-3xl bg-white border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              style={{
                transform: visible ? "translateY(0)" : `translateY(${48}px)`,
                opacity: visible ? 1 : 0,
                transition: `transform ${buildTransition(200 + idx * 120)}, opacity ${buildTransition(
                  200 + idx * 120
                )}`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-blue-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg text-white">
                  {item.icon ? <item.icon className="w-8 h-8" strokeWidth={1.8} /> : null}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                <ul className="space-y-3">
                  {(item.items ?? []).map((bullet, bulletIdx) => (
                    <li
                      key={bulletIdx}
                      className="flex items-start gap-3 text-gray-700"
                      style={{
                        transform: visible ? "translateX(0)" : `translateX(${bulletIdx % 2 === 0 ? 28 : -28}px)`,
                        opacity: visible ? 1 : 0,
                        transition: `transform ${buildTransition(
                          260 + idx * 120 + bulletIdx * 80
                        )}, opacity ${buildTransition(260 + idx * 120 + bulletIdx * 80)}`,
                      }}
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <CheckCircle className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
