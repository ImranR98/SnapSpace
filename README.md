# SnapSpace
Online photo sharing platform.

## Features

- Multi-file upload.
- Optional photo sharing; to the public or specific users.
- Mass photo deletion.
- Responsive UI.

## Screenshots

| Welcome Screen                                             | Image Gallery                                             | Single Image (Mobile)                                        |
| ---------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| <img src="./screenshots/welcome.png" alt="Welcome view" /> | <img src="./screenshots/images.png" alt="Gallery view" /> | <img src="./screenshots/imageMobile.png" alt="Mobile view of a single image" /> |



## Development

### Requirements

- Node.js
- MongoDB

### Directory Structure

- The `models` directory contains a separate `models.ts` npm module used by both the client and server.
- The `server` directory contains all server code. Build artifacts are stored in `server/dist`.
- The `client` directory contains all client code. Build artifacts are stored in `client-dist`.

### Environment Variables
Certain envrionment variables are required to run. During development, these can be specified in a `.env` file.

The `template.env` file shows what veriables are needed and how to format them.

### Installing Dependencies
Run `npm run install` to install dependencies in the `models`, `server`, and `client` directories using one command.

### Running in Development
When developing, the modules can be set to run continuously and automatically recompile when relevant files change.
1. Continuously build the `models` module: `npm run dev-models`.
2. Continously run the `server` module without building: `npm run dev-server`.
3. Continuously run the `client` module without building: `npm run dev-client`.
Note that the client and server always use the latest compiled version of the models and won't run otherwise.

### Building
Each module must be built separately in this order:
1. Build `models` module: `npm run build-models`.
2. Build `server` module: `npm run build-server`.
3. Build `client` module: `npm run build-client`.
To perform all steps in one command, use `npm run build`.

### Running
Once all modules have been built, use `npm start` to launch the server.

### Other
Use `npm all` to install dependencies, build each component, and start the server, using a single command.

