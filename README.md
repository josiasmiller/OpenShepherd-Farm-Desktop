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
npm install <package-name>@<verison|latest> --save-exact
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
| `npm run clean`            | Removes build info files, .webpack, and out folders |
| `npm run test`             | Execute all tests                              |


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

##Material UI (MUI)

This project makes use of Material UI's React Component library.  Familiarize yourself with 
the library here:

- Components: https://mui.com/material-ui/getting-started/
- System/Styling: https://mui.com/system/getting-started/

### Material UI Isolation

Because MUI makes extensive use of dynamic CSS, it does not play nicely with the
existing CSS we have setup in the project.  Since it would be a massive undertaking
to revamp the entire project to use MUI in one go, a React Component called IsolatedMUIScope
has been created to separate MUI implementations from existing implementations until
such time as the entire application is updated to use MUI.

Isolate implementations as follows:

```typescript jsx
import IsolatedMuiScope from "./IsolatedMuiScope";

<SomeExistingParentComponent>
  <SomeExistingComponent/>
  <IsolatedMuiScope>
    <SomeNewComponentUsingMUI/>
  </IsolatedMuiScope>
</SomeExistingParentComponent>
```

IsolatedMUIScope wraps children in MUI's ScopedCSSBaseline (see [CSSBaseline](https://mui.com/material-ui/react-css-baseline/)) component along with
the AnimalTrakker MUI theme component so that only specific sections of the application
are interacting with MUI's CSS environment.

### Import Considerations

MUI is a dual package, which means it support commonJS and ECMAScript, because Electron
applications execute their UI in a browser context, ECMAScript is referenced in the renderer
bundling by Webpack.  However, because of some interesting export design choices in MUI,
there are some scenarios in which module file extensions are required.

If you are attempting to import something from the module through its index, you typically do
not need to specify a file extension (or the name of the index file for that matter).

However, if you are importing from a non-index module, you will have to provide an extension.

### Material Icons

MUI provides a package of React Components that represent a full suite of Material Icons.

https://mui.com/material-ui/material-icons/

When electing to use an icon in the application, attempt to find a representative in the 
Material Icon catalog before rolling a custom icon.

Material Icon imports are subject to some of the import issues described above.  For performance
reasons, MUI recommends that they be imported from their individual module files rather
than with a barrel import.

```typescript
//DO
import HomeIcon from '@mui/icons-material/Home.js'

//DON'T
import { Home as HomeIcon } from '@mui/icons-material' 
```

---
## Versioning

### How we approach Versioning

- This project follows semantic versioning. https://semver.org/
- The \<version\> tag in package.json is a placeholder and should remain 0.0.0.
- Electron Forge is configured to rewrite the \<version\> tag in an in memory copy during builds. See forge.config.ts for details.
- App Variant specific versions are stored in `version.<app_variant>` files in the root project directory.
- `version.<app_variant>` files should be checked into source control, committed, and pushed whenever versions change.

### Updating Versions

The scripts folder contains `version` and `version.bat` scripts that for easily updating the
version of either app variant, or both if they share the same version.

```shell
#Providing a single semantic version sets both variants to use that version.
scripts/version 1.2.3-beta.3 

#Providing a single semantic version and specifying a variant sets only that variants to use that version.
scripts/version --farm 1.2.3-beta.3
scripts/verison --registry 1.2.4-beta.1

#Differing versions can be set simultaneously for each variant as follows
scripts/version --farm 1.2.5-rc.1 --registry 1.2.5-rc.2 
```

---

## License

[Apache 2.0](./LICENSE)