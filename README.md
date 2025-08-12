# AnimalTrakker Desktop (an Electron Application)

---

## Overview

This is the desktop application for the AnimalTrakker ecosystem, written in [Typescript](https://www.typescriptlang.org/) for [Electron](https://www.electronjs.org/), and built using [Electron Forge](https://www.electronforge.io/) and [Webpack](https://webpack.js.org/).

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

Any additional dependencies added through the course of development should be added with exact versions specified.
This can be achieved by adding the `--save-exact` command line argument like so:

```sh
npm install <package-name>@<verison|latest> --save-exect
```
Example:
```sh
npm install some-package@latest --save-exact
npm install some-dev-package@0.4.2 --save-exact --save-dev
```

This ensures that package.json is updated with an exact package version for the dependency, which is the preferred approach for this project.

### Development Workflow

To transpile the TypeScript code, package the app and assets, and run the application:

```sh
npm run start:{app_variant}
```

In this case, `{app_variant}` can be `farm` for the `Farm Desktop` or `registry` for the `Registry Desktop`. The App Variant is case sensitive.

### Production Build & Packaging

We use **[Electron Forge](https://www.electronforge.io/)** to build and package the application for distribution.

To create a production-ready package:

```sh
npm run make:{app_variant} //packages and creates installers for {app_variant}
npm run make //Packages and creates installers for all app variants
```

This will:
- Transpile the Typescript source
- Bundle transpiled code and assets with Webpack
- Create the Electron application folder hierarchy
- Create distributables (installers, executables, etc.) using Electron Forge

You can also manually package (without making distributables) using:

```sh
npm run package:{app_variant} //Packages Electron folder hiearchy for {app_variant}
npm run package //Packages Electron folder hierarchy for all app variants
```

---

## Project Scripts

Here’s a summary of the key npm scripts:

| Script                     | Description                                    |
|----------------------------|------------------------------------------------|
| `npm run start:farm`       | Launches the Electron app as Farm Desktop      |
| `npm run start:registry`   | Launches the Electron app as Registry Desktop  |
| `npm run package:farm`     | Packages the Electron app as Farm Desktop      |
| `npm run package:registry` | Packages the Electron app as Registry Desktop  |
| `npm run package`          | Packages the Electron app for all app variants |
| `npm run make:farm`        | Creates installers for Farm Desktop            |
| `npm run make:registry`    | Creates installers for Registry Desktop        |
| `npm run make`             | Creates installers for all app variants        |

---

## File Structure

```
├── .idea            # Webstorm Configuration
├── .vscode          # VS Code Configuration
├── .webpack/        # Build output
├── out/             # Packaging and Make output
├── src/             # Source code (renderer, main process)
├── packaging/       # Assets associated with application packaging and installers
├── package.json     # Project metadata and scripts
└── README.md        # This file
```

---

## License

[Apache 2.0](./LICENSE)