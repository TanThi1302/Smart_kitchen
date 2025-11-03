"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Achievements({ items = [] }) {
  return (
    <div className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <Card key={idx} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {item.number}
              </p>
              <p className="text-gray-600 font-medium">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
