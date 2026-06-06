import { motion } from "motion/react";
import {
  ArrowUpRight,
  Dribbble,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";

import { homeContent as seedHomeContent } from "@/app/data/appData";
import { useHomeContent } from "@/app/lib/useHomeContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
  mail: Mail,
};

export default function QuickLinks() {
  const { items } = useHomeContent();
  const socialLinks = (items[0] ?? seedHomeContent[0]).socialLinks;
  return (
    <section id="quick-links" className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase">
            Connect
          </span>
          <h2 className="text-5xl font-bold mt-4">
            Quick{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Links
            </span>
          </h2>
          <p className="text-slate-400 mt-6 max-w-xl mx-auto text-lg leading-relaxed">
            Find me across the web. Let&apos;s connect and create something
            extraordinary together.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {socialLinks.map((link, index) => {
            const Icon = iconMap[link.icon] ?? ExternalLink;
            return (
              <motion.a
                key={link.name}
                href={link.url}
                aria-label={link.name}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
                className="group flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition-all duration-300"
              >
                <span className="p-3 rounded-full bg-slate-800/40 backdrop-blur border border-slate-700/50 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5 transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-medium text-lg relative">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </span>
                <ArrowUpRight
                  className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
                  aria-hidden="true"
                />
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent origin-center"
        />
      </div>
    </section>
  );
}
