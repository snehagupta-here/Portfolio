import { Coffee, Code2, Download, Lightbulb, Mail, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { API_BASE_URL, PORTFOLIO_USER_ID } from "@/app/config";
import { homeContent as seedHomeContent } from "@/app/data/appData";
import { useHomeContent } from "@/app/lib/useHomeContent";
import { downloadResume } from "@/services/user";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const highlightIcons = [Code2, Lightbulb, Coffee] as const;

const withPlus = (value: string) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  if (trimmed.includes("+")) return trimmed;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}+`;
  return trimmed;
};

export default function About() {
  const { items } = useHomeContent();
  const content = items[0] ?? seedHomeContent[0];
  const personalInfo = content.personalInfo;
  const about = content.about;
  const years = withPlus(about.totalYearsExperience);
  const projects = withPlus(about.projectsCompleted);
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const handleResumeDownload = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    try {
      const { blob, fileName } = await downloadResume(PORTFOLIO_USER_ID);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || about.resumeFileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      if (about.resumeUrl && about.resumeUrl !== "#") {
        window.open(about.resumeUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
	        >
	          <h2 className="text-5xl font-bold mb-4">
	            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
	              About Me
	            </span>
	          </h2>
	        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
              <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
	            <div className="relative group">
	              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-glow rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
	              <ImageWithFallback
	                src={personalInfo.aboutImage}
	                alt={about.picture.alt}
	                className="relative rounded-2xl w-full h-[400px] object-cover"
	              />
	              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-xl">
	                <p className="text-4xl mb-2 font-display font-bold gradient-text">{years}</p>
	                <p className="text-sm text-muted-foreground">Years of Experience</p>
	              </div>
	            </div>
	
	            {/* Stats Grid */}
	            <div className="grid grid-cols-2 gap-4">
	              {[
                  { label: "Years Experience", value: years },
                  { label: "Projects Completed", value: projects },
                ].map((stat, index) => (
	                <motion.div
	                  key={stat.label}
	                  initial={{ opacity: 0, y: 20 }}
	                  animate={isInView ? { opacity: 1, y: 0 } : {}}
	                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="card-luxury text-center"
                >
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
	          >
	            <h3 className="text-3xl font-bold text-white">{about.heading}</h3>
	             
              {about.paragraphs.map((p) => (
	            <p key={p.key} className="text-[#98a1b3] text-md leading-relaxed">
	              {p.text}
	            </p>
              ))}

            {/* Contact Info */}
	            <div className="space-y-2 pt-2">
	              <div className="flex items-center gap-3 text-slate-400">
	                <MapPin className="w-5 h-5 text-cyan-300" />
	                <span>{about.location}</span>
	              </div>
	              <div className="flex items-center gap-3 text-slate-400">
	                <Mail className="w-5 h-5 text-cyan-300" />
	                <span>{personalInfo.email}</span>
	              </div>
	            </div>

	            {/* Highlights */}
	            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
	              {about.highlights.map((item, index) => {
                  const Icon = highlightIcons[index % highlightIcons.length];
                  return (
	                <div key={item.title} className="text-center">
	                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
	                    <Icon className="w-6 h-6 text-cyan-300" />
	                  </div>
	                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
	                  <p className="text-xs text-slate-400">{item.description}</p>
	                </div>
	              );
                })}
	            </div>
	
	            {/* CTA */}
	            <motion.a
	              href={`${API_BASE_URL}/user/${PORTFOLIO_USER_ID}/download-resume`}
                download={about.resumeFileName || "resume.pdf"}
                onClick={handleResumeDownload}
	              whileHover={{ scale: 1.02 }}
	              whileTap={{ scale: 0.98 }}
	              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500  font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow"
	            >
	              <Download className="w-5 h-5" />
	              Download Resume
	            </motion.a>
	          </motion.div>
	        </div>
      </div>
    </section>
  );
}
