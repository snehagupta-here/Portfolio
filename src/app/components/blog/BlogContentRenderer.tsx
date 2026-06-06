import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { BlogSection } from "@/app/types/blog";

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border bg-card/60">
      <div className="bg-secondary px-4 py-1.5 text-xs text-muted-foreground font-mono uppercase tracking-wider border-b border-border">
        {language}
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground leading-relaxed bg-background">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-foreground hover:bg-secondary/50 transition-colors"
      >
        <span className="pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed mt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function BlogContentRenderer({ sections }: { sections: BlogSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <h2
            id={section.id}
            className="text-2xl font-bold mb-3 text-foreground scroll-mt-24"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {section.heading}
            </span>
          </h2>

          {section.text && (
            <p className="text-muted-foreground leading-relaxed mb-4">{section.text}</p>
          )}

          {section.images?.map((img, ii) => (
            <img
              key={ii}
              src={img}
              alt={section.heading}
              className="rounded-lg w-full max-h-80 object-cover my-4 border border-border"
              loading="lazy"
            />
          ))}

          {section.items?.map((item, idx) => (
            <div key={idx} className="mb-6 pl-4 border-l-2 border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {item.subHeading}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{item.description}</p>

              {item.points?.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
                  {item.points.map((p, pi) => (
                    <li key={pi}>{p}</li>
                  ))}
                </ul>
              )}

              {item.images?.map((img, ii) => (
                <img
                  key={ii}
                  src={img}
                  alt={item.subHeading}
                  className="rounded-lg w-full max-h-64 object-cover my-3 border border-border"
                  loading="lazy"
                />
              ))}

              {item.codeSnippet?.map((cs, ci) => (
                <CodeBlock key={ci} language={cs.language} code={cs.code} />
              ))}
            </div>
          ))}

          {section.points?.length > 0 && (
            <ul className="space-y-2 mb-4">
              {section.points.map((p, pi) => (
                <li key={pi} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          )}

          {section.codeSnippet?.map((cs, ci) => (
            <CodeBlock key={ci} language={cs.language} code={cs.code} />
          ))}

          {section.questions?.length > 0 && (
            <div className="space-y-3">
              {section.questions.map((q, qi) => (
                <FAQItem key={qi} question={q.question} answer={q.answer} />
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
