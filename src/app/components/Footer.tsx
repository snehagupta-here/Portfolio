import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUp,
  Dribbble,
  Github,
  Heart,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Sparkles,
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
  link: LinkIcon,
};

const quickLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Blog", href: "/#blog" },
  { name: "Contact", href: "/#contact" },
];

export default function Footer() {
  const { items } = useHomeContent();
  const content = items[0] ?? seedHomeContent[0];
  const personalInfo = content.personalInfo;
  const about = content.about;
  const socialLinks = content.socialLinks;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-cyan-500/20 bg-slate-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
              </motion.div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {personalInfo.name}
              </span>
            </Link>

            <p className="text-slate-400 max-w-md">
              {personalInfo.tagline}. Building modern web applications with a
              focus on performance, accessibility, and user experience.
            </p>

            <div className="flex gap-4">
              {socialLinks.slice(0, 5).map((link) => {
                const Icon = iconMap[link.icon] || Mail;
                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    aria-label={link.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {personalInfo.email}
                </a>
              </li>
              <li>{about.location}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 flex items-center gap-1">
            © {new Date().getFullYear()} {personalInfo.name}. Made with
            <Heart className="w-4 h-4 text-purple-400 fill-current" />
            and lots of coffee.
          </p>

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl glass hover:border-cyan-500/40 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
