import React from "react";
import { experiences } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline, TimelineData } from "@/components/ui/Timeline";

export function ExperienceTimeline() {
  const timelineItems: TimelineData[] = experiences.map((job) => ({
    id: job.id,
    title: job.role,
    subtitle: job.company,
    location: job.location,
    date: job.date,
    type: job.type,
    bullets: job.bullets,
    tags: job.tags,
  }));

  return (
    <section id="experience" className="py-20 md:py-36 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
      
      {/* Reusable Section Heading */}
      <SectionHeading
        label="Career Journey"
        title="Work Experience"
      />

      {/* Reusable Generic Timeline Component */}
      <Timeline items={timelineItems} defaultExpandedId="devops-cicd" />
      
    </section>
  );
}
export default ExperienceTimeline;
