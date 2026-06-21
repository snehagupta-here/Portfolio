import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUp,
  Dribbble,
  Github,
  Heart,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Menu,
  Sparkles,
  Twitter,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

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

export default function PortfolioLayout() {
  const { items } = useHomeContent();
  const content = items[0] ?? seedHomeContent[0];
  const personalInfo = content.personalInfo;
  const about = content.about;
  const socialLinks = content.socialLinks;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Blog", href: "/#blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const quickLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Blog", href: "/#blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-lg border-b border-cyan-500/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Portfolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-cyan-500/20">
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <Outlet />

      {/* Footer */}
      {location.pathname === "/" && (
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
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="text-slate-400 hover:text-cyan-400 transition-colors text-sm cursor-pointer"
                      >
                        {link.name}
                      </a>
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
      )}
    </div>
  );
}
