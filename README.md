# mkh-codeformatter

**mkh-codeformatter** is a custom VS Code extension for formatting code with 2-space indentation across all languages.

## Features

- Automatically formats code blocks using 2-space indentation.
- Works universally with any language or file type.
- Adjusts indentation based on:
  - Opening/closing tags (`<tag>`, `{`, `[`, etc.).
  - Nested structures in languages like HTML, CSS, JavaScript, and PHP.

### Demo

![image](https://raw.githubusercontent.com/yourusername/mkh-codeformatter/main/images/demo.gif)


## Requirements

No additional requirements. Just install the extension, and you’re ready to go!

## Usage

1. Open a file in VS Code.
2. Run the command: **`mkh-codeformatter.formatCode`** from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3. Your file will be automatically formatted.

## Extension Settings

This extension doesn’t require additional configuration. Future updates might include customizable settings.

## Known Issues

- Complex file structures with mixed syntax might need further refinement.

## Release Notes

### 0.0.1
- Initial release with basic code formatting functionality.

---

## Resources and References

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Visual Studio Code API Documentation](https://code.visualstudio.com/api)

**Enjoy your cleaner code!**
