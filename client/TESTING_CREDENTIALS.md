# Team Collab App - Testing Guide

## 🔐 Login Credentials

You can use any of these existing users to test the application:

### Test Users:
1. **Admin User**
   - Email: `yogesh@example.com`
   - Password: `password` (or any 6+ char password)

2. **Developer 1**
   - Email: `rajesh@example.com`
   - Password: `password`

3. **Project Manager**
   - Email: `priya@example.com`
   - Password: `password`

4. **QA Tester**
   - Email: `amit@example.com`
   - Password: `password`

5. **Developer 2**
   - Email: `neha@example.com`
   - Password: `password`

6. **Designer**
   - Email: `vikram@example.com`
   - Password: `password`

7. **DevOps Engineer**
   - Email: `sarah@example.com`
   - Password: `password`

---

## 📝 Registration

You can also **create a new account** by:
1. Going to `/register` page
2. Filling in:
   - First Name
   - Last Name
   - Email (e.g., `newemail@example.com`)
   - Password (minimum 6 characters)
   - Confirm Password
3. Clicking "Create account"
4. Being redirected to login page
5. Logging in with your new credentials

---

## 📊 User Flow Testing

### Flow 1: Login → Home → Workspace
```
1. Login with yogesh@example.com
2. See 4 workspaces on home page
3. Click "CDAC Team Collaboration" workspace
4. See 5 projects in the workspace
```

### Flow 2: Project → Kanban Board
```
1. In workspace, click "Auth System" project
2. See kanban board with TODO, IN_PROGRESS, COMPLETED columns
3. Click "Setup email verification service" task
```

### Flow 3: Task Details & Comments
```
1. View full task details with description
2. See assigned team members (Rajesh & Amit)
3. View 4 existing comments
4. Add a new comment at the bottom
```

### Flow 4: Create New Workspace
```
1. On Home page, click "+ New Workspace" button
2. Enter workspace name (e.g., "Engineering Team")
3. Click "Create Workspace"
4. New workspace appears in the list
```

### Flow 5: Complete User Registration
```
1. Go to /register page
2. Fill all fields:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: mypassword123
   - Confirm: mypassword123
3. Click "Create account"
4. See success message
5. Redirected to login
6. Login with john@example.com
7. See home page with available workspaces
```

---

## 🎯 Test Data Summary

### Workspaces (4)
- CDAC Team Collaboration (5 projects, 8 members)
- Personal Projects (3 projects, 2 members)
- StartUp Workspace (4 projects, 6 members)
- Mobile App Team (2 projects, 5 members)

### Projects (10 total)
- Auth System, Dashboard UI, API Gateway, Admin Panel
- Blog, E-commerce Platform, Analytics Dashboard
- Mobile App, Backend API, Social Network

### Tasks (12 total)
- 5 IN_PROGRESS
- 4 COMPLETED
- 3 TODO
- Various priority levels (CRITICAL, HIGH, MEDIUM, LOW)

### Comments (19 total)
- Discussion threads on tasks
- User mentions and feedback
- Status updates

---

## ✅ What You Can Test

- ✅ User Login with validation
- ✅ User Registration with validation
- ✅ View workspaces
- ✅ Create new workspace
- ✅ Navigate to workspace
- ✅ View projects in workspace
- ✅ View kanban board
- ✅ View task details
- ✅ Add comments on tasks
- ✅ View task assignees
- ✅ See task history and metadata

---

## 🔄 Authentication Flow

1. All auth is in-memory using mock data
2. Login creates a token in localStorage
3. Home page checks for valid token
4. Redirects to login if no token
5. User data persists in session
6. New users can be created on the fly

---

## 📱 Responsive Design

The app is fully responsive:
- ✅ Mobile (< 600px)
- ✅ Tablet (600px - 960px)
- ✅ Desktop (> 960px)

---

Happy Testing! 🚀
