import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { ArrowRight, Award, Medal, Star, Trophy } from "lucide-react";

import {
  detailedAchievements,
  getPositionColor,
} from "@/app/data/appData";
import { PositionEnum } from "@/app/types/achievements";

const positionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  [PositionEnum.FIRST]: Trophy,
  [PositionEnum.SECOND]: Medal,
  [PositionEnum.THIRD]: Medal,
  [PositionEnum.WINNER]: Award,
  [PositionEnum.RUNNER_UP]: Award,
  [PositionEnum.FINALIST]: Star,
  [PositionEnum.PARTICIPANT]: Star,
  [PositionEnum.HONORABLE_MENTION]: Star,
};

export default function Achievements() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featured = detailedAchievements[0];
  const rest = useMemo(() => detailedAchievements.slice(1), []);

  if (!featured) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <section
      id="achievements"
      className="py-24 px-6 relative overflow-hidden"
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Achievements &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Awards
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Hackathons, competitions, and recognitions I&apos;m proud of
          </p>
        </motion.div>

        {/* Featured Achievement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative glass rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-bl-full" />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                <Trophy className="w-12 h-12 text-slate-950" />
              </div>

              <div className="text-center md:text-left flex-1">
                <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-semibold mb-4 border border-cyan-500/20">
                  {featured.position}
                </span>
                <h3 className="text-3xl font-bold mb-2 text-white">
                  {featured.title}
                </h3>
                <p className="text-xl text-slate-300 mb-2">
                  {featured.competition_name}
                </p>
                <p className="text-slate-400">{featured.description}</p>
                <p className="text-sm text-slate-500 mt-4">
                  {formatDate(featured.achievement_date)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.map((achievement, index) => {
            const Icon = positionIcons[achievement.position] ?? Star;
            const gradientClass = getPositionColor(achievement.position);

            return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-slate-950" />
                </div>

                <span className="text-xs text-cyan-300 font-semibold">
                  {achievement.position}
                </span>
                <h4 className="text-lg font-bold mt-1 mb-2 text-white">
                  {achievement.title}
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  {achievement.competition_name}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {achievement.description}
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  {formatDate(achievement.achievement_date)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA — View All */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/achievements">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-500/30 text-cyan-300 font-semibold hover:bg-cyan-500/10 transition-colors"
            >
              View All Achievements
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
