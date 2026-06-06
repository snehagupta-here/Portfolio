import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { useState } from "react";

import { useProjects } from "@/app/lib/useProjects";

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { items } = useProjects();

  const projects = items.map((project, index) => ({
    id: index + 1,
    slug: project.slug,
    title: project.title,
    category: project.meta.category,
    description: project.shortDescription,
    image: project.thumbnail.url,
    tech: project.meta.tags.slice(0, 4), // limit tags
    color: index % 2 === 0 ? "cyan" : "purple",
  }));

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden bg-slate-900/50">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

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
              Featured Projects
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Explore my latest work and creative solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <Link to={`/projects/${project.slug}`}>
                {/* Card Container with 3D Effect */}
                <div
                  className="relative rounded-2xl overflow-hidden bg-slate-800/50 backdrop-blur border border-slate-700/50 transition-all duration-500"
                  style={{
                    transform:
                      hoveredIndex === index
                        ? "translateY(-10px) rotateX(2deg)"
                        : "translateY(0) rotateX(0deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glowing Border on Hover */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-${project.color}-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-opacity duration-500`}
                  />

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur rounded-full text-sm text-cyan-400 border border-cyan-500/30">
                      {project.category}
                    </div>

                    {/* External Links */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-slate-900/80 backdrop-blur rounded-full hover:bg-cyan-500/20 transition-colors">
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button className="p-2 bg-slate-900/80 backdrop-blur rounded-full hover:bg-cyan-500/20 transition-colors">
                        <Github className="w-4 h-4 text-cyan-400" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* View Details Link */}
                    <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-4 transition-all duration-300">
                      View Case Study
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 3D Shadow Effect */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      transform: "translateZ(-20px)",
                      boxShadow:
                        hoveredIndex === index
                          ? `0 30px 60px -20px rgba(6, 182, 212, 0.4)`
                          : "none",
                      transition: "box-shadow 0.5s",
                    }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
