# Sprint Module

## Objective

Implement logic to manage time-boxed iterations (Sprints), including:

- Setting sprint start and end dates
- Defining sprint goals
- Managing sprint status
  - Planned
  - Active
  - Completed

---

## Sprint Status

A sprint can have one of the following statuses:

- `PLANNED`
- `ACTIVE`
- `COMPLETED`

---

## Functional Requirements

### 1. Create Sprint

Create a new sprint for an existing project.

#### Preconditions

- The project must already exist.
  - Validate using **ProjectReader**.
- The user must have **Admin** access to the workspace.
  - Otherwise return **401 Unauthorized**.

#### Flow

- Create the sprint.
- Save the sprint details in the `Sprint` table.
- Set the initial status to **PLANNED**.

#### Validations

Throw an exception if any required fields are missing, such as:

- Goal
- Project ID
- Start Date
- End Date

---

### 2. View All Sprints

Retrieve all sprints associated with a project.

#### Example Response

| Sprint | Duration | Status |
|---------|----------|--------|
| Sprint 1 | 1 Jan - 15 Jan | Completed |
| Sprint 2 | 16 Jan - 31 Jan | Active |

---

### 3. View Sprint by ID

Retrieve the details of a specific sprint.

This API is called when the user clicks on a sprint.

#### Response

Return details such as:

- Sprint ID
- Goal
- Start Date
- End Date
- Project
- Owner
- Status

---

### 4. Update Sprint Status

Only an **Admin** can update the sprint status.

#### API

`PATCH /sprints/{sprintId}/status`

#### Allowed Status Transitions

- `PLANNED → ACTIVE`
- `ACTIVE → COMPLETED`

---

### 5. Delete Sprint

Delete a sprint.

> **Note:** Sprints are generally immutable once created. Instead of physical deletion, logical deletion or restricting deletion may be considered. This behavior is open for discussion.

---

## Validation Rules

- Project must exist.
- User must be an Admin of the workspace.
- Goal is mandatory.
- Project ID is mandatory.
- Start Date is mandatory.
- End Date is mandatory.

---

## API Summary

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/sprints` | Create a sprint |
| GET | `/projects/{projectId}/sprints` | Get all sprints for a project |
| GET | `/sprints/{sprintId}` | Get sprint details |
| PATCH | `/sprints/{sprintId}/status` | Update sprint status |
| DELETE | `/sprints/{sprintId}` | Delete sprint *(subject to discussion)* |