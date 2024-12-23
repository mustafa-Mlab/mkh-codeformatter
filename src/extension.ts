import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register the formatCode command
  const disposable = vscode.commands.registerCommand('mkh-codeformatter.formatCode', () => {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found. Open a file to format.');
      return;
      }
    
    const document = editor.document;
    const fullText = document.getText();
    
    if (!fullText || fullText.trim() === '') {
      vscode.window.showWarningMessage('The document is empty or contains only whitespace.');
      return;
      }
    
    try {
      const formattedText = formatText(fullText);
      const entireRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length)
        );
      
      editor.edit(editBuilder => {
        editBuilder.replace(entireRange, formattedText);
        }).then(success => {
        if (success) {
          vscode.window.showInformationMessage('Document formatted successfully!');
          } else {
          vscode.window.showErrorMessage('Failed to apply formatting to the document.');
          }
        });
      } catch (error) {
      console.error('Error during formatting:', error);
      vscode.window.showErrorMessage('An error occurred during formatting. Check the logs for details.');
      }
    });
  
  context.subscriptions.push(disposable);
  }

export function deactivate() {}

export function formatText(text: string): string {
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    const indentationSpaces = vscode.workspace.getConfiguration('mkhCodeFormatter').get<number>('indentationSize', 2);

    let indentLevel = 0; // Define the indent level

    const languageId = vscode.window.activeTextEditor?.document.languageId || 'unknown';
    console.log(`Formatting file with languageId: ${languageId}`);

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        console.log(`Processing line ${index + 1}: "${trimmedLine}" (Indent Level: ${indentLevel})`);

        if (isComment(trimmedLine)) {
            const indentedLine = ' '.repeat(indentLevel * indentationSpaces) + line;
            formattedLines.push(indentedLine);
            return;
        }

        // Pass indentLevel to each handler and update its value
        switch (languageId) {
            case 'html':
            case 'vue':
            case 'blade':
                indentLevel = handleHTMLFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
                break;

            case 'css':
                indentLevel = handleCSSFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
                break;

            case 'php':
                indentLevel = handlePHPFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
                break;

            case 'javascript':
            case 'typescript':
            case 'javascriptreact':
            case 'typescriptreact':
                indentLevel = handleJSFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
                break;

            default:
                indentLevel = handleGeneralFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
        }
    });

    return formattedLines.join('\n');
}

// Updated Helper Functions
function handleHTMLFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
    if (line.startsWith('</')) {
        currentIndent = Math.max(0, currentIndent - 1);
    }
    formattedLines.push(' '.repeat(currentIndent * spaces) + line);
    if (line.endsWith('>') && !line.startsWith('</') && !isSelfClosingHTMLTag(line)) {
        currentIndent++;
    }
    return currentIndent;
}

function handleCSSFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
    if (line.startsWith('}')) {
        currentIndent = Math.max(0, currentIndent - 1);
    }
    formattedLines.push(' '.repeat(currentIndent * spaces) + line);
    if (line.endsWith('{')) {
        currentIndent++;
    }
    return currentIndent;
}

function handlePHPFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(');')) {
        currentIndent = Math.max(0, currentIndent - 1);
    }
    formattedLines.push(' '.repeat(currentIndent * spaces) + line);
    if (line.endsWith('{') || line.endsWith('[') || (line.endsWith('(') && !line.includes(');'))) {
        currentIndent++;
    }
    return currentIndent;
}

// function handleJSFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
//     if (line.startsWith('}') || line.startsWith(']') || line.startsWith(');')) {
//         currentIndent = Math.max(0, currentIndent - 1);
//     }

//     if (line.startsWith('case ') || line.startsWith('default:')) {
//         formattedLines.push(' '.repeat(Math.max(0, (currentIndent - 1)) * spaces) + line);
//         return currentIndent;
//     }

//     formattedLines.push(' '.repeat(currentIndent * spaces) + line);

//     if (line.endsWith('{') || line.endsWith('[') || line.endsWith('(') || line.startsWith('switch (')) {
//         currentIndent++;
//     }
//     return currentIndent;
// }



    /**
     * Format JavaScript code.
     *
     * This function handles the following formatting rules for JavaScript code:
     * - Decrease indentation level when encountering '}', ']', or ');'.
     * - Increase indentation level when encountering '{', '[', '(', or 'switch ('.
     * - Handle case statements in switch blocks.
     * @param {string} line - The line of code to format.
     * @param {string[]} formattedLines - The array of formatted lines.
     * @param {number} spaces - The number of spaces to use for indentation.
     * @param {number} currentIndent - The current indentation level.
     * @returns {number} The updated indentation level.
     */
function handleJSFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(');')) {
        currentIndent = Math.max(0, currentIndent - 1);
    }

    if (line.startsWith('case ') || line.startsWith('default:')) {
        formattedLines.push(' '.repeat(Math.max(0, (currentIndent - 1)) * spaces) + line);
        return currentIndent;
    }

    formattedLines.push(' '.repeat(currentIndent * spaces) + line);

    if (line.endsWith('{') || line.endsWith('[') || line.endsWith('(') || line.startsWith('switch (')) {
        currentIndent++;
    }
    return currentIndent;
}

    /**
     * Format code in a general-purpose way.
     *
     * This function handles the following formatting rules:
     * - Decrease indentation level when encountering '}', ']', or ');'.
     * - Increase indentation level when encountering '{', '[', or '('.
     * @param {string} line - The line of code to format.
     * @param {string[]} formattedLines - The array of formatted lines.
     * @param {number} spaces - The number of spaces to use for indentation.
     * @param {number} currentIndent - The current indentation level.
     * @returns {number} The updated indentation level.
     */
function handleGeneralFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(');')) {
        currentIndent = Math.max(0, currentIndent - 1);
    }
    formattedLines.push(' '.repeat(currentIndent * spaces) + line);
    if (line.endsWith('{') || line.endsWith('[') || line.endsWith('(')) {
        currentIndent++;
    }
    return currentIndent;
}

// Helper Functions
function isSelfClosingHTMLTag(line: string): boolean {
    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    const tagMatch = line.match(/<(\w+)/);
    return tagMatch ? selfClosingTags.includes(tagMatch[1]) : false;
}

function isComment(line: string): boolean {
    return line.startsWith('//') || line.startsWith('/*') || line.startsWith('*');
}
  