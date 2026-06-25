// Mock/Dummy Data for Development

export const mockUsers = [
  {
    id: 'usr_001',
    name: 'Yogesh Bhatt',
    email: 'yogesh@example.com',
    username: 'yogesh',
    role: 'ADMIN',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr_002',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    username: 'rajesh',
    role: 'DEVELOPER',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'usr_003',
    name: 'Priya Singh',
    email: 'priya@example.com',
    username: 'priya',
    role: 'PROJECT_MANAGER',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'usr_004',
    name: 'Amit Patel',
    email: 'amit@example.com',
    username: 'amit',
    role: 'TESTER',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'usr_005',
    name: 'Neha Sharma',
    email: 'neha@example.com',
    username: 'neha',
    role: 'DEVELOPER',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'usr_006',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    username: 'vikram',
    role: 'DESIGNER',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'usr_007',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    username: 'sarah',
    role: 'DEVOPS',
    createdAt: '2026-03-05T10:00:00Z',
  },
]

export const mockWorkspaces = [
  {
    id: 'ws_001',
    name: 'CDAC Team Collaboration',
    createdBy: 'usr_001',
    createdAt: '2026-03-01T10:00:00Z',
    accent: '#FF6B6B',
    role: 'OWNER',
    avatars: ['Y', 'R', 'P', 'A'],
    projects: 5,
    members: 8,
  },
  {
    id: 'ws_002',
    name: 'Personal Projects',
    createdBy: 'usr_001',
    createdAt: '2026-03-15T10:00:00Z',
    accent: '#4ECDC4',
    role: 'OWNER',
    avatars: ['Y'],
    projects: 3,
    members: 2,
  },
  {
    id: 'ws_003',
    name: 'StartUp Workspace',
    createdBy: 'usr_002',
    createdAt: '2026-04-01T10:00:00Z',
    accent: '#45B7D1',
    role: 'MEMBER',
    avatars: ['R', 'N', 'V'],
    projects: 4,
    members: 6,
  },
  {
    id: 'ws_004',
    name: 'Mobile App Team',
    createdBy: 'usr_005',
    createdAt: '2026-04-15T10:00:00Z',
    accent: '#96CEB4',
    role: 'MEMBER',
    avatars: ['N', 'V', 'S'],
    projects: 2,
    members: 5,
  },
]

export const mockWorkspaceMembers = [
  {
    id: 'wsm_001',
    userId: 'usr_001',
    workspaceId: 'ws_001',
    role: 'OWNER',
    joinedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'wsm_002',
    userId: 'usr_002',
    workspaceId: 'ws_001',
    role: 'MEMBER',
    joinedAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'wsm_003',
    userId: 'usr_003',
    workspaceId: 'ws_001',
    role: 'MEMBER',
    joinedAt: '2026-03-08T10:00:00Z',
  },
  {
    id: 'wsm_004',
    userId: 'usr_004',
    workspaceId: 'ws_001',
    role: 'MEMBER',
    joinedAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'wsm_005',
    userId: 'usr_001',
    workspaceId: 'ws_002',
    role: 'OWNER',
    joinedAt: '2026-03-15T10:00:00Z',
  },
]

export const mockProjects = [
  {
    id: 'proj_001',
    name: 'Auth System',
    workspaceId: 'ws_001',
    createdBy: 'usr_001',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'proj_002',
    name: 'Dashboard UI',
    workspaceId: 'ws_001',
    createdBy: 'usr_001',
    createdAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'proj_003',
    name: 'API Gateway',
    workspaceId: 'ws_001',
    createdBy: 'usr_002',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'proj_004',
    name: 'Personal Blog',
    workspaceId: 'ws_002',
    createdBy: 'usr_001',
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'proj_005',
    name: 'E-commerce Platform',
    workspaceId: 'ws_002',
    createdBy: 'usr_001',
    createdAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'proj_006',
    name: 'Analytics Dashboard',
    workspaceId: 'ws_003',
    createdBy: 'usr_002',
    createdAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'proj_007',
    name: 'Mobile App',
    workspaceId: 'ws_003',
    createdBy: 'usr_002',
    createdAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'proj_008',
    name: 'Backend API',
    workspaceId: 'ws_004',
    createdBy: 'usr_005',
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'proj_009',
    name: 'Admin Panel',
    workspaceId: 'ws_001',
    createdBy: 'usr_001',
    createdAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'proj_010',
    name: 'Social Network',
    workspaceId: 'ws_003',
    createdBy: 'usr_002',
    createdAt: '2026-05-20T10:00:00Z',
  },
]

export const mockFeatures = [
  // Auth System (proj_001)
  {
    id: 'feat_001',
    name: 'User Registration',
    description: 'Implement user registration with email verification',
    projectId: 'proj_001',
    createdBy: 'usr_001',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'feat_002',
    name: 'User Login',
    description: 'Implement user login with JWT tokens',
    projectId: 'proj_001',
    createdBy: 'usr_001',
    status: 'COMPLETED',
    createdAt: '2026-04-02T10:00:00Z',
  },
  {
    id: 'feat_003',
    name: 'Password Reset',
    description: 'Implement password reset functionality',
    projectId: 'proj_001',
    createdBy: 'usr_001',
    status: 'TODO',
    createdAt: '2026-04-03T10:00:00Z',
  },
  // Dashboard UI (proj_002)
  {
    id: 'feat_004',
    name: 'Dashboard Layout',
    description: 'Create responsive dashboard layout',
    projectId: 'proj_002',
    createdBy: 'usr_001',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'feat_005',
    name: 'Workspace Management',
    description: 'Create, update, delete workspaces',
    projectId: 'proj_002',
    createdBy: 'usr_001',
    status: 'TODO',
    createdAt: '2026-04-06T10:00:00Z',
  },
  {
    id: 'feat_006',
    name: 'Project Analytics',
    description: 'Display project statistics and metrics',
    projectId: 'proj_002',
    createdBy: 'usr_001',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-07T10:00:00Z',
  },
  // API Gateway (proj_003)
  {
    id: 'feat_007',
    name: 'Request Validation',
    description: 'Implement request validation middleware',
    projectId: 'proj_003',
    createdBy: 'usr_002',
    status: 'COMPLETED',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'feat_008',
    name: 'Rate Limiting',
    description: 'Implement API rate limiting',
    projectId: 'proj_003',
    createdBy: 'usr_002',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-11T10:00:00Z',
  },
  // Blog (proj_004)
  {
    id: 'feat_009',
    name: 'Blog Post Creation',
    description: 'Create blog post editor',
    projectId: 'proj_004',
    createdBy: 'usr_001',
    status: 'TODO',
    createdAt: '2026-04-15T10:00:00Z',
  },
  // E-commerce (proj_005)
  {
    id: 'feat_010',
    name: 'Product Catalog',
    description: 'Build product catalog system',
    projectId: 'proj_005',
    createdBy: 'usr_001',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'feat_011',
    name: 'Shopping Cart',
    description: 'Implement shopping cart functionality',
    projectId: 'proj_005',
    createdBy: 'usr_001',
    status: 'TODO',
    createdAt: '2026-04-21T10:00:00Z',
  },
  // Mobile App (proj_007)
  {
    id: 'feat_012',
    name: 'Push Notifications',
    description: 'Implement push notification system',
    projectId: 'proj_007',
    createdBy: 'usr_002',
    status: 'IN_PROGRESS',
    createdAt: '2026-05-05T10:00:00Z',
  },
]

export const mockTasks = [
  {
    id: 'task_001',
    title: 'Setup email verification service',
    description: 'Integrate SendGrid for email verification. This task involves:\n- Setting up SendGrid API credentials\n- Creating email templates\n- Implementing verification logic\n- Testing with multiple email providers',
    projectId: 'proj_001',
    featureId: 'feat_001',
    createdBy: 'usr_001',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-06-15T00:00:00Z',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'task_002',
    title: 'Password hashing implementation',
    description: 'Use bcrypt for password hashing with proper salt rounds. Requirements:\n- Implement bcrypt hashing\n- Store salted hashes securely\n- Test password verification\n- Document security practices',
    projectId: 'proj_001',
    featureId: 'feat_001',
    createdBy: 'usr_002',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2026-06-10T00:00:00Z',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'task_003',
    title: 'Design dashboard wireframes',
    description: 'Create wireframes for main dashboard view. Should include:\n- Main dashboard layout\n- Widgets placement\n- Navigation structure\n- Responsive design considerations',
    projectId: 'proj_002',
    featureId: 'feat_004',
    createdBy: 'usr_003',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '2026-06-20T00:00:00Z',
    createdAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'task_004',
    title: 'Implement responsive grid system',
    description: 'Use CSS Grid for responsive layout that works on all device sizes. Include:\n- Mobile layout (< 600px)\n- Tablet layout (600px - 960px)\n- Desktop layout (> 960px)\n- Animation and transitions',
    projectId: 'proj_002',
    featureId: 'feat_004',
    createdBy: 'usr_001',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-06-25T00:00:00Z',
    createdAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'task_005',
    title: 'API endpoint implementation',
    description: 'Implement REST API endpoints for user management. Create:\n- GET /api/users\n- POST /api/users\n- GET /api/users/:id\n- PUT /api/users/:id\n- DELETE /api/users/:id',
    projectId: 'proj_003',
    featureId: 'feat_007',
    createdBy: 'usr_002',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-06-18T00:00:00Z',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'task_006',
    title: 'Database schema design',
    description: 'Design and create the database schema for the project. Include:\n- User table\n- Workspace table\n- Project table\n- Task/Feature table\n- Comments table\n- Proper indexing and relationships',
    projectId: 'proj_001',
    featureId: 'feat_002',
    createdBy: 'usr_001',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    dueDate: '2026-06-05T00:00:00Z',
    createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: 'task_007',
    title: 'Create login page UI',
    description: 'Design and implement beautiful login page with:\n- Email/password form\n- Remember me option\n- Forgot password link\n- Sign up redirect',
    projectId: 'proj_001',
    featureId: 'feat_002',
    createdBy: 'usr_006',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2026-06-08T00:00:00Z',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'task_008',
    title: 'JWT token generation and validation',
    description: 'Implement JWT token generation and validation:\n- Generate access tokens\n- Implement refresh token mechanism\n- Add token expiration\n- Validate tokens on requests',
    projectId: 'proj_001',
    featureId: 'feat_002',
    createdBy: 'usr_002',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-06-12T00:00:00Z',
    createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: 'task_009',
    title: 'Configure API rate limiting',
    description: 'Implement rate limiting for API:\n- Limit requests per IP\n- Implement sliding window algorithm\n- Return 429 status code\n- Add rate limit headers',
    projectId: 'proj_003',
    featureId: 'feat_008',
    createdBy: 'usr_002',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '2026-06-22T00:00:00Z',
    createdAt: '2026-04-11T10:00:00Z',
  },
  {
    id: 'task_010',
    title: 'Build product catalog backend',
    description: 'Implement product catalog backend:\n- Create product model\n- Implement search functionality\n- Add filtering options\n- Setup database indexing',
    projectId: 'proj_005',
    featureId: 'feat_010',
    createdBy: 'usr_005',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-07-01T00:00:00Z',
    createdAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'task_011',
    title: 'Integrate Firebase Cloud Messaging',
    description: 'Setup FCM for push notifications:\n- Register device tokens\n- Send test notifications\n- Handle notification permissions\n- Implement notification preferences',
    projectId: 'proj_007',
    featureId: 'feat_012',
    createdBy: 'usr_005',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '2026-06-28T00:00:00Z',
    createdAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'task_012',
    title: 'Implement password reset flow',
    description: 'Create complete password reset system:\n- Generate reset tokens\n- Send reset email\n- Validate reset links\n- Update password securely',
    projectId: 'proj_001',
    featureId: 'feat_003',
    createdBy: 'usr_001',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-07-05T00:00:00Z',
    createdAt: '2026-04-03T10:00:00Z',
  },
]

export const mockTaskAssignees = [
  {
    id: 'ta_001',
    taskId: 'task_001',
    userId: 'usr_002',
  },
  {
    id: 'ta_002',
    taskId: 'task_001',
    userId: 'usr_004',
  },
  {
    id: 'ta_003',
    taskId: 'task_002',
    userId: 'usr_002',
  },
  {
    id: 'ta_004',
    taskId: 'task_003',
    userId: 'usr_003',
  },
  {
    id: 'ta_005',
    taskId: 'task_003',
    userId: 'usr_006',
  },
  {
    id: 'ta_006',
    taskId: 'task_004',
    userId: 'usr_001',
  },
  {
    id: 'ta_007',
    taskId: 'task_005',
    userId: 'usr_002',
  },
  {
    id: 'ta_008',
    taskId: 'task_006',
    userId: 'usr_001',
  },
  {
    id: 'ta_009',
    taskId: 'task_007',
    userId: 'usr_006',
  },
  {
    id: 'ta_010',
    taskId: 'task_008',
    userId: 'usr_002',
  },
  {
    id: 'ta_011',
    taskId: 'task_009',
    userId: 'usr_007',
  },
  {
    id: 'ta_012',
    taskId: 'task_010',
    userId: 'usr_005',
  },
  {
    id: 'ta_013',
    taskId: 'task_011',
    userId: 'usr_005',
  },
  {
    id: 'ta_014',
    taskId: 'task_012',
    userId: 'usr_001',
  },
]

export const mockComments = [
  // task_001 comments
  {
    id: 'com_001',
    taskId: 'task_001',
    userId: 'usr_002',
    content: 'Started working on this. Will have it ready by tomorrow.',
    createdAt: '2026-06-07T14:30:00Z',
  },
  {
    id: 'com_002',
    taskId: 'task_001',
    userId: 'usr_001',
    content: 'Great! Let me know if you need any help.',
    createdAt: '2026-06-07T15:00:00Z',
  },
  {
    id: 'com_003',
    taskId: 'task_001',
    userId: 'usr_004',
    content: 'I have some concerns about the email delivery rate. Should we use multiple providers?',
    createdAt: '2026-06-07T15:45:00Z',
  },
  {
    id: 'com_004',
    taskId: 'task_001',
    userId: 'usr_002',
    content: 'Good point! I\'ll investigate backup providers like Mailgun and AWS SES.',
    createdAt: '2026-06-07T16:15:00Z',
  },
  // task_002 comments
  {
    id: 'com_005',
    taskId: 'task_002',
    userId: 'usr_004',
    content: 'Testing the password hashing implementation. All tests pass! ✓',
    createdAt: '2026-06-07T16:00:00Z',
  },
  {
    id: 'com_006',
    taskId: 'task_002',
    userId: 'usr_001',
    content: 'Excellent work! The implementation follows best practices. Merging to main branch.',
    createdAt: '2026-06-07T16:30:00Z',
  },
  // task_003 comments
  {
    id: 'com_007',
    taskId: 'task_003',
    userId: 'usr_003',
    content: 'Draft wireframes are ready. Sharing the link in slack.',
    createdAt: '2026-06-07T17:00:00Z',
  },
  {
    id: 'com_008',
    taskId: 'task_003',
    userId: 'usr_006',
    content: 'The layouts look amazing! I have some minor suggestions for the mobile view.',
    createdAt: '2026-06-07T17:30:00Z',
  },
  {
    id: 'com_009',
    taskId: 'task_003',
    userId: 'usr_001',
    content: 'Looks good! Please add dark mode variations as well.',
    createdAt: '2026-06-07T18:00:00Z',
  },
  // task_004 comments
  {
    id: 'com_010',
    taskId: 'task_004',
    userId: 'usr_001',
    content: 'Starting implementation. Will use CSS Grid with media queries.',
    createdAt: '2026-06-08T09:00:00Z',
  },
  // task_005 comments
  {
    id: 'com_011',
    taskId: 'task_005',
    userId: 'usr_002',
    content: 'Setting up the API routes. Will have the skeleton ready by EOD.',
    createdAt: '2026-06-08T10:00:00Z',
  },
  // task_006 comments
  {
    id: 'com_012',
    taskId: 'task_006',
    userId: 'usr_001',
    content: 'Schema design completed and reviewed. Ready for implementation.',
    createdAt: '2026-06-05T16:00:00Z',
  },
  // task_007 comments
  {
    id: 'com_013',
    taskId: 'task_007',
    userId: 'usr_006',
    content: 'Login UI is ready and looks beautiful. Using modern Material Design principles.',
    createdAt: '2026-06-06T11:00:00Z',
  },
  {
    id: 'com_014',
    taskId: 'task_007',
    userId: 'usr_001',
    content: 'Perfect! This looks great on all devices. Ready to integrate with backend.',
    createdAt: '2026-06-06T14:00:00Z',
  },
  // task_008 comments
  {
    id: 'com_015',
    taskId: 'task_008',
    userId: 'usr_002',
    content: 'JWT implementation in progress. Using HS256 algorithm with 24hr expiry.',
    createdAt: '2026-06-07T10:30:00Z',
  },
  {
    id: 'com_016',
    taskId: 'task_008',
    userId: 'usr_001',
    content: 'Make sure to implement refresh token logic as well.',
    createdAt: '2026-06-07T11:00:00Z',
  },
  // task_009 comments
  {
    id: 'com_017',
    taskId: 'task_009',
    userId: 'usr_007',
    content: 'Working on rate limiting middleware. Will use Redis for distributed caching.',
    createdAt: '2026-06-08T08:00:00Z',
  },
  // task_010 comments
  {
    id: 'com_018',
    taskId: 'task_010',
    userId: 'usr_005',
    content: 'Planning product catalog structure. Looking at database optimization strategies.',
    createdAt: '2026-06-08T09:30:00Z',
  },
  // task_011 comments
  {
    id: 'com_019',
    taskId: 'task_011',
    userId: 'usr_005',
    content: 'FCM integration started. Setting up device token management.',
    createdAt: '2026-06-08T10:15:00Z',
  },
]

// Helper functions to query data
export const getWorkspaceById = (id) => mockWorkspaces.find((w) => w.id === id)

export const getProjectsByWorkspace = (workspaceId) =>
  mockProjects.filter((p) => p.workspaceId === workspaceId)

export const getProjectById = (id) => mockProjects.find((p) => p.id === id)

export const getFeaturesByProject = (projectId) =>
  mockFeatures.filter((f) => f.projectId === projectId)

export const getTasksByFeature = (featureId) =>
  mockTasks.filter((t) => t.featureId === featureId)

export const getTasksByProject = (projectId) =>
  mockTasks.filter((t) => t.projectId === projectId)

export const getTaskById = (id) => mockTasks.find((t) => t.id === id)

export const getCommentsByTask = (taskId) =>
  mockComments.filter((c) => c.taskId === taskId)

export const getTaskAssignees = (taskId) => {
  const assigneeIds = mockTaskAssignees.filter((ta) => ta.taskId === taskId).map((ta) => ta.userId)
  return mockUsers.filter((u) => assigneeIds.includes(u.id))
}

export const getUserById = (id) => mockUsers.find((u) => u.id === id)
