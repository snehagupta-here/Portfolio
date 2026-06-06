import { motion } from "motion/react";

type ShapeType = "cube" | "sphere" | "pyramid" | "ring";

const shapes: Array<{
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  type: ShapeType;
}> = [
  { size: 120, x: "10%", y: "20%", delay: 0, duration: 8, type: "cube" },
  { size: 80, x: "75%", y: "15%", delay: 1, duration: 10, type: "sphere" },
  { size: 100, x: "85%", y: "60%", delay: 2, duration: 9, type: "pyramid" },
  { size: 90, x: "20%", y: "70%", delay: 0.5, duration: 11, type: "ring" },
  // { size: 90, x: "20%", y: "80%", delay: 1.5, duration: 7, type: "cube" },
];

function ShapeRenderer({ type, size }: { type: ShapeType; size: number }) {
  const baseClasses = "absolute";

  switch (type) {
    case "cube":
      return (
        <div
          className={`${baseClasses} rounded-lg border border-primary/20 bg-primary/5 shape-glow`}
          style={{
            width: size,
            height: size,
            transform: "perspective(600px) rotateX(25deg) rotateY(-25deg)",
          }}
        />
      );
    case "sphere":
      return (
        <div
          className={`${baseClasses} rounded-full border border-accent/20 bg-accent/5`}
          style={{
            width: size,
            height: size,
            boxShadow:
              "0 0 50px hsl(var(--glow-accent) / 0.15), inset 0 0 30px hsl(var(--glow-accent) / 0.05)",
          }}
        />
      );
    case "pyramid":
      return (
        <div
          className={`${baseClasses} border-primary/20`}
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid hsl(var(--glow-primary) / 0.08)`,
            filter: "drop-shadow(0 0 20px hsl(var(--glow-primary) / 0.15))",
          }}
        />
      );
    case "ring":
      return (
        <div
          className={`${baseClasses} rounded-full border-2 border-accent/15`}
          style={{
            width: size,
            height: size,
            boxShadow: "0 0 30px hsl(var(--glow-accent) / 0.1)",
            transform: "perspective(400px) rotateX(60deg)",
          }}
        />
      );
  }
}

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        >
          <ShapeRenderer type={shape.type} size={shape.size} />
        </motion.div>
      ))}

      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />
    </div>
  );
}

