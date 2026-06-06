import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Target,
  Award,
} from "lucide-react";

const projectData: Record<string, any> = {
  "1": {
    title: "AI-Powered Dashboard",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    client: "TechStart Inc.",
    duration: "3 months",
    year: "2025",
    description:
      "A comprehensive analytics platform designed to provide real-time insights and AI-driven recommendations for business intelligence. The dashboard features advanced data visualization, customizable widgets, and predictive analytics capabilities.",
    challenge:
      "The client needed a way to consolidate data from multiple sources and present complex analytics in an intuitive, user-friendly interface that could handle millions of data points in real-time.",
    solution:
      "We built a modular dashboard system with React and TypeScript, implementing efficient data caching strategies and WebSocket connections for real-time updates. The AI engine was integrated using a microservices architecture.",
    results: [
      "40% increase in data analysis efficiency",
      "Real-time processing of 1M+ events per second",
      "95% user satisfaction rate",
      "Reduced decision-making time by 60%",
    ],
    tech: [
      "React",
      "TypeScript",
      "D3.js",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "TensorFlow",
    ],
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
    ],
  },
  "2": {
    title: "3D Product Configurator",
    category: "Interactive Experience",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    client: "Luxury Furniture Co.",
    duration: "4 months",
    year: "2025",
    description:
      "An immersive 3D product customization tool that allows customers to configure furniture in real-time with photorealistic rendering and AR preview capabilities.",
    challenge:
      "Creating a seamless 3D experience that works across all devices while maintaining high-quality graphics and smooth performance, plus integrating AR functionality for mobile devices.",
    solution:
      "Leveraged Three.js and WebGL for 3D rendering, implemented progressive loading for large models, and integrated AR.js for mobile AR experiences. Built a custom material system for realistic fabric and wood textures.",
    results: [
      "70% increase in customer engagement",
      "45% higher conversion rate",
      "50% reduction in product returns",
      "Featured in design awards",
    ],
    tech: [
      "Three.js",
      "React",
      "WebGL",
      "AR.js",
      "Blender",
      "Node.js",
    ],
    images: [
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    ],
  },
  "3": {
    title: "Social Media Platform",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    client: "ConnectApp Startup",
    duration: "6 months",
    year: "2024",
    description:
      "Next-generation social networking mobile application with enhanced privacy features, intelligent content discovery, and real-time communication capabilities.",
    challenge:
      "Building a scalable social platform that prioritizes user privacy while delivering personalized content recommendations and maintaining high performance with real-time features.",
    solution:
      "Developed using React Native for cross-platform compatibility, implemented end-to-end encryption for messages, and created a custom recommendation algorithm. Used WebRTC for video calls and Firebase for real-time data sync.",
    results: [
      "500K+ downloads in first 3 months",
      "4.8 star rating on app stores",
      "80% daily active users",
      "Industry recognition for privacy features",
    ],
    tech: [
      "React Native",
      "Firebase",
      "Redux",
      "WebRTC",
      "MongoDB",
      "Express",
    ],
    images: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80",
    ],
  },
  "4": {
    title: "E-Commerce Marketplace",
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80",
    client: "ShopHub",
    duration: "5 months",
    year: "2024",
    description:
      "Modern e-commerce marketplace with AI-powered product recommendations, seamless checkout experience, and comprehensive seller dashboard.",
    challenge:
      "Creating a marketplace that handles thousands of products, provides personalized shopping experiences, and ensures secure transactions while maintaining fast load times.",
    solution:
      "Built with Next.js for optimal SEO and performance, integrated Stripe for payments, implemented AI recommendation engine, and used PostgreSQL with Redis caching for data management.",
    results: [
      "$2M+ in transaction volume",
      "1000+ active sellers",
      "92% customer satisfaction",
      "30% increase in average order value",
    ],
    tech: [
      "Next.js",
      "Stripe",
      "PostgreSQL",
      "Redis",
      "TensorFlow",
      "AWS",
    ],
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    ],
  },
};

export default function ProjectDetails() {
  const { id } = useParams();
  const project = id ? projectData[id] : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Link
            to="/"
            className="text-primary hover:opacity-90 transition-opacity"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary mb-4">
                {project.category}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {project.client}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {project.year}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Overview</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">The Challenge</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.challenge}
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">The Solution</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.solution}
              </p>
            </motion.div>

            {/* Project Images */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {project.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Results</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {project.results.map((result: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-foreground">{result}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-foreground mb-6">Project Info</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-muted-foreground text-sm mb-1">Client</div>
                  <div className="text-foreground font-medium">{project.client}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">Duration</div>
                  <div className="text-foreground font-medium">
                    {project.duration}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">Year</div>
                  <div className="text-foreground font-medium">{project.year}</div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 mb-6">
                <h4 className="text-foreground font-medium mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary/50 rounded-full text-sm text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Live Site
                </button>
                <button className="px-4 py-3 border border-cyan-500 rounded-lg hover:bg-cyan-500/10 transition-colors">
                  <Github className="w-5 h-5 text-primary" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
