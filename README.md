# Team Collaboration App

> A project-management and team-collaboration tool — workspaces, projects, sprints, tasks, and notifications for small teams.



## Overview

Team Collaboration App lets a team organise work into workspaces and projects, break
projects into features, sprints, and tasks, assign and comment on tasks, and receive
notifications. It's built as a small set of independent services so that authentication,
core collaboration, and notifications can evolve and deploy separately.

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | ReactJS                             |
| Backend      | Spring Boot (Maven, Java 21)        |
| AI Service   | Python, FastAPI, ChromaDB, LangChain, Groq (Llama 3.1) |
| Database     | MySQL — database-per-service        |
| Vector Store | ChromaDB (embedded, persistent)     |
| API docs     | springdoc-openapi (live Swagger UI)  |
| Mapping      | ModelMapper                         |
| CI/CD        | Jenkins + Docker (Docker Hub)       |

## Architecture

Four independent services, each owning its own data store:

- **Auth Service** — authentication and user identity (MySQL)
- **Workspace Service** — core domain; a modular monolith built as vertical slices in
  FK-dependency order: Workspace → WorkspaceUser → Project → ProjectAccess → Feature →
  Sprint → Task → TaskAssignee → Comment (MySQL)
- **AI Service** — natural language task search using RAG (ChromaDB + Groq LLM). Called
  by workspace-service via REST to index tasks as vector embeddings and answer semantic
  queries with an LLM-generated summary.
- **Notification Service** — notifications (MySQL)



## Repository Structure

```
team-collab-app/
├── client/                # frontend (React + Vite)
├── auth-service/          # authentication (Spring Boot)
├── workspace-service/     # core collaboration domain (Spring Boot, modular monolith)
├── ai-service/            # AI-powered task search (Python, FastAPI + ChromaDB + LangChain)
├── api-gateway/           # API gateway (Spring Cloud Gateway)
├── eureka-server/         # service discovery (Netflix Eureka)
└── notification-service/  # notifications (.NET)
```

## Documentation

- ER Diagram — `docs/team_collab_er.png` 
- Mircoservices Architecture- `docs/team_collab_microservices_architecture.md`



## Development Workflow

- GitFlow: short-lived `feature/<slice>` branches cut from `develop`.
- Every change goes through a reviewed pull request — no direct commits to `main` / `develop`.
- `main` is protected and kept deployable.
- Each service has its own Jenkins pipeline; images are published to Docker Hub.



