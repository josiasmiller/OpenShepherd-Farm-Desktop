# AnimalTrakker Farm Desktop (Electron + Vite)

---

## Overview

This is the desktop application for the AnimalTrakker Farm ecosystem, built using [Electron](https://www.electronjs.org/) and [Vite](https://vitejs.dev/) for a fast and modern development experience. It leverages **TypeScript**, **Jest** for testing, and **Electron Forge** for packaging and distribution.

---

## Prerequisites

Ensure the following are installed before you set up the project. For a general overview of setting up an Electron development environment, refer to the [Electron Prerequisites Guide](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites).

### Node.js & NPM
This project requires **Node.js** (LTS recommended) and **npm** (Node Package Manager).

#### Installation:
- Download and install from the [official Node.js website](https://nodejs.org/en/download).
- Verify installation:

```sh
node -v  # Node.js version
npm -v   # npm version
```

---

## Getting Started

### Install Dependencies

From the project root directory, install all required dependencies:

```sh
npm install
```

### Development Workflow

In development mode, you’ll need to run both the Vite dev server **and** the Electron app in parallel:

1. **Run Vite Dev Server** (in one terminal):

```sh
npm run vite
```

2. **Start Electron App** (in a second terminal):

```sh
npm run build_start
```

---

## Building the Project

### Internal Build (Development/Debug)

To build the TypeScript code and copy assets (for debugging or intermediate purposes):

```sh
npm run build
```

### Production Build & Packaging

We use **[Electron Forge](https://www.electronforge.io/)** to build and package the application for distribution.

To create a production-ready package:

```sh
npm run make
```

This will:
- Compile the source (`tsc`)
- Copy static assets
- Create distributables (installers, executables, etc.) using Electron Forge

You can also manually package (without making distributables) using:

```sh
npm run package
```

---

## Running Tests

We use **[Jest](https://jestjs.io/)** for testing.

To run the test suite:

```sh
npm run test
```

Ensure tests are kept up to date as you develop new features.

---

## Project Scripts

Here’s a summary of the key npm scripts:

| Script         | Description                                  |
|----------------|----------------------------------------------|
| `npm start`    | Launches the Electron app with Vite dev server |
| `npm run vite` | Starts the Vite development server            |
| `npm run build`| Compiles TypeScript and copies assets         |
| `npm run build_start`| Runs both `build` and `start`         |
| `npm run test` | Runs Jest test suite                         |
| `npm run package` | Creates a packaged version of the app     |
| `npm run make` | Builds + packages app for production         |

---

## File Structure

We follow [Electron's recommended file structure](https://www.electronjs.org/docs/latest/development/source-code-directory-structure), with custom scripts to handle asset copying and building.

```
├── src/             # Source code (renderer, main process)
├── dist/            # Build output
├── scripts/         # Custom build scripts (e.g., copyAssets.js)
├── public/          # Static assets
├── package.json     # Project metadata and scripts
└── README.md        # This file
```

---

## License

[Apache 2.0](./LICENSE)