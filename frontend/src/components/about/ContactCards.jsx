"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const toneMap = {
  blue: {
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/30",
    ring: "ring-blue-500/20",
    glow: "shadow-blue-500/50",
  },
  green: {
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/30",
    ring: "ring-emerald-500/20",
    glow: "shadow-emerald-500/50",
  },
  purple: {
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/30",
    ring: "ring-purple-500/20",
    glow: "shadow-purple-500/50",
  },
};

const typeIcons = {
  Hotline: Phone,
  Email: Mail,
  Showroom: MapPin,
};

export default function ContactCards({ contacts = [] }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contacts.map((contact, idx) => {
          const Icon = typeIcons[contact.type] || Phone;
          const tone = toneMap[contact.tone] || toneMap.blue;

          return (
            <div
              key={idx}
              className={`group relative bg-white rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${tone.shadow} hover:${tone.glow} cursor-pointer overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tone.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
              <div className="relative mb-6">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${tone.gradient} p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:rotate-6`}>
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <Icon className="w-9 h-9 text-gray-700 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>
              <div className="relative text-center space-y-3">
                <h3 className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors">
                  {contact.type}
                </h3>
                <p className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {contact.value}
                </p>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  {contact.sub}
                </p>
              </div>
              <div className={`absolute inset-0 rounded-2xl ring-2 ${tone.ring} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
