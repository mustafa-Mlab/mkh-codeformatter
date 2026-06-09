# mkhCodeFormatter (MKH Code Formatter)

**mkhCodeFormatter** is a lightweight, universal, and state-of-the-art code formatter for Visual Studio Code. Instead of installing separate heavy formatters for every language or framework, **mkhCodeFormatter** provides clean, unified indentation rules across all files in your project.

It parses and aligns indentation for HTML, CSS, SCSS, Less, PHP, JavaScript, TypeScript, JSX/TSX (React), Vue, and Laravel Blade templates natively.

---

## 🚀 Key Features

*   **🔌 Native VS Code Formatting Integration:** Fully integrates with VS Code's standard formatting engine. Works with **Format Document** (`Alt+Shift+F` or `Option+Shift+F`) and **Format on Save** (`editor.formatOnSave`).
*   **📐 Stateful Comment Alignment:** Smart block-comment tracking prevents comments from drifting to the right. Fully supports JS/CSS block comments (`/* ... */`), HTML comment blocks (`<!-- ... -->`), JSDoc lines (`*`), and PHP `#` comments.
*   **📦 Nested Multi-Bracket Layouts:** Handles complex nested brackets (such as `[{` or `}]`) and trailing parentheses (`),` or `)`) on a single line, calculating the net indentation change perfectly.
*   ** Laravel Blade Directives:** Indents template blocks according to Blade directive boundaries (e.g., `@if` / `@else` / `@endif`, `@foreach`, `@auth`, etc.).
*   **💅 SCSS & Less Stylesheets:** Groups SCSS and Less rules alongside CSS to ensure nested selector hierarchies format correctly.
*   **⚡ Lightweight & Fast:** Line-by-line streaming algorithm formatting with customizable spacing sizes.

---

## 🛠️ Installation & Settings

This extension contributes the following configurable settings:

*   **`mkhCodeFormatter.indentationSize`**: The number of spaces to use for indentation. (Default: `2` spaces).

### Setting as Default Formatter
To make **mkhCodeFormatter** your default formatter, add the following to your `settings.json`:
```json
"[javascript]": {
  "editor.defaultFormatter": "mustafa-Mlab.mkh-codeformatter"
},
"[html]": {
  "editor.defaultFormatter": "mustafa-Mlab.mkh-codeformatter"
},
"[blade]": {
  "editor.defaultFormatter": "mustafa-Mlab.mkh-codeformatter"
}
```

---

## 📖 How to Use

1.  **Format Document Shortcut:** Press `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (macOS) to format using the standard VS Code command.
2.  **Custom Hotkey:** Press `Ctrl+Alt+F` to format the active document directly via the extension's dedicated command.
3.  **Command Palette:** Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS), type `Format Code`, and select `mkhCodeFormatter: Format Code`.
4.  **Format on Save:** Enable `"editor.formatOnSave": true` in your VS Code settings to format every time you save your file.

---

## 👩‍💻 Developer Contributions

If you want to contribute or debug the extension locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/mustafa-Mlab/mkh-codeformatter.git
    ```
2.  Install development dependencies:
    ```bash
    npm install
    ```
3.  Run compilation & lint checks:
    ```bash
    npm run compile
    ```
4.  Run automated unit tests:
    ```bash
    npm run test
    ```
5.  Run/debug the extension: Open the folder in VS Code and press `F5`.

---

**Created by Mustafa Kamal Hossain. Clean code, simplified.**
