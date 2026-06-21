import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  Code2,
  Database,
  Rocket,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import type {
  ContentSection,
  ContentSubItem,
  CodeSnippet as CodeSnippetType,
  RichProject,
} from "../data/richProjectData";
import { useEffect, useState } from "react";
import {
  PerformanceSection,
  TestingSection,
  FolderStructureSection,
  PagesSection,
  CICDSection,
  DeploymentSection,
  EnvVariablesSection,
} from "../components/project/ProjectExtraSections";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PORTFOLIO_USER_ID } from "@/app/config";
import { fetchProjects } from "@/services/project";

// ── Table of Contents ──
const TableOfContents = ({ sections }: { sections: ContentSection[] }) => {
  return (
    <nav className="glass rounded-xl p-5 sticky top-28">
      <h3 className="font-display text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wider">
        Contents
      </h3>
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-sm text-muted-foreground hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <ChevronRight size={12} className="text-purple-400/60" />
              {s.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// ── Code Block ──
const CodeBlock = ({ snippet }: { snippet: CodeSnippetType }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-secondary px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground">
          {snippet.language}
        </span>
        <button onClick={copy} className="text-xs text-purple-400 hover:underline">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {snippet.description && (
        <p className="text-xs text-muted-foreground px-4 py-2 bg-secondary/50 border-b border-border">
          {snippet.description}
        </p>
      )}

     <pre className="p-4 text-sm font-mono max-h-[500px] text-foreground/90 bg-background whitespace-pre-wrap overflow-x-auto">
  <code>{Array.isArray(snippet.code) ? snippet.code.join("\n") : snippet.code}</code>
</pre>
    </div>
  );
};

// ── Section Image ──
const SectionImage = ({
  img,
}: {
  img: { url: string; alt: string; caption?: string };
}) => (
  <motion.figure
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="my-6 rounded-xl overflow-hidden border border-border"
  >
    <ImageWithFallback src={img.url} alt={img.alt} className="w-full max-h-[600px]  object-contain bg-background" />
    {img.caption && (
      <figcaption className="text-xs text-muted-foreground px-4 py-3 bg-secondary/50 text-center italic">
        {img.caption}
      </figcaption>
    )}
  </motion.figure>
);

// ── Heading Based Section ──
const HeadingBasedSection = ({ section }: { section: ContentSection }) => (
  <div>
    {section.paragraphs.map((p, i) => (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {p}
      </p>
    ))}
    {section.images?.map((img, i) => <SectionImage key={i} img={img} />)}
    {section.codeSnippets?.map((cs, i) => <CodeBlock key={i} snippet={cs} />)}
  </div>
);

// ── Point Based Section ──
const PointBasedSection = ({ section }: { section: ContentSection }) => (
  <div>
    {section.paragraphs.map((p, i) => (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {p}
      </p>
    ))}
    <SectionPoints points={section.points} />
    {section.images?.map((img, i) => <SectionImage key={i} img={img} />)}
    {section.codeSnippets?.map((cs, i) => <CodeBlock key={i} snippet={cs} />)}
  </div>
);

const SectionPoints = ({ points }: { points?: ContentSection["points"] }) => {
  if (!points || points.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2.5">
      {points.map((point, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-2 text-sm text-muted-foreground"
        >
          <span className="text-purple-400 mt-1 shrink-0">▸</span>
          <span>
           
            {point.description}
          </span>
        </motion.li>
      ))}
    </ul>
  );
};

// ── SubHeading Based Section ──
const SubHeadingBasedSection = ({ section }: { section: ContentSection }) => (
  <div>
    {section.paragraphs.map((p, i) => (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {p}
      </p>
    ))}
    <SectionPoints points={section.points} />
    {section.images?.map((img, i) => <SectionImage key={i} img={img} />)}
    {section.codeSnippets?.map((cs, i) => <CodeBlock key={i} snippet={cs} />)}
    <div className="space-y-8 mt-4">
      {section.items?.map((item, i) => (
        <SubItem key={i} item={item} />
      ))}
    </div>
  </div>
);

const SubItem = ({ item }: { item: ContentSubItem }) => (
  <div className="glass rounded-xl p-6">
    <h4 className="font-display text-lg font-semibold text-foreground mb-3">
      {item.subHeading}
    </h4>
    {item.paragraphs.map((p, i) => (
      <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-3">
        {p}
      </p>
    ))}
    {item.points && item.points.length > 0 && (
      <ul className="mt-3 space-y-1.5">
        {item.points.map((pt, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="text-purple-400 mt-1 shrink-0">▸</span>
            {pt}
          </li>
        ))}
      </ul>
    )}
    {item.images?.map((img, i) => <SectionImage key={i} img={img} />)}
    {item.codeSnippets?.map((cs, i) => <CodeBlock key={i} snippet={cs} />)}
  </div>
);

// ── FAQ Section ──
const FAQSection = ({ section }: { section: ContentSection }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {section.paragraphs.map((p, i) => (
        <p key={i} className="text-muted-foreground leading-relaxed mb-4">
          {p}
        </p>
      ))}
      <div className="space-y-3 mt-4">
        {section.questions?.map((q, i) => (
          <div key={i} className="glass rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <span className="font-display text-sm font-medium text-foreground">
                {q.question}
              </span>
              <ChevronRight
                size={16}
                className={`text-purple-400 transition-transform ${
                  openIndex === i ? "rotate-90" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-5 pb-4"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {q.answer}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Section Renderer ──
const ContentRenderer = ({ section }: { section: ContentSection }) => {
  const iconMap: Record<string, React.ReactNode> = {
    intro: <Layers size={18} />,
    section: <Code2 size={18} />,
    faq: <HelpCircle size={18} />,
    conclusion: <Rocket size={18} />,
  };

  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="scroll-mt-28"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-purple-400">
          {iconMap[section.type] || <Layers size={18} />}
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          {section.heading}
        </h2>
      </div>

      {section.contentType === "headingBased" && (
        <HeadingBasedSection section={section} />
      )}
      {section.contentType === "pointBased" && (
        <PointBasedSection section={section} />
      )}
      {section.contentType === "subHeadingBased" && (
        <SubHeadingBasedSection section={section} />
      )}
      {section.contentType === "questionBased" && (
        <FAQSection section={section} />
      )}
    </motion.section>
  );
};

// ── API Reference ──
const APIReference = ({
  apis,
}: {
  apis: NonNullable<RichProject["apis"]>;
}) => {
  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400",
    POST: "bg-blue-500/20 text-blue-400",
    PATCH: "bg-amber-500/20 text-amber-400",
    DELETE: "bg-red-500/20 text-red-400",
    PUT: "bg-purple-500/20 text-purple-400",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="scroll-mt-28"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-purple-400">
          <ExternalLink size={18} />
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          API Reference
        </h2>
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        Base URL: <code className="text-purple-400 font-mono">{apis.baseUrl}</code>
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Auth: {apis.authentication}
      </p>

      {apis?.groups?.map((group) => (
        <div key={group.name} className="mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            {group.name}
          </h3>
          <div className="space-y-2">
            {group.endpoints.map((ep) => (
              <div
                key={ep.id}
                className="glass rounded-lg px-4 py-3 flex items-center gap-3"
              >
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    methodColors[ep.method] ||
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-[11px] font-mono text-foreground/80">
                  {apis.baseUrl}
                  {ep.route}
                </code>
                <span className="text-[11px] text-muted-foreground ml-auto hidden md:inline">
                  {ep.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.section>
  );
};

// ── Database Schema ──
const DatabaseSchema = ({
  database,
}: {
  database: NonNullable<RichProject["database"]>;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="scroll-mt-28"
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="text-purple-400">
        <Database size={18} />
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">
        Database Schema
      </h2>
    </div>

    <p className="text-sm text-muted-foreground mb-6">{database.databaseType}</p>

    {database?.tables?.map((table) => (
      <div key={table.tableName} className="glass rounded-xl p-5 mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1 font-mono">
          {table.tableName}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {table.description}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-medium">
                  Column
                </th>
                <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-medium">
                  Type
                </th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">
                  Constraints
                </th>
              </tr>
            </thead>
            <tbody>
              {table?.columns?.map((col) => (
                <tr key={col.name} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono text-purple-400 text-xs">
                    {col.name}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-foreground/70">
                    {col.type}
                  </td>
                  <td className="py-2 text-xs text-muted-foreground">
                    {col.constraints || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    ))}
  </motion.section>
);

// ── Main Page ──
const RichProjectDetail = () => {
  const { slug } = useParams();
  const [projects, setProjects] = useState<RichProject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    let ignore = false;
console.log("Fetching projects for user:", PORTFOLIO_USER_ID);
    async function loadProjects() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProjects(PORTFOLIO_USER_ID);
        console.log("the data is",data);
        if (!ignore) {
          setProjects(data);
        }
      } catch (error) {
        if (!ignore) {
          setProjects([]);
          setError(error instanceof Error ? error.message : "Unable to load project.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-secondary/40 animate-pulse" />
        <div className="section-padding">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="h-8 w-2/3 rounded bg-secondary animate-pulse" />
            <div className="h-4 w-full rounded bg-secondary animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-secondary animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-48 rounded-xl bg-secondary/70 animate-pulse" />
              <div className="h-48 rounded-xl bg-secondary/70 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <p className="text-muted-foreground">
            {error || "Project not found."}
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <ImageWithFallback
          src={project.banner.url}
          alt={project.banner.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-8">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors mb-4 text-sm"
            >
              <ArrowLeft size={14} /> Back to Projects
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {project.meta.category}
                </span>
                <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                  {project.meta.difficulty}
                </span>
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {project.meta.status}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground max-w-2xl text-sm md:text-base">{project.tagline}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {project.meta.estimatedReadTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {project.meta.duration}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="section-padding pt-6 pb-0">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {project.meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="section-padding">
        <div className="max-w-5xl mx-auto flex gap-8">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-64 shrink-0">
            <TableOfContents sections={project.content} />
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-16">
            {project.content.map((section) => (
              <ContentRenderer key={section.id} section={section} />
            ))}

            {project && project.apis && <APIReference apis={project.apis} />}
            {project && project.database && <DatabaseSchema database={project.database} />}
            {project.performance && <PerformanceSection items={project.performance} />}
            {project.testing && <TestingSection items={project.testing} />}
            {project.folderStructure && (
              <FolderStructureSection nodes={project.folderStructure} />
            )}
            {project.pages && <PagesSection pages={project.pages} />}
            {project.cicd && <CICDSection cicd={project.cicd} />}
            {project.deployment && <DeploymentSection items={project.deployment} />}
            {project.environmentVariables && (
              <EnvVariablesSection groups={project.environmentVariables} />
            )}

            {project.futureImprovements && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-purple-400">
                    <Rocket size={18} />
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">
                    Future Improvements
                  </h2>
                </div>

                <div className="grid gap-3">
                  {project.futureImprovements.map((fi, i) => (
                    <div
                      key={i}
                      className="glass rounded-lg p-4 border-l-2 border-purple-500"
                    >
                      <h4 className="font-display text-sm font-semibold text-foreground mb-1">
                        {fi.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {fi.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default RichProjectDetail;
