
"use client";

import React from "react";
import {
  Reveal,
  Hero,
  Timeline,
  Achievements,
  StorySection,
  MissionVisionSection,
  OfferingsSection,
  ValuesSection,
  CTASection,
  ContactCards,
} from "../components/about";

import {
  slides,
  milestones,
  achievements,
  missionVision,
  offerings,
  values,
  colorClasses,
  certifications,
  contacts,
} from "../components/about/data";


export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Reveal>
        <Hero />
      </Reveal>

      <Reveal delay={0.05} className="-mt-16 relative z-20 mb-20">
        <Achievements items={achievements} />
      </Reveal>

      <Reveal delay={0.1} className="mb-20">
        <StorySection slides={slides} certifications={certifications} />
      </Reveal>

      <Reveal delay={0.1} className="mb-20">
        <Timeline milestones={milestones} />
      </Reveal>

      <Reveal delay={0.08} className="mb-20">
        <MissionVisionSection items={missionVision} />
      </Reveal>

      <Reveal delay={0.1} className="mb-20">
        <OfferingsSection items={offerings} />
      </Reveal>

      <Reveal delay={0.1} className="mb-20">
        <ValuesSection items={values} colorClasses={colorClasses} />
      </Reveal>

      <Reveal delay={0.1} className="mb-20">
        <CTASection />
      </Reveal>

      <Reveal delay={0.1} className="pb-20">
        <ContactCards contacts={contacts} />
      </Reveal>
    </div>
  );
}
