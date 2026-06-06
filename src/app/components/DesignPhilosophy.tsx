import { motion } from "motion/react";
import { Lightbulb, Sparkles } from "lucide-react";

export default function DesignPhilosophy() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-slate-900/50">
      {/* Background Grid Effect */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(6, 182, 212, 0.8) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Artistic Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Circle */}
              <div className="w-full aspect-square relative">
                {/* Outer Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border-2 border-purple-500/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 border-2 border-pink-500/30 rounded-full"
                />

                {/* Center Glow */}
                <div className="absolute inset-1/4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-2 border-cyan-500 shadow-lg shadow-cyan-500/50"
                  >
                    <Lightbulb className="w-12 h-12 text-cyan-400" />
                  </motion.div>
                </div>

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    style={{
                      top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                      left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <h2 className="text-5xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  My Design Philosophy
                </span>
              </h2>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed">
              I believe that great design is invisible. It should guide users
              naturally, create delightful experiences, and solve real problems
              without getting in the way.
            </p>

            {/* Quote Highlight */}
            <div className="relative my-8">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
              <blockquote className="pl-8 py-4 italic text-2xl text-white leading-relaxed">
                "Design is not just what it looks like and feels like. Design is
                how it works."
              </blockquote>
              <p className="pl-8 mt-2 text-slate-400">— Steve Jobs</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg hover:border-cyan-500/30 transition-colors">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">User-Centric Approach</h4>
                  <p className="text-slate-400">
                    Every decision starts with understanding the user's needs,
                    goals, and pain points.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg hover:border-purple-500/30 transition-colors">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Simplicity & Clarity</h4>
                  <p className="text-slate-400">
                    Complex problems deserve simple solutions. I strip away the
                    unnecessary to focus on what matters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg hover:border-pink-500/30 transition-colors">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Continuous Innovation</h4>
                  <p className="text-slate-400">
                    Technology evolves rapidly. I stay curious and constantly
                    explore new ways to push creative boundaries.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
