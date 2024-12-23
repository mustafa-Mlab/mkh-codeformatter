# Welcome to mkh-codeformatter Extension Development

## What's in the Folder

- **`package.json`**: The manifest file for your extension.
  - Declares your extension's metadata, commands, and contributions.
- **`src/extension.ts`**: The main file where your extension logic is implemented.
  - Exports the `activate` function, which registers your extension's commands and logic.
- **`src/test/extension.test.ts`**: A sample test file to ensure your extension works as expected.

## Setup

1. Install the recommended extensions:
   - [TSLint Problem Matcher](https://marketplace.visualstudio.com/items?itemName=amodio.tsl-problem-matcher): For better linting integration.
   - [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner): For running and debugging tests.
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): To enforce code quality and standards.

2. Run the following commands to install dependencies:

   ```
   bash
   npm install
   ```

## Get Up and Running

1. Press `F5` in VS Code to launch a new window with your extension loaded.
2. Run your command:
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
   - Type and execute: **`mkh-codeformatter.formatCode`**.
3. Debug your extension:
   - Set breakpoints in `src/extension.ts`.
   - Use the Debug Console to view logs.

## Making Changes

- Update the logic in `src/extension.ts` to refine your code formatter.
- After changes:
  - Relaunch the extension using the debug toolbar or reload (`Ctrl+R` or `Cmd+R`).
  - Test your updates in the new VS Code instance.

## Testing

1. Run the test suite:

   ```
   bash
   npm test
   ```

2. Modify or add tests in `src/test/extension.test.ts` or create new test files.
3. Watch test output in the Testing view or via the Debug Console.

## Advanced Steps

- **Bundle your extension**: Use `esbuild.js` to reduce size and improve startup time.
- **Publish your extension**:
  - Follow [publishing guidelines](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).
  - Use `vsce` to package and publish:

    ```
    bash
    npm install -g vsce
    vsce package
    vsce publish
    ```

- **Automate CI/CD**: Set up Continuous Integration for automated builds and tests.

## Further Resources

- [VS Code Extension API Documentation](https://code.visualstudio.com/api)
- [Bundling Extensions](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)
