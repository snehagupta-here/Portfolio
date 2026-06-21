import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

export default function Blog() {
  const { blogError, blogPosts, isBlogLoading } = usePortfolio();
  return (
    <section id="blog" className="py-24 px-6 relative overflow-hidden">
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
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Latest Blog Posts
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Thoughts, tutorials, and insights on web development
          </p>
        </motion.div>

        {isBlogLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-96 rounded-xl border border-slate-700/50 bg-slate-800/40 animate-pulse"
              />
            ))}
          </div>
        )}

        {!isBlogLoading && blogError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
            {blogError}
          </div>
        )}

        {!isBlogLoading && !blogError && blogPosts.length === 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 text-center text-slate-400">
            No blog posts available yet.
          </div>
        )}

        {!isBlogLoading && !blogError && blogPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group block h-full"
              >
                <div className="h-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-purple-950" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-400 mb-4 line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-4 transition-all duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
