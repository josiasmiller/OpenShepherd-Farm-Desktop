
# AnimalTrakker Farm Desktop Electron

---

## Prerequisites

Before setting up the project, ensure you have the following installed. For official guidance on setting up an Electron development environment, refer to the [Electron Prerequisites Tutorial](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites).

### Node.js & NPM
This project requires **Node.js** (LTS recommended) and **NPM** (Node Package Manager).

#### Installation:
- **Download and Install** from [the official Node.js website.](https://nodejs.org/en/download)
- Verify installation by running the following commands in your terminal:

  ```sh
  node -v  # verify Node.js is installed and accessible
  npm -v   # verify NPM is installed and accessible



## How to run

Navigate to the root directory of this project and run: 
```
npm install
```

Once the `node_modules` are installed, build the project using:
```
npm run build
```
The CLI should echo a few lines regarding the copying of assets. This should generate the `dist/` directory and all code required to run the project.


From there, use this command to start the project:
```
npm start
```




### File Structure

 We follow the [standard directory file structure for electron apps.](https://www.electronjs.org/docs/latest/development/source-code-directory-structure)
