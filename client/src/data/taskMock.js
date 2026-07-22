// ---------------------------------------------------------------------------
// MOCK DATA for the task-slice TEMPLATES (Board, TaskDetail, Comments, Activity).
// Purely presentational so the screens render standalone.
//
// WIRE: replace every import of this file with real calls to your taskApi:
//   listTasks() -> TASKS, getTask(id), listAssignees(id), listComments(id),
//   task activity feed, etc. Field names below mirror TaskResponseDTO /
//   TaskCommentResponseDTO / TaskAssigneeResponseDTO so the swap is 1:1.
// ---------------------------------------------------------------------------

export const MEMBERS = [
  { userId: 100, name: 'Yogesh Bhatt', initials: 'YB', color: '#2563eb', role: 'OWNER', email: 'yogesh@example.com' },
  { userId: 101, name: 'Rohit Kumar', initials: 'RK', color: '#16a34a', role: 'DEVELOPER', email: 'rohit@example.com' },
  { userId: 102, name: 'Ananya Pillai', initials: 'AP', color: '#db2777', role: 'DEVELOPER', email: 'ananya@example.com' },
  { userId: 103, name: 'Vikram Shah', initials: 'VS', color: '#7c3aed', role: 'QA', email: 'vikram@example.com' },
]

export const memberById = (userId) => MEMBERS.find((m) => m.userId === userId)

// Status FSM keys must match the backend enum + Kanban column keyFields.
export const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']

export const STATUS_LABEL = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
}

export const STATUS_DOT = {
  TODO: '#94a3b8',
  IN_PROGRESS: '#2563eb',
  IN_REVIEW: '#f59e0b',
  DONE: '#16a34a',
}

// Legal transitions — mirror TaskStatus.canTransitionTo() on the backend.
export const CAN_TRANSITION = {
  TODO: ['IN_PROGRESS'],
  IN_PROGRESS: ['IN_REVIEW', 'TODO'],
  IN_REVIEW: ['DONE', 'IN_PROGRESS'],
  DONE: ['TODO'],
}

export const PRIORITY_COLOR = {
  LOW: '#16a34a',
  MEDIUM: '#f59e0b',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
}

export const TYPE_COLOR = {
  STORY: '#0ea5e9',
  TASK: '#64748b',
  EPIC: '#7c3aed',
}

export const TASKS = [
  {
    id: 1, projectId: 'proj_001', sprintId: 1, featureId: 1, title: 'Implement password reset flow', status: 'TODO', taskType: 'STORY', taskPriority: 'MEDIUM',
    assignees: [100], commentCount: 0, dueDate: '2026-07-28', createdBy: 100, createdAt: '2026-07-10T09:00:00',
    description: 'Users should be able to request a reset link and set a new password. Cover token expiry and reuse.',
  },
  {
    id: 2, projectId: 'proj_001', sprintId: 1, featureId: 1, title: 'Write auth integration tests', status: 'TODO', taskType: 'TASK', taskPriority: 'LOW',
    assignees: [102], commentCount: 0, dueDate: '2026-07-30', createdBy: 100, createdAt: '2026-07-10T09:10:00',
    description: 'Cover login, register, refresh and logout with happy-path and failure cases.',
  },
  {
    id: 3, projectId: 'proj_001', sprintId: 1, featureId: 2, title: 'Setup email verification service', status: 'IN_PROGRESS', taskType: 'STORY', taskPriority: 'HIGH',
    assignees: [101, 102], commentCount: 4, dueDate: '2026-07-24', createdBy: 100, createdAt: '2026-07-09T14:00:00',
    description: 'Send a verification email on signup; expose a verify endpoint that flips the user flag.',
  },
  {
    id: 4, projectId: 'proj_001', sprintId: null, featureId: 2, title: 'JWT token generation and validation', status: 'IN_PROGRESS', taskType: 'TASK', taskPriority: 'HIGH',
    assignees: [101], commentCount: 2, dueDate: '2026-07-22', createdBy: 100, createdAt: '2026-07-09T15:00:00',
    description: 'Mint access tokens on login; validate locally in each service (no callback to Auth).',
  },
  {
    id: 5, projectId: 'proj_001', sprintId: null, title: 'Create login page UI', status: 'IN_REVIEW', taskType: 'STORY', taskPriority: 'HIGH',
    assignees: [103], commentCount: 2, dueDate: '2026-07-20', createdBy: 100, createdAt: '2026-07-08T11:00:00',
    description: 'Split-panel login screen with validation and error states. Matches the design system.',
  },
  {
    id: 6, projectId: 'proj_002', sprintId: null, title: 'Password hashing implementation', status: 'DONE', taskType: 'TASK', taskPriority: 'HIGH',
    assignees: [101], commentCount: 2, dueDate: '2026-07-15', createdBy: 100, createdAt: '2026-07-05T10:00:00',
    description: 'BCrypt with an appropriate work factor; never store plaintext.',
  },
  {
    id: 7, projectId: 'proj_002', sprintId: null, title: 'Database schema design', status: 'DONE', taskType: 'EPIC', taskPriority: 'CRITICAL',
    assignees: [100], commentCount: 1, dueDate: '2026-07-12', createdBy: 100, createdAt: '2026-07-02T09:00:00',
    description: 'Users, workspaces, projects, tasks, assignees, comments — FK order and indexes.',
  },
]

export const taskById = (id) => TASKS.find((t) => t.id === Number(id))

// The signed-in user (mock). WIRE: from current_user / the JWT subject.
export const CURRENT_USER_ID = 100

// Sprints belong to a project and have a lifecycle: PLANNED -> ACTIVE -> COMPLETED.
// A task with sprint_id = null is in the BACKLOG. WIRE: GET /sprint?projectId=,
// start/complete via a status PATCH, pull a task in via PATCH task.sprintId.
export const SPRINT_STATUS = ['PLANNED', 'ACTIVE', 'COMPLETED']

export const SPRINTS = [
  { id: 1, projectId: 'proj_001', name: 'Sprint 4 — Auth Hardening', status: 'ACTIVE', startDate: '2026-07-14', endDate: '2026-07-28', goal: 'Harden auth: password reset, email verification, JWT.' },
  { id: 2, projectId: 'proj_001', name: 'Sprint 5 — Notifications', status: 'PLANNED', startDate: null, endDate: null, goal: 'In-app + email notifications.' },
  { id: 3, projectId: 'proj_002', name: 'Sprint 1 — Foundations', status: 'PLANNED', startDate: null, endDate: null, goal: '' },
]

// A task can optionally belong to a FEATURE (an epic that groups tasks; Task.feature_id, nullable).
// Features are project-scoped with a lifecycle: PLANNED -> IN_PROGRESS -> DONE. They're ORTHOGONAL
// to sprints — a feature's tasks can span several sprints and the backlog.
// WIRE: GET /feature?projectId= ; status via a PATCH.
export const FEATURE_STATUS = ['PLANNED', 'IN_PROGRESS', 'DONE']

export const FEATURES = [
  { id: 1, projectId: 'proj_001', name: 'Authentication', status: 'IN_PROGRESS' },
  { id: 2, projectId: 'proj_001', name: 'Comments & Activity', status: 'PLANNED' },
  { id: 3, projectId: 'proj_002', name: 'Foundations', status: 'PLANNED' },
]

export const featureById = (id) => FEATURES.find((f) => f.id === id)

// Comments keyed by taskId (TaskCommentResponseDTO shape).
export const COMMENTS = {
  3: [
    { commentId: 11, userId: 101, taskId: 3, content: 'Using a queue for the send so signup stays fast.', createdAt: '2026-07-11T10:05:00', updatedAt: '2026-07-11T10:05:00' },
    { commentId: 12, userId: 102, taskId: 3, content: 'Verify endpoint should be idempotent — clicking twice must not error.', createdAt: '2026-07-11T12:20:00', updatedAt: '2026-07-11T12:20:00' },
    { commentId: 13, userId: 100, taskId: 3, content: 'Agreed. Add a resend-with-cooldown too.', createdAt: '2026-07-12T09:00:00', updatedAt: '2026-07-12T09:00:00' },
    { commentId: 14, userId: 101, taskId: 3, content: 'Cooldown set to 60s. PR up for review.', createdAt: '2026-07-12T16:40:00', updatedAt: '2026-07-12T16:40:00' },
  ],
  5: [
    { commentId: 21, userId: 103, taskId: 5, content: 'Contrast on the muted text is a little low — bumping it.', createdAt: '2026-07-13T09:30:00', updatedAt: '2026-07-13T09:30:00' },
    { commentId: 22, userId: 100, taskId: 5, content: 'Looks good otherwise, approving after that.', createdAt: '2026-07-13T10:00:00', updatedAt: '2026-07-13T10:00:00' },
  ],
}

export const commentsByTask = (taskId) => COMMENTS[Number(taskId)] || []

// Activity feed keyed by taskId (newest-first). Mirrors an activity_log projection.
export const ACTIVITY = {
  3: [
    { id: 31, actorId: 101, action: 'COMMENT_ADDED', detail: 'added a comment', createdAt: '2026-07-12T16:40:00' },
    { id: 32, actorId: 100, action: 'ASSIGNED', detail: 'assigned Ananya Pillai', createdAt: '2026-07-11T09:15:00' },
    { id: 33, actorId: 101, action: 'STATUS_CHANGED', detail: 'TODO → IN_PROGRESS', createdAt: '2026-07-10T14:00:00' },
    { id: 34, actorId: 100, action: 'CREATED', detail: 'created this task', createdAt: '2026-07-09T14:00:00' },
  ],
  5: [
    { id: 41, actorId: 103, action: 'STATUS_CHANGED', detail: 'IN_PROGRESS → IN_REVIEW', createdAt: '2026-07-13T09:00:00' },
    { id: 42, actorId: 100, action: 'ASSIGNED', detail: 'assigned Vikram Shah', createdAt: '2026-07-12T11:00:00' },
    { id: 43, actorId: 100, action: 'CREATED', detail: 'created this task', createdAt: '2026-07-08T11:00:00' },
  ],
}

export const activityByTask = (taskId) => ACTIVITY[Number(taskId)] || [
  { id: 90, actorId: 100, action: 'CREATED', detail: 'created this task', createdAt: '2026-07-10T09:00:00' },
]
