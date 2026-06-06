import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  User,
  List,
} from "lucide-react";

import { usePortfolio } from "@/contexts/PortfolioContext";
import { Badge } from "@/app/components/ui/badge";
import BlogContentRenderer from "@/app/components/blog/BlogContentRenderer";

export default function BlogDetails() {
  const { id } = useParams();
  const { blogPosts } = usePortfolio();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-18">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Post not found</h1>
          <Link
            to="/#blog"
            className="text-primary hover:opacity-90 transition-opacity"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);
  const hasRichContent = Boolean(post.sections && post.sections.length > 0);

  return (
    <div className="min-h-screen bg-background pt-18 pb-12">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={post.banner}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 flex-wrap">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readingTime} min read
            </span>
            {post.author?.name && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {post.author.name}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-slate-900/60 text-primary border border-cyan-500/20"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <div className="glass rounded-xl p-6 md:p-8 mb-10">
                {hasRichContent ? (
                  <BlogContentRenderer sections={post.sections!} />
                ) : (
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>
                )}
              </div>

              {related.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                      Related Posts
                    </span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        to={`/blog/${r.id}`}
                        className="glass rounded-xl p-4 hover:border-cyan-500/30 transition-all group"
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Date(r.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {r.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hasRichContent && (
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-foreground">
                      <List className="w-4 h-4 text-accent" />
                      Table of Contents
                    </div>
                    <nav className="space-y-1">
                      {post.sections!.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-slate-900/40 truncate"
                        >
                          {section.heading}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
