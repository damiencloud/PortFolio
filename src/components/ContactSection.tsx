import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig, socialLinks } from "@/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

// Dynamic Icon rendering
function ContactIcon({ name, size = 20 }: { name: string; size?: number }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    setErrorText(null);

    const config = siteConfig.contactForm;
    
    // Local simulator fallback if keys are not set
    if (!config || config.provider === "simulated" || config.accessKeyOrId === "YOUR_ACCESS_KEY_HERE" || !config.accessKeyOrId) {
      setTimeout(() => {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      }, 1500);
      return;
    }

    try {
      let response;
      if (config.provider === "web3forms") {
        response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: config.accessKeyOrId,
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `Contact Form Submission from ${form.name}`,
            from_name: "Developer Portfolio Portal",
          }),
        });
      } else {
        response = await fetch(`https://formspree.io/f/${config.accessKeyOrId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
          }),
        });
      }

      if (response.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to deliver message.");
      }
    } catch (err: any) {
      setErrorText(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
      setTimeout(() => setErrorText(null), 5000);
    }
  };

  const socialColors: { [key: string]: { border: string; bg: string } } = {
    Github: { border: "border-violet-500/20 dark:border-violet-500/30", bg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600" },
    Linkedin: { border: "border-cyan-500/20 dark:border-cyan-500/30", bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600" },
    Email: { border: "border-indigo-500/20 dark:border-indigo-500/30", bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600" },
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      
      {/* Reusable Section Heading */}
      <SectionHeading
        label="Let's Connect"
        title="Get In Touch"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        {/* Left Side: Quick Connect Cards (Span 2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {socialLinks.map((social) => {
            const styles = socialColors[social.iconName] || socialColors.Email;
            return (
              <GlassCard
                key={social.platform}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => window.open(social.url, "_blank")}
                className="flex items-center gap-5 p-6 cursor-pointer group"
              >
                <div className={cn("p-3.5 rounded-2xl group-hover:text-white transition-colors duration-300", styles.bg)}>
                  <ContactIcon name={social.iconName} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{social.platform} Link</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50 truncate">
                    {social.username}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Right Side: Message Card Input (Span 3 Columns) */}
        <div className="lg:col-span-3">
          <GlassCard hoverEffect={false} className="p-8 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 text-indigo-500 font-semibold tracking-wider text-xs uppercase mb-6">
              <LucideIcons.MessageSquare size={14} />
              Send a Direct Message
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    disabled={status !== "idle"}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-50 text-sm focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors disabled:opacity-60"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    disabled={status !== "idle"}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-50 text-sm focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Your Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Hey Damien, I would love to connect about a role or project..."
                  disabled={status !== "idle"}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-50 text-sm focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors disabled:opacity-60 resize-none"
                />
              </div>

              <ShimmerButton
                type="submit"
                disabled={status !== "idle"}
                borderRadius="0.75rem"
                background={status === "success" ? "#059669" : "var(--primary-btn-bg)"}
                shimmerColor={status === "success" ? "#10b981" : "var(--primary-btn-shimmer)"}
                className={cn(
                  "mt-2 w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  status === "success"
                    ? "text-white"
                    : "text-[var(--primary-btn-text)]"
                )}
              >
                {status === "idle" && (
                  <>
                    Send Message
                    <LucideIcons.Send size={14} />
                  </>
                )}
                {status === "sending" && <span>Sending Message...</span>}
                {status === "success" && (
                  <>
                    Message Sent Successfully
                    <LucideIcons.CheckCircle2 size={16} />
                  </>
                )}
              </ShimmerButton>
              {errorText && (
                <p className="text-xs text-red-500 font-mono text-center mt-2">
                  {errorText}
                </p>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
export default ContactSection;
