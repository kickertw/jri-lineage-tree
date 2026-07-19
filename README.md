# JRI Lineage Tree

A web application for visualizing the Jhoon Rhee Institute (JRI) martial arts lineage as an interactive dependency graph. It shows instructor–student relationships across generations of martial artists, allowing users to explore, search, and manage the lineage tree.

## Features

- **Interactive lineage graph** — View instructor-student relationships as a directed graph.
- **Search people** — Quickly find and focus on a specific person in the lineage.
- **Focus mode** — Click a node to highlight the person, their instructors, and their students.
- **Add and edit people** — Add new people or update existing ones, including their instructors.
- **Import and export data** — Load and save lineage data as JSON.
- **Local persistence** — Lineage data is saved in the browser's localStorage between sessions.

## Getting Started

These instructions assume you are using the standard npm package manager.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The application will be available at the local URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

The production files are output to the `dist/` directory.

### Preview the production build

```bash
npm run preview
```

### Lint the code

```bash
npm run lint
```

## Technical Specifications

### Package Manager

- **npm**

### Libraries and Tools

- **React** — UI library
- **TypeScript** — Type-safe JavaScript
- **Vite** — Build tool and development server
- **Cytoscape.js** — Graph theory library for the interactive lineage graph
- **react-cytoscapejs** — React wrapper for Cytoscape.js
- **Oxlint** — JavaScript/TypeScript linter

### Project Structure

- `src/DependencyGraph.tsx` — Main graph component and interaction logic
- `src/graphData.ts` — Data loading, saving, and transformation helpers
- `src/lineage-data.json` — Default JRI lineage data
- `src/PersonFormModal.tsx` — Add/edit person modal
- `src/graphStyles.ts` — Cytoscape graph styling

## Data Format

Lineage data is stored as JSON with a `nodes` array and an `edges` array:

```json
{
  "nodes": [
    { "id": "jrhee", "name": "Jhoon Rhee", "rank": "10th Dan Black Belt", "type": "grandmaster", "notes": "" }
  ],
  "edges": [
    { "source": "jrhee", "target": "rbaez" }
  ]
}
```

Each node has a unique `id`, `name`, `rank`, `type` (e.g., `grandmaster`, `master`, `black`), and optional `notes`. Edges represent an instructor-to-student relationship, where `source` is the instructor and `target` is the student.

You can import your own JSON file through the application, or edit the default data in `src/lineage-data.json`.

## License

This project is licensed under a custom non-commercial license. See [LICENSE](./LICENSE) for details.

Personal, educational, research, and other non-commercial uses are permitted with attribution. Commercial use requires prior written permission.