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
| Frontend     | ReactJS |
| Backend      | Spring Boot (Maven, Java 21)        |
| Database     | MySQL — database-per-service        |
| API docs     | springdoc-openapi (live Swagger UI) |
| Mapping      | ModelMapper                         |
| CI/CD        | Jenkins + Docker (Docker Hub)       |

## Architecture

Three independent services, each with its own MySQL database (database-per-service):

- **Auth Service** — authentication and user identity
- **Workspace Service** — core domain; a modular monolith built as vertical slices in
  FK-dependency order: Workspace → WorkspaceUser → Project → ProjectAccess → Feature →
  Sprint → Task → TaskAssignee → Comment
- **Notification Service** — notifications



## Repository Structure

```
team-collab-app/
├── client/                # frontend
├── auth-service/          # authentication
├── workspace-service/     # core collaboration domain (modular monolith)
└── notification-service/  # notifications
```

## Documentation

- ER Diagram — `docs/team_collab_er.png` 
- Mircoservices Architecture- `docs/team_collab_microservices_architecture.md`



## Development Workflow

- GitFlow: short-lived `feature/<slice>` branches cut from `develop`.
- Every change goes through a reviewed pull request — no direct commits to `main` / `develop`.
- `main` is protected and kept deployable.
- Each service has its own Jenkins pipeline; images are published to Docker Hub.



