import { useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  Braces,
  Cloud,
  Code2,
  Database,
  Globe,
  Layers,
  Palette,
  Server,
  Smartphone,
} from "lucide-react";

import { homeSkills } from "@/app/data/appData";
import type { HomeSkill, HomeSkillCategory } from "@/app/types/home";

const iconMap: Record<string, ElementType> = {
  Frontend: Code2,
  Backend: Server,
  Database,
  Design: Palette,
  Mobile: Smartphone,
  DevOps: Globe,
  Cloud,
  Languages: Braces,
  default: Layers,
};

const categoryGradients: Record<string, string> = {
  Frontend: "from-cyan-500/20 to-purple-500/20",
  Backend: "from-purple-500/20 to-cyan-500/20",
  Database: "from-cyan-500/20 to-cyan-400/10",
  Design: "from-purple-500/20 to-purple-400/10",
  Mobile: "from-cyan-500/20 to-purple-500/15",
  DevOps: "from-purple-500/20 to-cyan-500/15",
  Cloud: "from-cyan-500/20 to-purple-500/20",
  Languages: "from-cyan-500/15 to-purple-500/20",
  default: "from-cyan-500/15 to-purple-500/15",
};

function SkillCard({ skill, index }: { skill: HomeSkill; index: number }) {
  const Icon = iconMap[skill.category] || iconMap.default;
  const gradientClass =
    categoryGradients[skill.category] || categoryGradients.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
      />

      <div className="relative p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur hover:border-cyan-500/30 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon size={22} className="text-cyan-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-slate-100 group-hover:text-cyan-300 transition-colors duration-300">
              {skill.name}
            </h3>
            <span className="text-xs text-slate-400">{skill.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryFilter({
  categories,
  activeCategory,
  setActiveCategory,
}: {
  categories: HomeSkillCategory[];
  activeCategory: HomeSkillCategory | "all";
  setActiveCategory: (cat: HomeSkillCategory | "all") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="flex flex-wrap justify-center gap-2 mb-12"
    >
      <button
        onClick={() => setActiveCategory("all")}
        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
          activeCategory === "all"
            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20"
            : "bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-500/30"
        }`}
      >
        All
      </button>

      {categories.map((category) => {
        const Icon = iconMap[category] || iconMap.default;
        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeCategory === category
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                : "bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-500/30"
            }`}
          >
            <Icon size={14} />
            {category}
          </button>
        );
      })}
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<HomeSkillCategory | "all">(
    "all",
  );

  const skills = homeSkills;
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section ref={sectionRef} id="skills" className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Skills & Expertise
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A focused toolkit I use to build polished, performant experiences.
          </p>
        </motion.div>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="flex flex-wrap justify-center gap-12 mt-20"
        >
          {[
            { value: skills.length, label: "Technologies", suffix: "+" },
            { value: categories.length, label: "Categories", suffix: "" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.35 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                className="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
              >
                {stat.value}
                {stat.suffix}
              </motion.div>
              <span className="text-sm text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
