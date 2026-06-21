import { motion } from "motion/react";
import { Briefcase, ExternalLink, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchExperiences, type Experience as ExperienceItem } from "@/services/experience";

type ExperienceProps = {
  userId: string;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const formatPeriod = (startDate: string, endDate: string | null) =>
  `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : "Present"}`;

export default function Experience({ userId }: ExperienceProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadExperiences() {
      setError(null);
      setIsLoading(true);

      try {
        const data = await fetchExperiences(userId);
        if (isActive) {
          setExperiences(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Unable to load experience.");
          setExperiences([]);
          setIsLoading(false);
        }
      }
    }

    void loadExperiences();

    return () => {
      isActive = false;
    };
  }, [userId]);

  if (!isLoading && !error && experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />

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
              Work Experience
            </span>
          </h2>
          <p className="text-slate-400 text-lg">My professional journey</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500" />

            {isLoading && (
              <div className="space-y-8 pl-20">
                {[0, 1].map((item) => (
                  <div
                    key={item}
                    className="h-72 rounded-xl border border-slate-700/50 bg-slate-800/40 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="ml-20 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
                {error}
              </div>
            )}

            {!isLoading && experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-20 pb-12 last:pb-0"
              >
                {/* Glowing Node */}
                <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse opacity-50" />
                  <div className="relative w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border-2 border-cyan-500 shadow-lg shadow-cyan-500/50">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-colors group">
                  {/* Period Badge */}
                  <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-sm text-cyan-400 mb-3">
                    {formatPeriod(exp.start_date, exp.end_date)}
                  </div>

                  <div className="flex items-start gap-4 mb-3">
                    {exp.organization_logo_url && (
                      <img
                        src={exp.organization_logo_url.url}
                        alt={exp.organization_logo_url.alt}
                        className="h-12 w-12 rounded-lg border border-slate-700 bg-white object-contain p-1"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {exp.designation}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-lg text-purple-400">
                        {exp.organization_url ? (
                          <a
                            href={exp.organization_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                          >
                            {exp.organization_name}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span>{exp.organization_name}</span>
                        )}
                        {exp.location && (
                          <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{exp.description}</p>

                  {exp.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-2">
                    {exp.responsibilities.map((responsibility) => (
                      <li
                        key={responsibility}
                        className="flex items-start gap-2 text-slate-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
