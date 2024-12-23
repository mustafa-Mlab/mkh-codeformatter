# mkhCodeFormatter

**mkhCodeFormatter** is a lightweight and universal code formatter designed to format any programming language or file type in Visual Studio Code. With its simple 2-space indentation logic, this formatter ensures your code looks clean and professional.

## Features

- Formats any file type (HTML, CSS, PHP, JavaScript, TypeScript, Vue, React, Blade, etc.).
- Customizable indentation size via settings.
- Handles comments and ensures they are indented correctly.
- Aligns `switch-case`, braces, and other language-specific constructs.
- Quickly format your code using the shortcut `Ctrl+Alt+F`.

## Requirements

- Visual Studio Code v1.96.0 or higher.

## Extension Settings

This extension contributes the following settings:

- **`mkhCodeFormatter.indentationSize`**: Specify the number of spaces for indentation. Default is `2`.

## How to Use

1. Open a file in VS Code.
2. Press `Ctrl+Alt+F` to format the document instantly.
3. Alternatively, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type `Format Code`.
4. Select `mkhCodeFormatter: Format Code` from the command palette.

## Known Issues

- Alignment issues in specific edge cases (e.g., deeply nested constructs).
- Some advanced syntax for custom languages might not be fully supported.

## Release Notes

### 1.0.0

- Initial release with support for universal code formatting.
- Handles common file types like HTML, PHP, CSS, JavaScript, and TypeScript.

---

## For Developers

To contribute or debug the extension:

1. Clone the repository: 
   ```
   git clone https://github.com/mustafa-Mlab/mkh-codeformatter
   ```
2. Install dependencies: 
   ```
   npm install
   ```
3. Run the extension: Press `F5` in VS Code.

---

**Created by Mustafa Kamal Hossain. Enjoy using mkhCodeFormatter!**
