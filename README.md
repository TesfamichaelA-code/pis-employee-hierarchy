# Employee Position Hierarchy

A modern single-page application for managing an organization's employee position hierarchy. Built with **Next.js 16**, **React 19**, **Mantine UI**, **TailwindCSS**, and **Redux Toolkit (RTK Query)**.

The app connects to a NestJS REST API backend and provides a full CRUD interface with an interactive, expandable tree visualization of the organizational structure.

```
CEO
├── CTO
│   └── Project Manager
│       └── Product Owner
│           ├── Tech Lead
│           │   ├── Frontend Developer
│           │   ├── Backend Developer
│           │   └── DevOps Engineer
│           ├── QA Engineer
│           └── Scrum Master
├── CFO
│   ├── Chief Accountant
│   │   ├── Financial Analyst
│   │   └── Accounts Payable
│   └── Internal Audit
├── COO
│   ├── Product Manager
│   ├── Operation Manager
│   └── Customer Relations
└── HR
```

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [How It Works](#how-it-works)
- [Pages & Routing](#pages--routing)

---

## Features

- **Interactive Tree Visualization** — Expandable/collapsible recursive tree displaying the full organizational hierarchy with unlimited depth
- **Create Position** — Add new positions with name, description, and optional parent assignment via a searchable dropdown
- **Edit Position** — Update any position's details or reassign it to a different parent in the hierarchy
- **Delete Position** — Remove positions with a confirmation modal; prevents deletion if the position has children (409 Conflict handling)
- **Position Detail View** — View full details of any position including its description and direct reports
- **Form Validation** — All forms use React Hook Form with Yup schema validation (required fields, minimum length)
- **Success/Error Notifications** — Mantine toast notifications for all API operations
- **Auto-Refreshing Cache** — RTK Query automatically invalidates and re-fetches the tree after any mutation
- **Responsive Layout** — Professional AppShell layout with header navigation
- **CORS-Free API Calls** — Next.js rewrites proxy all API requests to avoid cross-origin issues

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| [Next.js](https://nextjs.org/) | React framework (App Router, SSR, routing) | 16.1.6 |
| [React](https://react.dev/) | UI library | 19.1.0 |
| [TypeScript](https://www.typescriptlang.org/) | Type safety | 5.7+ |
| [Mantine](https://mantine.dev/) | UI component library (AppShell, Modals, Forms, Notifications) | 7.15+ |
| [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS (spacing, colors, hover effects, responsiveness) | 3.4+ |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management (RTK Query for API caching) | 2.5+ |
| [React Hook Form](https://react-hook-form.com/) | Form state management and validation | 7.54+ |
| [Yup](https://github.com/jquense/yup) | Schema-based form validation | 1.6+ |
| [Axios](https://axios-http.com/) | HTTP client for API calls | 1.7+ |
| [@tabler/icons-react](https://tabler.io/icons) | Icon library | 3.26+ |

---

## Project Structure

```
src/
├── app/                                  # Next.js App Router pages
│   ├── layout.tsx                        # Root layout (providers, MantineProvider, AppShell)
│   ├── AppLayout.tsx                     # Mantine AppShell with header navigation
│   ├── globals.css                       # Global styles (Tailwind directives)
│   ├── page.tsx                          # Home page — tree hierarchy view
│   └── positions/
│       ├── new/
│       │   └── page.tsx                  # Create new position page
│       └── [id]/
│           ├── page.tsx                  # Position detail page
│           └── edit/
│               └── page.tsx              # Edit position page
│
├── features/                             # Feature-based modules
│   └── positions/
│       ├── types.ts                      # TypeScript interfaces & utility functions
│       ├── positionsApiSlice.ts          # RTK Query API slice (all CRUD endpoints)
│       └── components/
│           ├── PositionTree.tsx           # Tree container (loading/error/empty states)
│           ├── PositionTreeNode.tsx       # Recursive expandable/collapsible tree node
│           ├── PositionForm.tsx           # Shared form component (create & edit)
│           └── DeletePositionModal.tsx    # Confirmation modal for deletion
│
├── store/                                # Redux store configuration
│   ├── store.ts                          # Store setup with RTK Query middleware
│   ├── hooks.ts                          # Typed useAppDispatch & useAppSelector hooks
│   └── StoreProvider.tsx                 # Client-side Redux Provider wrapper
│
└── lib/
    └── axios.ts                          # Configured Axios instance (base URL, interceptors)
```

This follows a **feature-based folder structure** where each domain (positions) contains its own types, API logic, and components — keeping concerns separated and the codebase scalable.

---

## Data Model

Each position in the hierarchy follows this model:

| Field | Type | Description |
|---|---|---|
| `id` | `string (UUID)` | Unique identifier |
| `name` | `string` | Position title (e.g., "CEO", "CTO") |
| `description` | `string` | Role description and responsibilities |
| `parentId` | `string \| null` | ID of the parent position (`null` for root) |
| `children` | `Position[]` | Nested array of child positions |

TypeScript interfaces are defined in `src/features/positions/types.ts`:

```typescript
interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  children: Position[];
}

interface CreatePositionDto {
  name: string;
  description: string;
  parentId?: string | null;
}

interface UpdatePositionDto {
  name?: string;
  description?: string;
  parentId?: string | null;
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (UI)                         │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Pages    │  │  Components  │  │  React Hook Form      │ │
│  │  (App     │──│  (Tree,      │──│  + Yup Validation     │ │
│  │  Router)  │  │  Form, Modal)│  │                       │ │
│  └─────┬─────┘  └──────┬───────┘  └───────────┬───────────┘ │
│        │               │                      │             │
│        └───────────┬───┘──────────────────────┘             │
│                    │                                        │
│         ┌──────────▼──────────┐                             │
│         │   Redux Toolkit     │                             │
│         │   (RTK Query)       │                             │
│         │   - Cache mgmt      │                             │
│         │   - Tag invalidation│                             │
│         └──────────┬──────────┘                             │
│                    │                                        │
│         ┌──────────▼──────────┐                             │
│         │   Axios Instance    │                             │
│         │   baseURL: /api     │                             │
│         └──────────┬──────────┘                             │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │  Next.js Rewrites   │
          │  /api/* → :3000/*   │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  NestJS Backend     │
          │  localhost:3000     │
          │  (REST API)         │
          └─────────────────────┘
```

### Key Architectural Decisions

1. **RTK Query for server state** — Instead of manual `createAsyncThunk` + `createSlice`, RTK Query handles fetching, caching, loading states, and cache invalidation automatically. Mutations invalidate the `'Tree'` tag, causing the tree to re-fetch.

2. **Next.js Rewrites as API proxy** — All Axios calls go to `/api/*` (same origin), which Next.js rewrites to `http://localhost:3000/*`. This eliminates CORS issues without touching the backend.

3. **Shared form component** — `PositionForm` is used by both create and edit pages, accepting `initialData` for pre-filling during edits.

4. **Recursive tree rendering** — `PositionTreeNode` renders itself recursively for each child, supporting unlimited nesting depth with expand/collapse via Mantine's `Collapse` component.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+
- **NestJS backend** running at `http://localhost:3000` with the positions REST API

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pis-employee-hierarchy

# Install dependencies
npm install
```

### Running the App

```bash
# 1. Start the NestJS backend first (in a separate terminal)
#    (make sure it's running on http://localhost:3000)

# 2. Start the frontend development server
npm run dev
```

The app will be available at **http://localhost:3001** (or the port Next.js assigns).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## API Integration

The frontend communicates with the NestJS backend through these endpoints (proxied via Next.js rewrites):

| Action | Method | Endpoint | Description |
|---|---|---|---|
| Get hierarchy tree | `GET` | `/positions/tree` | Returns the full nested position tree |
| Get single position | `GET` | `/positions/:id` | Returns one position with its children |
| Get children | `GET` | `/positions/:id/children` | Returns all descendants of a position |
| Create position | `POST` | `/positions` | Creates a new position `{ name, description, parentId }` |
| Update position | `PATCH` | `/positions/:id` | Partially updates a position |
| Delete position | `DELETE` | `/positions/:id` | Deletes a position (409 if it has children) |

All API calls are defined in `src/features/positions/positionsApiSlice.ts` using RTK Query, which provides:
- **Automatic caching** of GET responses
- **Cache invalidation** on mutations (create/update/delete auto-refresh the tree)
- **Loading & error states** out of the box
- **Typed hooks** (`useGetTreeQuery`, `useCreatePositionMutation`, etc.)

---

## How It Works

### 1. Tree Visualization
The home page calls `GET /positions/tree` via RTK Query's `useGetTreeQuery()` hook. The response is an array of root positions, each with nested `children`. The `PositionTreeNode` component renders each node recursively:
- Nodes with children show a **chevron toggle** to expand/collapse
- Clicking a **position name** navigates to its detail page
- A **child count badge** shows the number of direct reports
- The first two levels are expanded by default

### 2. Creating a Position
The create form uses **React Hook Form** with **Yup** validation:
- `name` — required, min 2 characters
- `description` — required, min 2 characters
- `parentId` — optional searchable dropdown built by flattening the tree into a list with indentation

On submit, `POST /positions` is called. On success, a notification appears and the user is redirected to the home page where the tree automatically refreshes.

### 3. Editing a Position
Same form as create, but pre-filled with existing data from `GET /positions/:id`. The parent dropdown **excludes the position itself and all its descendants** to prevent circular references. On submit, `PATCH /positions/:id` is called.

### 4. Deleting a Position
A confirmation modal appears before deletion. If the backend returns **409 Conflict** (position has children), an error notification explains that children must be reassigned or removed first. On success, the tree refreshes automatically.

### 5. Error Handling
- **API errors** are caught by Axios interceptors and RTK Query, displayed via Mantine notifications
- **Backend down** shows an alert on the tree page with a helpful message
- **Empty state** shows a prompt to create the first position
- **Loading states** show spinners while data is being fetched

---

## Pages & Routing

| Route | Page | Description |
|---|---|---|
| `/` | Home | Interactive position hierarchy tree with "Add Position" button |
| `/positions/new` | Create | Form to create a new position |
| `/positions/:id` | Detail | View position details, edit/delete actions, children list |
| `/positions/:id/edit` | Edit | Form to update an existing position |

---

## License

This project was built as a task for **Perago Information System**.