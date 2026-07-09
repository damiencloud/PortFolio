import React from "react";
import { certifications } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificateCard } from "@/components/ui/CertificateCard";

export function Certificates() {
  return (
    <section id="education" className="py-20 md:py-36 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      
      {/* Reusable Section Heading */}
      <SectionHeading
        label="Verifications"
        title="Certifications"
      />

      {/* Grid of tilt cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {certifications.map((cert, idx) => (
          <CertificateCard key={idx} cert={cert} index={idx} />
        ))}
      </div>
    </section>
  );
}
export default Certificates;
