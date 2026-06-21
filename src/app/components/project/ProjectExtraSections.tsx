import { motion } from "framer-motion";
import { useState } from "react";
import {
  Zap, TestTube2, FolderTree, FileCode2, Layout, GitBranch,
  Cloud, KeyRound, ChevronRight, ChevronDown, Activity, Shield,
  Terminal, Globe, Server, Lock, Unlock
} from "lucide-react";
import type {
  PerformanceItem, TestingItem, FolderNode, ProjectPage,
  CICD, DeploymentItem, EnvVariableGroup
} from "../../data/richProjectData";

// ── Performance Section ──
export const PerformanceSection = ({ items }: { items: PerformanceItem[] }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><Zap size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">Performance & Caching</h2>
    </div>
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={item.id} className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-purple-400" />
                <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${item.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
              {item.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Type</p>
              <p className="text-sm font-medium text-foreground">{item.type}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Layer</p>
              <p className="text-sm font-medium text-foreground">{item.layer}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tool</p>
              <p className="text-sm font-medium text-foreground">{item.configuration.tool}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Strategy</p>
              <p className="text-sm font-medium text-foreground">{item.configuration.strategy}</p>
            </div>
          </div>
          {Object.keys(item.configuration.settings).length > 0 && (
            <div className="bg-background/50 rounded-lg p-3 border border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Settings</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.configuration.settings).map(([k, v]) => (
                  <code key={k} className="text-xs bg-secondary px-2 py-1 rounded text-foreground/80">
                    <span className="text-purple-400">{k}</span>: {String(v)}
                  </code>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground w-full mb-1">Invalidation Triggers</p>
            {item.triggers.map((t, i) => (
              <span key={i} className="text-xs font-mono bg-purple-500/10 text-purple-400 px-2 py-1 rounded">{t}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Expected Improvement</p>
              <p className="text-sm text-foreground">{item.metrics.expectedImprovement}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Complexity Impact</p>
              <p className="text-sm text-foreground capitalize">{item.metrics.complexityImpact}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

// ── Testing Section ──
export const TestingSection = ({ items }: { items: TestingItem[] }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><TestTube2 size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">Testing Strategy</h2>
    </div>
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={item.id} className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-purple-400" />
                <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded">{item.type}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${item.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
              {item.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tools.map((tool, i) => (
              <span key={i} className="text-xs bg-secondary px-3 py-1 rounded-full text-foreground/80">{tool}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Layer</p>
              <p className="text-sm font-medium text-foreground">{item.layer}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Environment</p>
              <p className="text-sm font-medium text-foreground">{item.configuration.environment}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">File Pattern</p>
              <code className="text-xs font-mono text-purple-400">{item.target.filePattern}</code>
            </div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Coverage Target</p>
              <span className="text-lg font-bold text-purple-400">{item.coverage.targetPercentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-3">
              <div className="bg-purple-500 rounded-full h-2 transition-all" style={{ width: `${item.coverage.targetPercentage}%` }} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.coverage.focusAreas.map((area, i) => (
                <span key={i} className="text-[11px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">{area}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

// ── Folder Structure ──
const FolderNodeView = ({ node, depth = 0 }: { node: FolderNode; depth?: number }) => {
  const [open, setOpen] = useState(depth < 2);
  const isFolder = node.type === "folder";

  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(!open)}
        className={`flex items-center gap-2 py-1.5 px-2 w-full text-left hover:bg-secondary/50 rounded transition-colors ${!isFolder ? "cursor-default" : ""}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {isFolder ? (
          open ? <ChevronDown size={12} className="text-purple-400 shrink-0" /> : <ChevronRight size={12} className="text-purple-400 shrink-0" />
        ) : (
          <FileCode2 size={12} className="text-muted-foreground shrink-0" />
        )}
        <span className={`text-sm font-mono ${isFolder ? "text-purple-400 font-medium" : "text-foreground/80"}`}>
          {isFolder ? <FolderTree size={14} className="inline mr-1.5 text-purple-400/70" /> : null}
          {node.name}
        </span>
        {node.description && (
          <span className="text-[11px] text-muted-foreground ml-2 truncate">— {node.description}</span>
        )}
      </button>
      {isFolder && open && node.children?.map((child) => (
        <FolderNodeView key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
};

export const FolderStructureSection = ({ nodes }: { nodes: FolderNode[] }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><FolderTree size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">Folder Structure</h2>
    </div>
    <div className="glass rounded-xl p-4 overflow-hidden">
      <div className="bg-secondary/30 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
        <Terminal size={14} className="text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground">project root</span>
      </div>
      {nodes.map((node) => (
        <FolderNodeView key={node.id} node={node} />
      ))}
    </div>
  </motion.section>
);

// ── Pages Section ──
export const PagesSection = ({ pages }: { pages: ProjectPage[] }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><Layout size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">Pages & Routes</h2>
    </div>
    <div className="grid gap-4">
      {pages.map((page) => (
        <div key={page.id} className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{page.name}</h3>
              <p className="text-sm text-muted-foreground">{page.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {page.access === "public" ? (
                <span className="text-xs flex items-center gap-1 bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-full">
                  <Unlock size={10} /> public
                </span>
              ) : (
                <span className="text-xs flex items-center gap-1 bg-amber-500/15 text-amber-400 px-2 py-1 rounded-full">
                  <Lock size={10} /> private
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Route</p>
              <code className="text-sm font-mono text-purple-400">{page.route}</code>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Layout</p>
              <p className="text-sm font-medium text-foreground">{page.layout}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Rendering</p>
              <p className="text-sm font-medium text-foreground">{page.rendering}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Purpose</p>
              <p className="text-xs text-foreground/80">{page.purpose}</p>
            </div>
          </div>
          {page.sections.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Sections</p>
              <div className="grid gap-2">
                {page.sections.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                    <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </motion.section>
);

// ── CI/CD Section ──
export const CICDSection = ({ cicd }: { cicd: CICD }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><GitBranch size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">CI/CD Pipeline</h2>
    </div>
    <div className="glass rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tool</p>
          <p className="text-sm font-semibold text-foreground">{cicd.tool}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Trigger</p>
          <p className="text-sm text-foreground">{cicd.trigger}</p>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Pipeline Steps</p>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-3">
            {cicd.pipeline.map((step) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.step * 0.05 }}
                className="flex items-center gap-4 relative"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center z-10 shrink-0">
                  <span className="text-xs font-bold text-purple-400">{step.step}</span>
                </div>
                <div className="flex-1 bg-secondary/30 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{step.name}</span>
                  <code className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">{step.command}</code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {cicd.blockers && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
          <p className="text-xs text-amber-400">{cicd.blockers}</p>
        </div>
      )}
    </div>
  </motion.section>
);

// ── Deployment Section ──
export const DeploymentSection = ({ items }: { items: DeploymentItem[] }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><Cloud size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">Deployment</h2>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div key={i} className="glass rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-purple-400" />
            <h3 className="font-display text-base font-semibold text-foreground capitalize">{item.type}</h3>
          </div>
          {(item.details || []).map((detail, j) => (
            <div key={j} className="space-y-1.5">
              {Object.entries(detail).filter(([k]) => k !== "target").map(([k, v]) => (
              <div
  key={k}
  className="bg-secondary/50 rounded-lg px-3 py-2"
>
  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
    {k}
  </div>

  <div className="text-xs font-mono text-foreground/80 text-left">
    {Array.isArray(v) ? v.join(", ") : String(v)}
  </div>
</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  </motion.section>
);

// ── Environment Variables Section ──
export const EnvVariablesSection = ({ groups }: { groups: EnvVariableGroup[] }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-purple-400"><KeyRound size={18} /></span>
      <h2 className="font-display text-2xl md:text-3xl font-bold">Environment Variables</h2>
    </div>
    <div className="space-y-4">
      {groups.map((group, i) => (
        <div key={i} className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={14} className="text-purple-400" />
            <h3 className="font-display text-base font-semibold text-foreground capitalize">{group.type}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-medium">Variable</th>
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-medium">Description</th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Example</th>
                </tr>
              </thead>
              <tbody>
                {group.variable.map((v, j) => (
                  <tr key={j} className="border-b border-border/50">
                    <td className="py-2.5 pr-4"><code className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{v.key}</code></td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{v.description}</td>
                    <td className="py-2.5"><code className="text-xs font-mono text-foreground/60">{v.example}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);
