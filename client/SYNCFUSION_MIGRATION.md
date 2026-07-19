# Syncfusion Migration + Task Slice — Setup Checklist

Full pivot: **MUI → Syncfusion (whole app)**, then wire the **task slice** to the real backend.
Terse on purpose. Backend `/task` is done; CORS via `@CrossOrigin` on `TaskController`. Old MUI `Task.jsx` retired + route removed.

---

## 0 · Fixed decisions (don't re-litigate)
- [ ] Auth to `/task` = header `X-User-Id: 100` (JWT slots in here later).
- [ ] Task API base = `workspace-service` → `http://localhost:8080`.
- [ ] Client dev = Vite → `http://localhost:5173` (already allowed in CORS).
- [ ] Status FSM: `TODO→IN_PROGRESS`, `IN_PROGRESS→{IN_REVIEW,TODO}`, `IN_REVIEW→{DONE,IN_PROGRESS}`, `DONE→TODO`.
- [ ] Illegal transition = **422** (not 409). Duplicate assign = 409. Not found = 404. Body = `ApiResponse{status,message,timestamp}`.

---

## 1 · Install Syncfusion
- [ ] Install (v27+ supports React 19 — let npm pull latest, keep all EJ2 packages on the **same version**):
  ```bash
  npm i @syncfusion/ej2-base \
        @syncfusion/ej2-react-kanban \
        @syncfusion/ej2-react-popups \
        @syncfusion/ej2-react-dropdowns \
        @syncfusion/ej2-react-inputs \
        @syncfusion/ej2-react-buttons \
        @syncfusion/ej2-react-navigations \
        @syncfusion/ej2-react-layouts \
        @syncfusion/ej2-react-notifications
  ```
- [ ] Register license once at startup (`main.jsx`, before render):
  ```js
  import { registerLicense } from '@syncfusion/ej2-base'
  registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE)
  ```
- [ ] Put the key in `.env` → `VITE_SYNCFUSION_LICENSE=...` (community license is free for your usage tier).
- [ ] Import the theme CSS once (bootstrap5 ≈ your current look; or `material`). One import in `main.jsx`:
  ```js
  import '@syncfusion/ej2-base/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-buttons/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-inputs/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-dropdowns/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-popups/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-navigations/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-kanban/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-layouts/styles/bootstrap5.css'
  import '@syncfusion/ej2-react-notifications/styles/bootstrap5.css'
  ```
  (Or the single bundle: `import '@syncfusion/ej2/bootstrap5.css'`.)
- [ ] Done when: app boots, **no trial banner**.

---

## 2 · Rip out MUI (whole app) — ✅ DONE

> Done for you: all 16 files converted, `@mui/*` + `@emotion/*` removed from `package.json`,
> `theme.js` + old `Task.jsx` deleted. Markup is now plain HTML + CSS using tokens in
> `src/styles/theme.css` (CSS vars + `.btn/.card/.input/.chip/.avatar/.menu` primitives) and a
> reusable `src/components/Modal.jsx`. Real Syncfusion controls (Kanban, task-detail dialog,
> status/assignee dropdowns) are still reserved for the **task slice** below — promote any native
> `.btn`/`.input` to a Syncfusion component there if you want. Run `npm install` before `npm run dev`
> (MUI is out of the lockfile). All files pass a syntax check; eyeball the screens once running.

<details><summary>Original removal checklist (for reference)</summary>

- [ ] Remove deps: `@mui/material @mui/icons-material @emotion/react @emotion/styled`.
- [ ] `main.jsx`: delete `ThemeProvider` + `CssBaseline` + `createAppTheme`. Keep the light/dark `mode` state if you still want theming — drive it by swapping the Syncfusion theme CSS or a root class instead.
- [ ] Keep `theme.js` **color tokens** (`cloveColors`/`darkColors`) — reuse them as plain CSS vars / inline styles; drop the `createTheme` call.
- [ ] Migrate page-by-page (each: remove `@mui` imports, swap components per table below, restyle with CSS/CSS-modules):
  - [ ] `components/Sidebar.jsx`  (nav: Workspaces / My Board / Members / Settings — matches the mockup)
  - [ ] `components/Header.jsx`
  - [ ] `components/QuickActions.jsx`
  - [ ] `components/WorkspaceGrid.jsx`
  - [ ] `components/WorkspaceDetailsPanel.jsx`
  - [ ] `components/ProfileEditModal.jsx`  → Syncfusion `DialogComponent`
  - [ ] `pages/Login.jsx` / `pages/Register.jsx`  → `TextBoxComponent` + `ButtonComponent`
  - [ ] `pages/Workspaces.jsx` / `pages/WorkspaceDetail.jsx`
  - [ ] `pages/ProjectDetail.jsx`  ⚠️ still links `navigate('/task/'+id)` — repoint to the new board/dialog
  - [ ] `pages/Home.jsx` / `pages/CreateWorkspace.jsx` / `pages/Settings.jsx`
- [ ] Replace all `mockData` reads with real API calls (each page currently imports `data/mockData`).
- [ ] Grep gate: `grep -rn "@mui\|@emotion\|mockData" src` returns **nothing**.

### Component mapping (MUI → Syncfusion)
| MUI | Syncfusion |
|---|---|
| `Button` | `ButtonComponent` (ej2-react-buttons) |
| `TextField` | `TextBoxComponent` (ej2-react-inputs) |
| `Select` / `MenuItem` | `DropDownListComponent` (ej2-react-dropdowns) |
| MultiSelect | `MultiSelectComponent` (ej2-react-dropdowns) |
| `Dialog` | `DialogComponent` (ej2-react-popups) |
| `Menu` | `DropDownButtonComponent` (ej2-react-navigations) |
| `Chip` | styled `<span>` badge / `ChipListComponent` (ej2-react-buttons) |
| `Tabs` | `TabComponent` (ej2-react-navigations) |
| `Avatar` | plain `<div>` avatar + Syncfusion `e-avatar` CSS class |
| `Grid`/`Box`/`Stack` | CSS flex/grid |
| toast (`react-toastify`) | `ToastComponent` (ej2-react-notifications) — optional |

</details>

---

## 3 · Task slice — data layer
- [ ] `src/services/taskClient.js` — axios instance, `baseURL = http://localhost:8080`, request interceptor sets `X-User-Id: 100`.
- [ ] `src/services/taskApi.js`:
  `listTasks, getTask, updateTask, changeStatus, listAssignees, assign, unassign, listComments, addComment, editComment, deleteComment`.
  - Endpoints: `GET /task`, `GET /task/{id}`, `PATCH /task/{id}`, `PATCH /task/{id}/status`, `POST|GET|DELETE /task/{id}/assignees`, `POST|GET /task/{id}/comments`, `PATCH|DELETE /task/{id}/comments/{cid}`.
  - `assign`/`unassign` body = `{ userId }`; comment body = `{ content }`; status body = `{ taskStatus }`.
- [ ] Hooks (`useState`+`useEffect`), each returns `{ data, loading, error, refetch }`:
  `useTasks()`, `useTask(id)`, `useAssignees(taskId)`, `useComments(taskId)`.

## 4 · Kanban board (`pages/Board.jsx`)
- [ ] `KanbanComponent` (ej2-react-kanban), `keyField="taskStatus"`, columns:
  ```
  TODO | IN_PROGRESS | IN_REVIEW | DONE
  ```
- [ ] Map `TaskResponseDTO` → card: `title`, `taskType` badge, `taskPriority` badge, colored column dot. (Avatars + comment counts need per-task `GET assignees/comments` — optional enrichment, N+1; fine for demo.)
- [ ] `cardClick` → open task detail dialog.
- [ ] `dragStop`/`cardDoubleClick` → call `changeStatus`; on **422** cancel the drag + show the message (don't crash). Refetch after.
- [ ] Add route: `<Route path="/board" element={<Board />} />` and point Sidebar "My Board" at it.
- [ ] Done when: seeded tasks land in the right column.

## 5 · Task detail dialog (`components/TaskDetailDialog.jsx`)
- [ ] `DialogComponent` with 3 sections:
  - [ ] **Status**: `DropDownListComponent` → `changeStatus`; catch 422 → toast the `message`.
  - [ ] **Assignees**: `MultiSelectComponent`/chips → `assign` on add, `unassign` on remove.
  - [ ] **Comments**: list + add form (`TextBoxComponent`+`ButtonComponent`); edit + delete per row. Author comes from the header, not a field.
- [ ] **Refetch after every mutation** — no hand-synced local state.
- [ ] Done when: status change (+ illegal move rejected), assign/unassign, comment add/edit/delete all reflect after refetch.

---

## 6 · Backend (mostly done — just notes)
- [x] CORS via `@CrossOrigin(origins="http://localhost:5173", allowedHeaders="*")` on `TaskController`.
- [ ] `GET /task` isn't project-scoped (design shows `?project=`). Add a `projectId` filter to `getAllTasks` when you have time.
- [ ] Seed dummy chain if empty (workspace → project → task). You said DB already has dummy data — confirm `GET /task` returns rows in Postman first.

## 7 · Verify (the demo walk)
- [ ] Board renders seeded tasks in correct columns.
- [ ] Open task → change status → try illegal move (see 422 message) → assign/unassign → add/edit/delete comment.
- [ ] `npm run lint` clean; `grep -rn "@mui\|@emotion\|mockData" src` empty.

## Cut-line ladder (drop from top if short on time)
1. Whole-app MUI removal → keep MUI on non-task pages, do task slice Syncfusion-only for now
2. Card enrichment (avatars/counts) → plain cards
3. Comment edit → keep add/delete
4. Drag-to-change-status → keep dialog dropdown

**Protected floor — never cut:** CORS, board renders tasks, detail dialog (status + comments), the e2e walk.
