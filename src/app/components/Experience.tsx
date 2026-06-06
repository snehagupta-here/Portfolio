import { motion } from "motion/react";
import { Briefcase } from "lucide-react";

import { homeExperiences } from "@/app/data/appData";

export default function Experience() {
  const experiences = homeExperiences;
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

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
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
                    {exp.period}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {exp.title}
                  </h3>

                  <div className="text-lg text-purple-400 mb-3">
                    {exp.company}
                  </div>

                  <p className="text-slate-300 mb-4">{exp.description}</p>

                  {/* Achievements */}
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <span>{achievement}</span>
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
