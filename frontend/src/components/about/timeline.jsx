"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Timeline({ milestones }) {
  return (
    <div className="mb-20 bg-gradient-to-br from-gray-100 to-gray-50 py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
            Dấu ấn phát triển
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">Hành trình 10 năm kiến tạo</h2>
          <p className="text-lg text-gray-600">
            Từng cột mốc đánh dấu bước tiến quan trọng trên lộ trình phục vụ khách hàng và mở rộng hệ sinh thái Kitchen Store.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 hidden md:block" />
          <div className="space-y-12">
            {milestones.map((m, idx) => (
              <motion.div
                key={m.year}
                className={`flex items-center gap-8 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                initial={{ opacity: 0, y: 40, x: idx % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, margin: "-20% 0px" }}
              >
                <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <Card className="inline-block shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                    <CardContent className="p-6 md:p-8">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {m.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="hidden md:block w-10 h-10 rounded-full bg-white border-4 border-blue-400 shadow-lg relative z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
