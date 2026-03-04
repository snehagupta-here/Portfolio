// import React from 'react'
// import Button from './button';
// const page = () => {
//   return (
//     <div>
//         <Button />
//     </div>
//   )
// }

// export default page

// {
//   "title": "Full Stack To-Do List Application",
//   "slug": "fullstack-todo-list-app",
//   "tagline": "A scalable, production-ready task management system with JWT authentication, Redis caching, and role-based access control.",
//   "shortDescription": "A full-stack To-Do application built with Next.js, NestJS, PostgreSQL, and Redis. Designed with clean architecture, modular code structure, and deployed on modern cloud infrastructure.",
//   "meta": {
//     "category": "fullstack",
//     "projectType": [
//       "web",
//       "api"
//     ],
//     "difficulty": "intermediate",
//     "status": "completed",
//     "estimatedReadTime": "12 min",
//     "tags": [
//       "Next.js",
//       "NestJS",
//       "PostgreSQL",
//       "Redis",
//       "JWT",
//       "TypeScript",
//       "Tailwind CSS",
//       "REST API",
//       "Authentication",
//       "Full Stack"
//     ],
//     "completedAt": "2026-03-04",
//     "duration": "3 weeks"
//   },
//   "thumbnail": {
//     "url": "https://example.com/images/todo-thumbnail.png",
//     "alt": "ToDo App Dashboard Preview"
//   },
//   "content": [
//     {
//       "id": "c1",
//       "contentType": "headingBased",
//       "type": "intro",
//       "heading": "Introduction",
//       "paragraphs": [
//         "This Full Stack To-Do List application is a production-ready project designed to demonstrate modern software engineering practices across the entire development stack. It goes far beyond a simple CRUD app — incorporating secure JWT-based authentication, Redis caching, role-based access control, database indexing, and a scalable cloud deployment pipeline.",
//         "The project is built with Next.js 14 on the frontend, leveraging the App Router and React Server Components for optimal performance and SEO. The backend is powered by NestJS, a highly structured and opinionated Node.js framework that enforces modular architecture and clean separation of concerns through its Controller-Service-Repository pattern.",
//         "PostgreSQL serves as the primary database, hosted on Supabase for managed cloud infrastructure, while Redis (via Upstash) handles caching and rate limiting. The entire system is containerization-ready and follows twelve-factor app principles, making it straightforward to scale horizontally in production."
//       ],
//       "items": [
//         {
//           "subHeading": "Frontend — Next.js 14",
//           "paragraphs": [
//             "Next.js 14 with the App Router was chosen for its powerful hybrid rendering model, which allows pages to be server-rendered, statically generated, or client-rendered on a per-component basis.",
//             "Route protection is handled at the edge via Next.js Middleware, which intercepts requests before they reach the page and validates the presence and structure of the JWT cookie."
//           ],
//           "points": [
//             "App Router with nested layouts and loading.tsx skeletons",
//             "React Server Components for zero-bundle-size data fetching",
//             "Edge Middleware for token validation and route protection",
//             "Tailwind CSS with a shared design system",
//             "TypeScript throughout for end-to-end type safety"
//           ],
//           "images": [],
//           "codeSnippets": [
//             {
//               "filename": "middleware.ts",
//               "language": "typescript",
//               "description": "Edge middleware that reads the JWT cookie and redirects unauthenticated users away from protected routes before any page renders.",
//               "code": "import { NextRequest, NextResponse } from 'next/server';\nimport { jwtVerify } from 'jose';\n\nconst SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);\n\nexport async function middleware(req: NextRequest) {\n  const token = req.cookies.get('accessToken')?.value;\n\n  if (!token) {\n    return NextResponse.redirect(new URL('/login', req.url));\n  }\n\n  try {\n    await jwtVerify(token, SECRET);\n    return NextResponse.next();\n  } catch {\n    const response = NextResponse.redirect(new URL('/login', req.url));\n    response.cookies.delete('accessToken');\n    return response;\n  }\n}\n\nexport const config = {\n  matcher: ['/dashboard/:path*', '/admin/:path*'],\n};"
//             }
//           ]
//         }
//       ],
//       "points": [
//         {
//           "label": "JWT Authentication with Refresh Tokens",
//           "description": "Access tokens expire in 15 minutes; refresh tokens are stored in HTTP-only cookies for XSS protection and rotated on each use."
//         }
//       ],
//       "images": [
//         {
//           "url": "https://example.com/images/todo-dashboard.png",
//           "alt": "Main Dashboard — Task List View",
//           "caption": "The authenticated dashboard view showing a user's task list with filters and status indicators."
//         }
//       ],
//       "questions": [
//         {
//           "question": "Why use HTTP-only cookies instead of localStorage for the JWT?",
//           "answer": "localStorage is accessible to any JavaScript on the page — a successful XSS attack can steal the token. HTTP-only cookies are completely inaccessible to JavaScript, protecting against XSS-based token theft."
//         }
//       ]
//     }
//   ],
//   "database": {
//     "name": "todo_app_db",
//     "engine": "PostgreSQL",
//     "version": "15",
//     "provider": "Supabase",
//     "connectionPooling": {
//       "enabled": true,
//       "type": "PgBouncer",
//       "managedBy": "Supabase"
//     },
//     "settings": {
//       "extensions": [
//         "pgcrypto"
//       ],
//       "timezone": "UTC"
//     },
//     "tables": [
//       {
//         "name": "users",
//         "description": "Stores user authentication and role information.",
//         "primaryKey": [
//           "id"
//         ],
//         "columns": [
//           {
//             "name": "id",
//             "type": "uuid",
//             "nullable": false,
//             "default": "gen_random_uuid()",
//             "description": "Unique identifier for the user."
//           },
//           {
//             "name": "email",
//             "type": "varchar(255)",
//             "nullable": false,
//             "unique": true,
//             "description": "User login email."
//           },
//           {
//             "name": "password",
//             "type": "varchar(255)",
//             "nullable": false,
//             "description": "Bcrypt hashed password."
//           },
//           {
//             "name": "role",
//             "type": "varchar(50)",
//             "nullable": false,
//             "default": "'user'",
//             "check": "role IN ('user','admin')",
//             "description": "Defines user access level."
//           },
//           {
//             "name": "created_at",
//             "type": "timestamp",
//             "nullable": false,
//             "default": "NOW()"
//           },
//           {
//             "name": "updated_at",
//             "type": "timestamp",
//             "nullable": false,
//             "default": "NOW()"
//           }
//         ],
//         "indexes": [
//           {
//             "name": "idx_users_email",
//             "type": "btree",
//             "columns": [
//               "email"
//             ],
//             "unique": true,
//             "purpose": "Speeds up login queries."
//           }
//         ]
//       },
//       {
//         "name": "tasks",
//         "description": "Stores tasks associated with users.",
//         "primaryKey": [
//           "id"
//         ],
//         "columns": [
//           {
//             "name": "id",
//             "type": "uuid",
//             "nullable": false,
//             "default": "gen_random_uuid()"
//           },
//           {
//             "name": "title",
//             "type": "varchar(255)",
//             "nullable": false
//           },
//           {
//             "name": "completed",
//             "type": "boolean",
//             "nullable": false,
//             "default": "FALSE"
//           },
//           {
//             "name": "user_id",
//             "type": "uuid",
//             "nullable": false,
//             "references": {
//               "table": "users",
//               "column": "id",
//               "onDelete": "CASCADE",
//               "onUpdate": "CASCADE"
//             }
//           },
//           {
//             "name": "created_at",
//             "type": "timestamp",
//             "nullable": false,
//             "default": "NOW()"
//           },
//           {
//             "name": "updated_at",
//             "type": "timestamp",
//             "nullable": false,
//             "default": "NOW()"
//           }
//         ],
//         "indexes": [
//           {
//             "name": "idx_tasks_user_created",
//             "type": "btree",
//             "columns": [
//               "user_id",
//               "created_at DESC"
//             ],
//             "purpose": "Optimizes dashboard task listing."
//           },
//           {
//             "name": "idx_tasks_user_pending",
//             "type": "btree",
//             "columns": [
//               "user_id"
//             ],
//             "partialCondition": "completed = FALSE",
//             "purpose": "Optimizes active tasks filter."
//           }
//         ]
//       }
//     ]
//   },
//   "apis": {
//     "baseUrl": "/api/v1",
//     "authentication": {
//       "type": "JWT",
//       "transport": "Bearer Token",
//       "storage": "HTTP-only cookie (accessToken)"
//     },
//     "standardResponseFormat": {
//       "success": {
//         "success": true,
//         "statusCode": "number",
//         "message": "string",
//         "data": "object | array | null",
//         "timestamp": "ISO 8601 string"
//       },
//       "error": {
//         "success": false,
//         "statusCode": "number",
//         "message": "string | string[]",
//         "error": "string",
//         "timestamp": "ISO 8601 string",
//         "path": "string"
//       }
//     },
//     "groups": [
//       {
//         "groupName": "Auth",
//         "basePath": "/auth",
//         "endpoints": [
//           {
//             "id": "auth-register",
//             "method": "POST",
//             "route": "/auth/register",
//             "access": "public",
//             "description": "Creates a new user account.",
//             "requestBody": {
//               "email": {
//                 "type": "string",
//                 "format": "email",
//                 "required": true
//               },
//               "password": {
//                 "type": "string",
//                 "minLength": 8,
//                 "required": true
//               }
//             },
//             "responses": {
//               "201": {
//                 "success": true,
//                 "message": "User registered successfully.",
//                 "data": {
//                   "accessToken": "string",
//                   "user": {
//                     "id": "uuid",
//                     "email": "string",
//                     "role": "string"
//                   }
//                 }
//               },
//               "400": {
//                 "success": false,
//                 "message": "Validation failed.",
//                 "error": "Bad Request"
//               },
//               "409": {
//                 "success": false,
//                 "message": "Email already registered.",
//                 "error": "Conflict"
//               }
//             }
//           },
//           {
//             "id": "auth-login",
//             "method": "POST",
//             "route": "/auth/login",
//             "access": "public",
//             "description": "Authenticates user and returns access token.",
//             "requestBody": {
//               "email": {
//                 "type": "string",
//                 "required": true
//               },
//               "password": {
//                 "type": "string",
//                 "required": true
//               }
//             },
//             "responses": {
//               "200": {
//                 "success": true,
//                 "message": "Login successful.",
//                 "data": {
//                   "accessToken": "string",
//                   "user": {
//                     "id": "uuid",
//                     "email": "string",
//                     "role": "string"
//                   }
//                 }
//               },
//               "401": {
//                 "success": false,
//                 "message": "Invalid credentials.",
//                 "error": "Unauthorized"
//               }
//             }
//           },
//           {
//             "id": "auth-refresh",
//             "method": "POST",
//             "route": "/auth/refresh",
//             "access": "public",
//             "description": "Generates new access token from refresh token.",
//             "responses": {
//               "200": {
//                 "success": true,
//                 "message": "Access token refreshed.",
//                 "data": {
//                   "accessToken": "string"
//                 }
//               },
//               "401": {
//                 "success": false,
//                 "message": "Invalid or expired refresh token.",
//                 "error": "Unauthorized"
//               }
//             }
//           },
//           {
//             "id": "auth-logout",
//             "method": "POST",
//             "route": "/auth/logout",
//             "access": "private",
//             "description": "Logs out user and clears cookies.",
//             "responses": {
//               "200": {
//                 "success": true,
//                 "message": "Logged out successfully.",
//                 "data": null
//               },
//               "401": {
//                 "success": false,
//                 "message": "Unauthorized.",
//                 "error": "Unauthorized"
//               }
//             }
//           }
//         ]
//       },
//       {
//         "groupName": "Tasks",
//         "basePath": "/tasks",
//         "endpoints": [
//           {
//             "id": "tasks-list",
//             "method": "GET",
//             "route": "/tasks",
//             "access": "private",
//             "description": "Returns all tasks for authenticated user.",
//             "queryParams": {
//               "completed": {
//                 "type": "boolean",
//                 "required": false
//               }
//             },
//             "responses": {
//               "200": {
//                 "success": true,
//                 "message": "Tasks fetched successfully.",
//                 "data": [
//                   {
//                     "id": "uuid",
//                     "title": "string",
//                     "completed": "boolean",
//                     "createdAt": "ISO 8601"
//                   }
//                 ]
//               },
//               "401": {
//                 "success": false,
//                 "message": "Unauthorized.",
//                 "error": "Unauthorized"
//               }
//             }
//           },
//           {
//             "id": "tasks-create",
//             "method": "POST",
//             "route": "/tasks",
//             "access": "private",
//             "description": "Creates a new task.",
//             "requestBody": {
//               "title": {
//                 "type": "string",
//                 "minLength": 1,
//                 "maxLength": 255,
//                 "required": true
//               }
//             },
//             "responses": {
//               "201": {
//                 "success": true,
//                 "message": "Task created successfully.",
//                 "data": {
//                   "id": "uuid",
//                   "title": "string",
//                   "completed": false,
//                   "createdAt": "ISO 8601"
//                 }
//               },
//               "400": {
//                 "success": false,
//                 "message": "Validation failed.",
//                 "error": "Bad Request"
//               },
//               "401": {
//                 "success": false,
//                 "message": "Unauthorized.",
//                 "error": "Unauthorized"
//               }
//             }
//           },
//           {
//             "id": "tasks-update",
//             "method": "PATCH",
//             "route": "/tasks/:id",
//             "access": "private",
//             "description": "Updates task details.",
//             "responses": {
//               "200": {
//                 "success": true,
//                 "message": "Task updated successfully.",
//                 "data": null
//               },
//               "403": {
//                 "success": false,
//                 "message": "You do not have permission.",
//                 "error": "Forbidden"
//               },
//               "404": {
//                 "success": false,
//                 "message": "Task not found.",
//                 "error": "Not Found"
//               }
//             }
//           },
//           {
//             "id": "tasks-delete",
//             "method": "DELETE",
//             "route": "/tasks/:id",
//             "access": "private",
//             "description": "Deletes a task.",
//             "responses": {
//               "200": {
//                 "success": true,
//                 "message": "Task deleted successfully.",
//                 "data": null
//               },
//               "403": {
//                 "success": false,
//                 "message": "You do not have permission.",
//                 "error": "Forbidden"
//               },
//               "404": {
//                 "success": false,
//                 "message": "Task not found.",
//                 "error": "Not Found"
//               }
//             }
//           }
//         ]
//       }
//     ]
//   },
//   "performance": [
//     {
//       "id": "perf-cache-tasks",
//       "type": "caching",
//       "name": "Task List Redis Cache",
//       "description": "Caches user task lists to reduce database load.",
//       "layer": "application",
//       "target": {
//         "entity": "tasks",
//         "scope": "own"
//       },
//       "configuration": {
//         "tool": "Redis (Upstash)",
//         "strategy": "read-aside",
//         "settings": {
//           "ttl": 60,
//           "ttlUnit": "seconds",
//           "keyPattern": "tasks:user:{userId}"
//         }
//       },
//       "triggers": [
//         "POST /tasks",
//         "PATCH /tasks/:id",
//         "DELETE /tasks/:id"
//       ],
//       "metrics": {
//         "expectedImprovement": "Reduces repeated DB reads",
//         "complexityImpact": "low"
//       },
//       "status": "active"
//     }
//   ],
//   "testing": [
//     {
//       "id": "test-unit-services",
//       "type": "unit",
//       "name": "Service Layer Unit Tests",
//       "description": "Tests business logic in AuthService and TasksService using mocked dependencies.",
//       "layer": "service",
//       "tools": [
//         "Jest",
//         "@nestjs/testing"
//       ],
//       "target": {
//         "scope": [
//           "AuthService",
//           "TasksService"
//         ],
//         "filePattern": "**/*.service.spec.ts"
//       },
//       "configuration": {
//         "environment": "node",
//         "mocking": "Jest mocks",
//         "databaseReset": "not required"
//       },
//       "coverage": {
//         "targetPercentage": 85,
//         "focusAreas": [
//           "business logic",
//           "validation rules",
//           "error handling",
//           "edge cases"
//         ]
//       },
//       "status": "active"
//     },
//     {
//       "id": "test-integration-api",
//       "type": "integration",
//       "name": "API Integration Tests",
//       "description": "Bootstraps full NestJS app against a test database and validates HTTP responses and DB state.",
//       "layer": "application",
//       "tools": [
//         "Jest",
//         "Supertest",
//         "@nestjs/testing"
//       ],
//       "target": {
//         "scope": "All API endpoints",
//         "filePattern": "test/**/*.e2e-spec.ts"
//       },
//       "configuration": {
//         "environment": "test-postgresql-db",
//         "mocking": "minimal",
//         "databaseReset": "before each suite"
//       },
//       "coverage": {
//         "targetPercentage": 85,
//         "focusAreas": [
//           "http status codes",
//           "response structure",
//           "authentication flow",
//           "authorization rules",
//           "database persistence"
//         ]
//       },
//       "status": "active"
//     }
//   ],
//   "folderStructure": [
//     {
//       "id": "1",
//       "name": "frontend",
//       "type": "folder",
//       "children": [
//         {
//           "id": "1-1",
//           "name": "app",
//           "type": "folder",
//           "children": [
//             {
//               "id": "1-1-1",
//               "name": "layout.tsx",
//               "type": "file",
//               "description": "Root layout — applies global fonts and metadata"
//             },
//             {
//               "id": "1-1-2",
//               "name": "page.tsx",
//               "type": "file",
//               "description": "Landing page (SSG)"
//             }
//           ]
//         },
//         {
//           "id": "1-2",
//           "name": "components",
//           "type": "folder",
//           "children": [
//             {
//               "id": "1-2-1",
//               "name": "TaskList.tsx",
//               "type": "file",
//               "description": "Client component — task list"
//             },
//             {
//               "id": "1-2-2",
//               "name": "TaskForm.tsx",
//               "type": "file",
//               "description": "Client component — task form"
//             }
//           ]
//         }
//       ]
//     }
//   ],
//   "pages": [
//     {
//       "id": "p1",
//       "name": "Landing Page",
//       "route": "/",
//       "access": "public",
//       "layout": "MarketingLayout",
//       "description": "The public-facing marketing page. Statically generated at build time (SSG) for maximum performance and SEO. Introduces the product with a hero section, feature highlights, and call-to-action buttons pointing to /register and /login.",
//       "purpose": "Convert visitors into registered users.",
//       "sections": [
//         {
//           "name": "Hero",
//           "description": "Full-width headline, sub-tagline, and two CTA buttons: 'Get Started Free' → /register, 'Sign In' → /login."
//         },
//         {
//           "name": "Features",
//           "description": "Three-column grid highlighting key features: task management, authentication, and real-time sync."
//         },
//         {
//           "name": "Footer",
//           "description": "Links to GitHub repository and author portfolio."
//         }
//       ],
//       "rendering": "SSG",
//       "screenshot": {
//         "url": "https://example.com/images/landing.png",
//         "alt": "Landing Page Screenshot"
//       }
//     }
//   ],
//   "cicd": {
//     "tool": "GitHub Actions",
//     "trigger": "Push to main branch or pull request to main",
//     "pipeline": [
//       {
//         "step": 1,
//         "name": "Install Dependencies",
//         "command": "npm ci"
//       }
//     ],
//     "blockers": "Steps 6 and 7 only run if all prior steps pass."
//   },
//   "deployment": [
//     {
//       "type": "frontend",
//       "details": [
//         {
//           "http": "https://youdomain.com"
//         }
//       ]
//     }
//   ],
//   "environmentVariables": [
//     {
//       "type": "frontend",
//       "variable": [
//         {
//           "key": "NEXT_PUBLIC_API_URL",
//           "description": "Public backend API base URL",
//           "example": "https://api.todo.example.com/api/v1"
//         }
//       ]
//     }
//   ],
//   "futureImprovements": [
//     {
//       "title": "Real-Time Updates via WebSockets",
//       "description": "Use Socket.io to push task updates to all connected clients in real time."
//     }
//   ],
//   "repository": [
//     {
//       "type": "frontend",
//       "url": "https://github.com/username/todo-frontend",
//       "branch": "main",
//       "visibility": "public"
//     }
//   ],
//   "liveUrl": "https://todo.example.com",
//   "author": {
//     "name": "Tech Editorial Team",
//     "avatar": "",
//     "github": "https://github.com/username",
//     "linkedin": "https://linkedin.com/in/adarshgoyal"
//   },
//   "metadata": {
//     "status": "published",
//     "publishedDate": "2026-03-02T10:00:00.000Z",
//     "lastModified": "2026-03-02T10:00:00.000Z",
//     "featured": true,
//     "trending": false,
//     "readTime": 5,
//     "views": 0,
//     "likes": 0
//   },
//   "seo": {
//     "metaTitle": "Full Stack To-Do List App — Next.js, NestJS, PostgreSQL, Redis",
//     "metaDescription": "A production-ready full-stack To-Do app with JWT authentication, Redis caching, role-based access control, and CI/CD deployment. Built with Next.js and NestJS.",
//     "keywords": [
//       "Full Stack To-Do App",
//       "Next.js NestJS Tutorial",
//       "JWT Authentication",
//       "Redis Caching",
//       "PostgreSQL TypeORM",
//       "Role Based Access Control",
//       "NestJS REST API",
//       "Full Stack TypeScript"
//     ]
//   },
//   "isActive": true,
//   "createdAt": "2026-03-02T10:00:00.000Z",
//   "updatedAt": "2026-03-02T10:00:00.000Z"
// }
