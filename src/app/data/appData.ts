import type { BlogPost } from "@/app/types/blog";
import type { HomeSkill } from "@/app/types/home";
import type { PersonalInfo, SocialLink } from "@/app/types/portfolio";
import todoBanner from "@/assets/todo-app-banner.jpg";
import blogRedisBanner from "@/assets/blog-redis-hero.jpg";
import blogRedisMemory from "@/assets/blog-redis-memory.jpg";
import blogRedisDataTypes from "@/assets/blog-redis-datatypes.jpg";
import blogRedisThumb from "@/assets/blog-redis-thumb.jpg";
import { RichProject } from "./richProjectData";
import todoArchitecture from "@/assets/todo-architecture.jpg";
import todoDbSchema from "@/assets/todo-db-schema.jpg";
import todoAuthFlow from "@/assets/todo-auth-flow.jpg";
import type { HomeContent } from "@/app/types/homeContent";

export const homeContent: HomeContent[] = [
  {
    id: "home",
    personalInfo: {
      name: "Alexander Sterling",
      title: "Full Stack Developer & UI/UX Designer",
      tagline: "Crafting Digital Experiences with Precision",
      bio: "I design and build dark-themed, high-performance web experiences — blending clean engineering with thoughtful UI. I work across the stack with React and TypeScript, turning ideas into polished products that feel fast, accessible, and delightful.",
      email: "alex@sterling.dev",
      // location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", 
      // resumeUrl: "#",
    },
    about: {
      picture: {
        src: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=600&h=700&fit=crop",
        alt: "Working",
      },
      heading: "Building products that feel effortless",
      paragraphs: [
        {
          key: "about_p1",
          text: "I design and build dark-themed, high-performance web experiences — blending clean engineering with thoughtful UI. I work across the stack with React and TypeScript, turning ideas into polished products that feel fast, accessible, and delightful.",
        },
        {
          key: "about_p2",
          text: "I care about the details that users notice: micro-interactions, typography, and performance that stays smooth under real data. My process is simple — prototype quickly, validate early, and ship clean, maintainable code.",
        },
      ],
      location: "San Francisco, CA",
      totalYearsExperience: "5+",
      projectsCompleted: "50+",
      resumeUrl: '#',
      highlights: [
        { title: "Craft", description: "Readable, scalable code with strong defaults" },
        { title: "Clarity", description: "Interfaces that feel obvious in the best way" },
        { title: "Consistency", description: "From design tokens to deployment, end-to-end" },
      ],
    },
    socialLinks: [
      { name: "GitHub", url: "https://github.com", icon: "github" },
      { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { name: "Dribbble", url: "https://dribbble.com", icon: "dribbble" },
      { name: "Email", url: "mailto:alex@sterling.dev", icon: "mail" },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "getting-started-with-redis-complete-developer-guide",
    title: "Getting Started with Redis: A Complete Developer Guide",
    summary: "Learn how Redis works, its core concepts, and how to use it efficiently in modern applications.",
    content: "",
    thumbnail: blogRedisThumb,
    banner: blogRedisBanner,
    date: "2026-03-02",
    readingTime: 5,
    author: { name: "Tech Editorial Team" },
    tags: ["Redis", "Backend", "Caching", "Database"],
    sections: [
      {
        id: "c1",
        contentType: "headingBased",
        type: "intro",
        heading: "Introduction",
        text: "Redis is an open-source, in-memory data structure store widely used as a database, cache, and message broker. Known for its blazing-fast performance, Redis stores data in memory, allowing applications to process millions of operations per second. In this article, we will explore Redis fundamentals, core data structures, use cases, and best practices for production environments.",
      },
      {
        id: "c3",
        contentType: "subHeadingBased",
        type: "section",
        heading: "Core Concepts in Redis",
        text: "Before implementing Redis in your application, it is important to understand its fundamental building blocks:",
        items: [
          {
            subHeading: "1. In-Memory Storage",
            description:
              "Redis stores data in RAM, which enables extremely fast read and write operations compared to disk-based databases.",
            points: [
              "Data is stored as key-value pairs.",
              "Persistence options allow snapshots or append-only logging.",
              "Ideal for caching and real-time analytics.",
            ],
            images: [blogRedisMemory],
            codeSnippet: [],
          },
          {
            subHeading: "2. Redis Data Types",
            description: "Redis supports multiple advanced data structures beyond simple strings.",
            points: ["Strings", "Lists", "Sets", "Sorted Sets", "Hashes", "Streams"],
            images: [blogRedisDataTypes],
            codeSnippet: [{ language: "bash", code: 'SET user:1 "John"\\nGET user:1' }],
          },
          {
            subHeading: "3. Persistence Mechanisms",
            description: "Redis offers two main persistence strategies:",
            points: ["RDB (Redis Database Snapshot)", "AOF (Append Only File)", "Hybrid persistence in production setups"],
            images: [],
            codeSnippet: [],
          },
        ],
      },
      {
        id: "c4",
        contentType: "pointBased",
        type: "section",
        heading: "Redis Use Cases",
        text: "Redis is widely used in modern software systems. Here are the most common use cases:",
        points: [
          "Caching database queries to speed up response times",
          "Storing sessions in web applications",
          "Real-time analytics and counters",
          "Message queues and pub/sub communication",
        ],
      },
      {
        id: "c5",
        contentType: "headingBased",
        type: "section",
        heading: "Installing Redis",
        text: "Redis can be installed on Linux, macOS, or Windows. The easiest way is using Docker. Example:",
        codeSnippet: [{ language: "bash", code: "docker run --name redis -p 6379:6379 -d redis" }],
      },
      {
        id: "c6",
        contentType: "headingBased",
        type: "section",
        heading: "Connecting to Redis",
        text: "You can connect to Redis using redis-cli or any client library in your programming language. Example using redis-cli:",
        codeSnippet: [{ language: "bash", code: "redis-cli\\nPING\\nSET mykey \"hello\"\\nGET mykey" }],
      },
      {
        id: "c7",
        contentType: "questionBased",
        type: "faq",
        heading: "FAQ",
        questions: [
          { question: "Is Redis free to use?", answer: "Yes. Redis is open-source and available under the BSD license." },
          {
            question: "Can Redis persist data?",
            answer: "Yes. Redis supports persistence through RDB snapshots and AOF logging.",
          },
          {
            question: "Does Redis scale?",
            answer:
              "Yes. Redis supports replication, clustering, and partitioning to scale horizontally and handle large workloads.",
          },
        ],
      },
      {
        id: "c9",
        contentType: "conclusionBased",
        type: "conclusion",
        heading: "Conclusion",
        text: "Redis is a powerful, high-performance data store suitable for modern scalable applications. By understanding its data structures, persistence mechanisms, and best practices, developers can leverage Redis for caching, messaging, and real-time data processing efficiently. Whether you're building microservices or scaling enterprise systems, Redis can significantly improve performance and responsiveness.",
      },
    ],
    featured: true,
  },
  {
    id: "future-of-web-dev",
    title: "The Future of Web Development in 2026",
    summary: "Exploring emerging trends that will shape how we build for the web.",
    content:
      "The web development landscape continues to evolve at an unprecedented pace. From WebAssembly reaching mainstream adoption to AI-powered development tools becoming standard in every developer's toolkit, the future is incredibly exciting.\\n\\n## Key Trends\\n\\n### 1. AI-Augmented Development\\nAI isn't replacing developers — it's supercharging them. From code completion to automated testing, AI tools are becoming indispensable.\\n\\n### 2. Edge Computing Goes Mainstream\\nWith edge functions and distributed computing, the line between frontend and backend continues to blur.\\n\\n### 3. WebAssembly Everywhere\\nWasm is enabling new categories of web applications that were previously impossible.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop",
    tags: ["Web Dev", "Trends", "2026"],
    date: "2026-01-15",
    readingTime: 8,
  },
  {
    id: "mastering-threejs",
    title: "Mastering Three.js for Interactive Portfolios",
    summary: "A deep dive into creating stunning 3D experiences with Three.js and React.",
    content:
      "Three.js has revolutionized how we think about web experiences. Combined with React Three Fiber, creating immersive 3D scenes has never been more accessible.\\n\\n## Getting Started\\n\\nThe key to great 3D on the web is understanding the balance between visual impact and performance.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    tags: ["Three.js", "React", "3D", "Tutorial"],
    date: "2026-01-02",
    readingTime: 12,
  },
  {
    id: "rust-for-web",
    title: "Why Rust is the Future of Web Infrastructure",
    summary: "How Rust is transforming backend development with safety and speed.",
    content:
      "Rust's promise of memory safety without garbage collection makes it uniquely suited for high-performance web infrastructure.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=600&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=1200&h=600&fit=crop",
    tags: ["Rust", "Backend", "Performance"],
    date: "2025-12-20",
    readingTime: 10,
  },
];

export const homeSkills: HomeSkill[] = [
  { id: "react-next", name: "React & Next.js", category: "Frontend" },
  { id: "typescript", name: "TypeScript", category: "Languages" },
  { id: "tailwindcss", name: "TailwindCSS", category: "Frontend" },
  { id: "node-apis", name: "Node.js & APIs", category: "Backend" },
  { id: "ui-ux-design", name: "UI/UX Design", category: "Design" },
  { id: "webgl-animation", name: "3D Animation & WebGL", category: "Frontend" },
];

export const githubContributionSection = {
  id: "github",
  title: "GitHub Contributions",
  description: "A visual representation of my coding activity",
  years: ["2026", "2025"],
  defaultYear: "2026",
} as const;

// ── Project Data ──

export const richProjects: RichProject[] = [
  {
    slug: "fullstack-todo-list-app",
    title: "Full Stack To-Do List Application",
    tagline: "A scalable, production-ready task management system with JWT authentication, Redis caching, and role-based access control.",
    shortDescription: "A full-stack To-Do application built with Next.js, NestJS, PostgreSQL, and Redis. Designed with clean architecture, modular code structure, and deployed on modern cloud infrastructure.",
    meta: {
      category: "fullstack",
      projectType: ["web", "api"],
      difficulty: "intermediate",
      status: "completed",
      featured: true,
      estimatedReadTime: "12 min",
      tags: ["Next.js", "NestJS", "PostgreSQL", "Redis", "JWT", "TypeScript", "Tailwind CSS", "REST API", "Authentication", "Full Stack"],
      completedAt: "2026-03-04",
      duration: "3 weeks",
    },
    banner: { url: todoBanner, alt: "Full Stack To-Do Application Banner" },
    thumbnail: { url: todoBanner, alt: "ToDo App Dashboard Preview" },
    content: [
      {
        id: "c1",
        contentType: "headingBased",
        type: "intro",
        heading: "Introduction",
        paragraphs: [
          "This Full Stack To-Do List application is a production-ready project designed to demonstrate modern software engineering practices across the entire development stack. It goes far beyond a simple CRUD app — incorporating secure JWT-based authentication, Redis caching, role-based access control, database indexing, and a scalable cloud deployment pipeline.",
          "The project is built with Next.js 14 on the frontend, leveraging the App Router and React Server Components for optimal performance and SEO. The backend is powered by NestJS, a highly structured and opinionated Node.js framework that enforces modular architecture and clean separation of concerns through its Controller-Service-Repository pattern.",
          "PostgreSQL serves as the primary database, hosted on Supabase for managed cloud infrastructure, while Redis (via Upstash) handles caching and rate limiting. The entire system is containerization-ready and follows twelve-factor app principles, making it straightforward to scale horizontally in production.",
        ],
        images: [
          { url: todoBanner, alt: "Main Dashboard — Task List View", caption: "The authenticated dashboard view showing a user's task list with filters and status indicators." },
        ],
      },
      {
        id: "c2",
        contentType: "pointBased",
        type: "section",
        heading: "Key Highlights",
        paragraphs: [
          "This project was built with a strong focus on real-world production patterns. Every architectural decision — from token storage to database indexing — was made with scalability, security, and maintainability in mind.",
        ],
        points: [
          { label: "JWT Authentication with Refresh Tokens", description: "Access tokens expire in 15 minutes; refresh tokens are stored in HTTP-only cookies for XSS protection and rotated on each use." },
          { label: "RESTful API with Versioning", description: "All endpoints are prefixed with /api/v1 to support future breaking changes without disrupting existing clients." },
          { label: "Normalized Relational Schema", description: "PostgreSQL schema is fully normalized with foreign key constraints, CASCADE deletes, and indexed lookup columns." },
          { label: "Redis Caching Layer", description: "Task lists are cached per user with a 60-second TTL, reducing database load on repeated reads." },
          { label: "Role-Based Access Control", description: "Two roles — User and Admin — are enforced at the route guard level using custom NestJS decorators." },
          { label: "85% Test Coverage", description: "Unit tests cover all service methods; integration tests cover all API endpoints using Jest and Supertest." },
          { label: "CI/CD with GitHub Actions", description: "Automated testing and deployment pipeline triggers on every push to main, deploying frontend to Vercel and backend to DigitalOcean via SSH." },
        ],
      },
      {
        id: "c3",
        contentType: "subHeadingBased",
        type: "section",
        heading: "Tech Stack Breakdown",
        paragraphs: [
          "The technology choices for this project were driven by two goals: developer productivity and production reliability. Every tool in the stack has a clearly defined role and integrates cleanly with the others.",
        ],
        items: [
          {
            subHeading: "Frontend — Next.js 14",
            paragraphs: [
              "Next.js 14 with the App Router was chosen for its powerful hybrid rendering model, which allows pages to be server-rendered, statically generated, or client-rendered on a per-component basis.",
              "Route protection is handled at the edge via Next.js Middleware, which intercepts requests before they reach the page and validates the presence and structure of the JWT cookie.",
            ],
            points: [
              "App Router with nested layouts and loading.tsx skeletons",
              "React Server Components for zero-bundle-size data fetching",
              "Edge Middleware for token validation and route protection",
              "Tailwind CSS with a shared design system",
              "TypeScript throughout for end-to-end type safety",
            ],
            codeSnippets: [
              {
                filename: "middleware.ts",
                language: "typescript",
                description: "Edge middleware that reads the JWT cookie and redirects unauthenticated users away from protected routes.",
                code: `import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('accessToken');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};`,
              },
            ],
          },
          {
            subHeading: "Backend — NestJS",
            paragraphs: [
              "NestJS was selected for its Angular-inspired modular architecture, which enforces a clean separation of concerns from day one.",
              "Authentication is implemented using Passport.js strategies — a Local strategy for login and a JWT strategy for protecting routes.",
            ],
            points: [
              "Modular architecture: each domain is a self-contained NestJS module",
              "Passport.js with Local + JWT strategies",
              "class-validator and class-transformer for DTO validation",
              "Global exception filter for consistent error responses",
              "Redis-backed rate limiting via @nestjs/throttler",
            ],
            images: [
              { url: todoArchitecture, alt: "NestJS Module Architecture Diagram", caption: "Diagram showing how Auth, Tasks, and Common modules interact within the NestJS application." },
            ],
            codeSnippets: [
              {
                filename: "tasks.service.ts",
                language: "typescript",
                description: "Core service method for fetching tasks with Redis caching.",
                code: `@Injectable()
export class TasksService {
  private readonly CACHE_TTL = 60;

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly redis: RedisService,
  ) {}

  async findAll(userId: string): Promise<Task[]> {
    const cacheKey = \`tasks:user:\${userId}\`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as Task[];
    }

    const tasks = await this.taskRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    await this.redis.set(cacheKey, JSON.stringify(tasks), this.CACHE_TTL);
    return tasks;
  }
}`,
              },
            ],
          },
          {
            subHeading: "Database — PostgreSQL",
            paragraphs: [
              "PostgreSQL was chosen for its robustness, ACID compliance, and rich feature set. The schema is minimal but carefully designed — using UUIDs instead of sequential integers to avoid enumeration attacks.",
              "The tasks table includes a composite index on (user_id, created_at DESC) to support the most common query pattern with maximum efficiency.",
            ],
            points: [
              "UUIDs for all primary keys to prevent enumeration",
              "bcrypt with 12 rounds for password hashing",
              "Composite index on (user_id, created_at) for fast task queries",
              "Foreign key with ON DELETE CASCADE for data integrity",
              "Hosted on Supabase for managed backups and connection pooling",
            ],
            images: [
              { url: todoDbSchema, alt: "Entity Relationship Diagram", caption: "ERD showing the one-to-many relationship between users and tasks." },
            ],
          },
          {
            subHeading: "Caching — Redis (Upstash)",
            paragraphs: [
              "Redis is used as a caching layer to avoid hitting PostgreSQL on every task list request. Each user's task list is stored under a namespaced key with a 60-second TTL.",
              "Upstash was chosen over a self-hosted Redis instance because it offers serverless Redis with per-request pricing and zero infrastructure management.",
            ],
            points: [
              "Namespaced cache keys to prevent cross-user data leakage",
              "Write-through invalidation strategy for consistency",
              "Also used for rate limiting via @nestjs/throttler",
              "Serverless Redis via Upstash — no infrastructure overhead",
            ],
          },
        ],
      },
      {
        id: "c4",
        contentType: "subHeadingBased",
        type: "section",
        heading: "Frontend Implementation",
        paragraphs: [
          "The frontend is structured around Next.js route groups — public routes (landing, login, register) are grouped under (public) while authenticated routes (dashboard, settings) are under (protected).",
        ],
        items: [
          {
            subHeading: "Authentication Flow",
            paragraphs: [
              "Authentication follows a cookie-based JWT flow. On successful login, the server sets an HTTP-only, Secure, SameSite=Strict cookie containing the access token.",
              "When the access token expires, the frontend silently requests a new one using the refresh token.",
            ],
            points: [
              "HTTP-only cookies for XSS-safe token storage",
              "Silent token refresh using a refresh token cookie",
              "Middleware-level route protection — no client-side flash",
              "Logout endpoint deletes both cookies server-side",
            ],
            images: [
              { url: todoAuthFlow, alt: "JWT Authentication Flow Diagram", caption: "Sequence diagram showing the full login, token refresh, and logout flow." },
            ],
          },
          {
            subHeading: "Dashboard & State Management",
            paragraphs: [
              "The dashboard is a React Server Component that fetches the user's task list directly on the server using the JWT cookie from the incoming request.",
              "Client-side interactivity is handled via isolated 'use client' components that use optimistic state updates for a fast, responsive UI.",
            ],
            points: [
              "Server Component fetches task list data — zero client-side loading state",
              "Optimistic UI updates for create, complete, and delete actions",
              "useTransition for non-blocking state updates",
              "Error boundaries to gracefully handle API failures",
            ],
          },
        ],
      },
      {
        id: "c5",
        contentType: "subHeadingBased",
        type: "section",
        heading: "Security Considerations",
        paragraphs: [
          "Security was treated as a first-class concern throughout the build. The following measures are implemented at various layers of the stack.",
        ],
        items: [
          {
            subHeading: "Authentication Security",
            paragraphs: [
              "Access tokens are short-lived (15 minutes) to limit the damage window if compromised. Refresh tokens are long-lived (7 days) but stored in HTTP-only cookies.",
              "Refresh token rotation is implemented — each use invalidates it and issues a new one.",
            ],
            points: [
              "Access token TTL: 15 minutes",
              "Refresh token TTL: 7 days, stored in HTTP-only Secure cookie",
              "Refresh token rotation with reuse detection",
              "Passwords hashed with bcrypt, cost factor 12",
            ],
          },
          {
            subHeading: "API Security",
            paragraphs: [
              "Rate limiting is applied globally using @nestjs/throttler backed by Redis, allowing 100 requests per minute per IP.",
              "All responses include security headers added by Helmet middleware. CORS is configured to allow only the specific frontend origin.",
            ],
            points: [
              "Global rate limit: 100 req/min per IP",
              "Auth endpoint rate limit: 10 req/min per IP",
              "Helmet middleware for security headers",
              "CORS configured to frontend origin only",
              "All inputs sanitized via class-validator whitelist mode",
            ],
          },
        ],
      },
      {
        id: "c6",
        contentType: "pointBased",
        type: "section",
        heading: "Deployment Strategy",
        paragraphs: [
          "The application is deployed using a modern, cloud-native stack with automated CI/CD. The frontend and backend are deployed independently.",
          "A GitHub Actions workflow runs on every push to main. It runs the full test suite first — if any test fails, the deployment is aborted.",
        ],
        points: [
          { label: "Frontend — Vercel", description: "Zero-config deployments with automatic preview URLs for every pull request." },
          { label: "Backend — DigitalOcean VPS", description: "Node.js process managed by PM2 with cluster mode. Nginx as reverse proxy." },
          { label: "Database — Supabase", description: "Managed PostgreSQL with automatic backups and connection pooling." },
          { label: "Cache — Upstash Redis", description: "Serverless Redis with per-request pricing. No infrastructure to manage." },
          { label: "CI/CD — GitHub Actions", description: "Pipeline runs lint, unit tests, and integration tests before deploying." },
        ],
      },
      {
        id: "c7",
        contentType: "questionBased",
        type: "faq",
        heading: "Frequently Asked Questions",
        paragraphs: [
          "Common questions about the architecture, security, and scalability of this project.",
        ],
        questions: [
          { question: "Why use HTTP-only cookies instead of localStorage for the JWT?", answer: "localStorage is accessible to any JavaScript running on the page, making it vulnerable to XSS attacks. HTTP-only cookies cannot be read by JavaScript at all — only the browser can attach them to requests." },
          { question: "How does the Redis caching work without serving stale data?", answer: "Every write operation (create, update, delete) immediately invalidates the cache for that user. The next read triggers a cache miss, fetches fresh data from PostgreSQL, and repopulates the cache." },
          { question: "Why NestJS instead of Express?", answer: "NestJS enforces structure — modules, dependency injection, and decorator-based routing. This makes the codebase scalable and testable from day one." },
          { question: "How would you scale this to 100K users?", answer: "Move to a managed Kubernetes cluster, add read replicas for PostgreSQL, increase Redis TTLs, and implement WebSocket-based push updates instead of polling." },
        ],
      },
      {
        id: "c8",
        contentType: "headingBased",
        type: "conclusion",
        heading: "Conclusion & Future Work",
        paragraphs: [
          "This project demonstrates that even a 'simple' To-Do app can be a vehicle for showcasing advanced engineering practices when built with intention.",
          "The codebase is structured to be maintainable and extensible. Adding a new feature requires creating a new NestJS module and a new Next.js route — existing code stays untouched.",
          "Future work includes adding WebSocket support for real-time task updates, a task category system with labels and filters, email reminders for due dates, and eventually a React Native mobile client.",
        ],
      },
    ],
    apis: {
      baseUrl: "/api/v1",
      authentication: "JWT Bearer Token (HTTP-only cookie)",
      groups: [
        {
          groupName: "Auth",
          basePath: "/auth",
          endpoints: [
            { id: "auth-register", name: "Register", method: "POST", route: "/auth/register", access: "public", description: "Creates a new user account." },
            { id: "auth-login", name: "Login", method: "POST", route: "/auth/login", access: "public", description: "Authenticates an existing user." },
            { id: "auth-refresh", name: "Refresh Token", method: "POST", route: "/auth/refresh", access: "public", description: "Issues a new access token using the refresh token." },
            { id: "auth-logout", name: "Logout", method: "POST", route: "/auth/logout", access: "private", description: "Invalidates the session." },
          ],
        },
        {
          groupName: "Tasks",
          basePath: "/tasks",
          endpoints: [
            { id: "tasks-list", name: "List Tasks", method: "GET", route: "/tasks", access: "private", description: "Returns all tasks for the authenticated user." },
            { id: "tasks-create", name: "Create Task", method: "POST", route: "/tasks", access: "private", description: "Creates a new task." },
            { id: "tasks-update", name: "Update Task", method: "PATCH", route: "/tasks/:id", access: "private", description: "Updates a task's title or status." },
            { id: "tasks-delete", name: "Delete Task", method: "DELETE", route: "/tasks/:id", access: "private", description: "Permanently deletes a task." },
          ],
        },
      ],
    },
    database: {
      type: "PostgreSQL 15",
      tables: [
        {
          name: "users",
          description: "Stores user authentication and role data.",
          columns: [
            { name: "id", type: "uuid", nullable: false, constraints: "PRIMARY KEY, DEFAULT gen_random_uuid()" },
            { name: "email", type: "varchar(255)", nullable: false, constraints: "UNIQUE" },
            { name: "password", type: "varchar(255)", nullable: false, constraints: "bcrypt hash" },
            { name: "role", type: "varchar(50)", nullable: false, constraints: "DEFAULT 'user', CHECK IN ('user','admin')" },
            { name: "created_at", type: "timestamp", nullable: false, constraints: "DEFAULT NOW()" },
            { name: "updated_at", type: "timestamp", nullable: false, constraints: "DEFAULT NOW()" },
          ],
          indexes: [
            { name: "idx_users_email", columns: ["email"], type: "btree", reason: "Speeds up login lookup by email." },
          ],
        },
        {
          name: "tasks",
          description: "Stores task data with ownership via foreign key to users.",
          columns: [
            { name: "id", type: "uuid", nullable: false, constraints: "PRIMARY KEY, DEFAULT gen_random_uuid()" },
            { name: "title", type: "varchar(255)", nullable: false, constraints: "" },
            { name: "completed", type: "boolean", nullable: false, constraints: "DEFAULT FALSE" },
            { name: "user_id", type: "uuid", nullable: false, constraints: "FOREIGN KEY → users(id) ON DELETE CASCADE" },
            { name: "created_at", type: "timestamp", nullable: false, constraints: "DEFAULT NOW()" },
            { name: "updated_at", type: "timestamp", nullable: false, constraints: "DEFAULT NOW()" },
          ],
          indexes: [
            { name: "idx_tasks_user_created", columns: ["user_id", "created_at DESC"], type: "btree", reason: "Covers the primary read query." },
            { name: "idx_tasks_user_pending", columns: ["user_id"], type: "btree (partial)", reason: "Optimizes the 'Active tasks' filter.", condition: "WHERE completed = FALSE" },
          ],
        },
      ],
    },
    futureImprovements: [
      { title: "Real-Time Updates via WebSockets", description: "Use Socket.io to push task updates to all connected clients in real time." },
      { title: "Task Categories and Labels", description: "Add a categories table and many-to-many relationship for organizing tasks." },
      { title: "Email Reminders", description: "Allow users to set due dates and receive email reminders." },
      { title: "OAuth2 Login", description: "Add Google and GitHub OAuth2 login as alternatives." },
      { title: "React Native Mobile App", description: "Build a mobile client sharing the same backend API." },
    ],
    performance: [
      {
        id: "perf-cache-tasks",
        type: "caching",
        name: "Task List Redis Cache",
        description: "Caches user task lists to reduce database load.",
        layer: "application",
        target: { entity: "tasks", scope: "own" },
        configuration: {
          tool: "Redis (Upstash)",
          strategy: "read-aside",
          settings: { ttl: 60, ttlUnit: "seconds", keyPattern: "tasks:user:{userId}" },
        },
        triggers: ["POST /tasks", "PATCH /tasks/:id", "DELETE /tasks/:id"],
        metrics: { expectedImprovement: "Reduces repeated DB reads", complexityImpact: "low" },
        status: "active",
      },
    ],
    testing: [
      {
        id: "test-unit-services",
        type: "unit",
        name: "Service Layer Unit Tests",
        description: "Tests business logic in AuthService and TasksService using mocked dependencies.",
        layer: "service",
        tools: ["Jest", "@nestjs/testing"],
        target: { scope: ["AuthService", "TasksService"], filePattern: "**/*.service.spec.ts" },
        configuration: { environment: "node", mocking: "Jest mocks", databaseReset: "not required" },
        coverage: { targetPercentage: 85, focusAreas: ["business logic", "validation rules", "error handling", "edge cases"] },
        status: "active",
      },
      {
        id: "test-integration-api",
        type: "integration",
        name: "API Integration Tests",
        description: "Bootstraps full NestJS app against a test database and validates HTTP responses and DB state.",
        layer: "application",
        tools: ["Jest", "Supertest", "@nestjs/testing"],
        target: { scope: "All API endpoints", filePattern: "test/**/*.e2e-spec.ts" },
        configuration: { environment: "test-postgresql-db", mocking: "minimal", databaseReset: "before each suite" },
        coverage: { targetPercentage: 85, focusAreas: ["http status codes", "response structure", "authentication flow", "authorization rules", "database persistence"] },
        status: "active",
      },
    ],
    folderStructure: [
      {
        id: "1", name: "frontend", type: "folder", children: [
          {
            id: "1-1", name: "app", type: "folder", children: [
              { id: "1-1-1", name: "layout.tsx", type: "file", description: "Root layout — applies global fonts and metadata" },
              { id: "1-1-2", name: "page.tsx", type: "file", description: "Landing page (SSG)" },
            ],
          },
          {
            id: "1-2", name: "components", type: "folder", children: [
              { id: "1-2-1", name: "TaskList.tsx", type: "file", description: "Client component — task list" },
              { id: "1-2-2", name: "TaskForm.tsx", type: "file", description: "Client component — task form" },
            ],
          },
        ],
      },
      {
        id: "2", name: "backend", type: "folder", children: [
          {
            id: "2-1", name: "src", type: "folder", children: [
              { id: "2-1-1", name: "auth", type: "folder", children: [
                { id: "2-1-1-1", name: "auth.module.ts", type: "file", description: "Auth module — JWT + Passport strategies" },
                { id: "2-1-1-2", name: "auth.service.ts", type: "file", description: "Auth business logic" },
              ]},
              { id: "2-1-2", name: "tasks", type: "folder", children: [
                { id: "2-1-2-1", name: "tasks.module.ts", type: "file", description: "Tasks module" },
                { id: "2-1-2-2", name: "tasks.service.ts", type: "file", description: "Tasks CRUD with caching" },
              ]},
            ],
          },
        ],
      },
    ],
    pages: [
      {
        id: "p1",
        name: "Landing Page",
        route: "/",
        access: "public",
        layout: "MarketingLayout",
        description: "The public-facing marketing page. Statically generated at build time (SSG) for maximum performance and SEO.",
        purpose: "Convert visitors into registered users.",
        sections: [
          { name: "Hero", description: "Full-width headline, sub-tagline, and two CTA buttons." },
          { name: "Features", description: "Three-column grid highlighting key features." },
          { name: "Footer", description: "Links to GitHub repository and author portfolio." },
        ],
        rendering: "SSG",
      },
      {
        id: "p2",
        name: "Dashboard",
        route: "/dashboard",
        access: "private",
        layout: "AppLayout",
        description: "The main authenticated view showing the user's task list with filtering and sorting.",
        purpose: "Core task management interface.",
        sections: [
          { name: "Task List", description: "Filterable, sortable task list with inline editing." },
          { name: "Quick Add", description: "Floating action button for adding tasks." },
        ],
        rendering: "SSR",
      },
    ],
    cicd: {
      tool: "GitHub Actions",
      trigger: "Push to main branch or pull request to main",
      pipeline: [
        { step: 1, name: "Install Dependencies", command: "npm ci" },
        { step: 2, name: "Lint", command: "npm run lint" },
        { step: 3, name: "Unit Tests", command: "npm run test:unit" },
        { step: 4, name: "Integration Tests", command: "npm run test:e2e" },
        { step: 5, name: "Build", command: "npm run build" },
        { step: 6, name: "Deploy Frontend", command: "vercel --prod" },
        { step: 7, name: "Deploy Backend", command: "ssh deploy@server 'cd app && git pull && pm2 restart all'" },
      ],
      blockers: "Steps 6 and 7 only run if all prior steps pass.",
    },
    deployment: [
      { type: "frontend", details: [{ platform: "Vercel", url: "https://todo.example.com" }] },
      { type: "backend", details: [{ platform: "DigitalOcean VPS", url: "https://api.todo.example.com" }] },
      { type: "database", details: [{ platform: "Supabase", region: "us-east-1" }] },
    ],
    environmentVariables: [
      {
        type: "frontend",
        variable: [
          { key: "NEXT_PUBLIC_API_URL", description: "Public backend API base URL", example: "https://api.todo.example.com/api/v1" },
        ],
      },
      {
        type: "backend",
        variable: [
          { key: "DATABASE_URL", description: "PostgreSQL connection string", example: "postgresql://user:pass@host:5432/db" },
          { key: "JWT_SECRET", description: "Secret for signing JWTs", example: "super-secret-key" },
          { key: "REDIS_URL", description: "Upstash Redis connection URL", example: "rediss://default:xxx@host:6379" },
        ],
      },
    ],
  },
];
