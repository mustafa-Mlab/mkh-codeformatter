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

export function formatText(text: string, languageId?: string, indentationSpaces?: number): string {
  const lines = text.split('\n');
  const formattedLines: string[] = [];
  
  if (indentationSpaces === undefined) {
    indentationSpaces = vscode.workspace.getConfiguration('mkhCodeFormatter').get<number>('indentationSize', 2);
  }
  
  if (languageId === undefined) {
    languageId = vscode.window.activeTextEditor?.document.languageId || 'unknown';
  }
  
  console.log(`Formatting file with languageId: ${languageId}`);
  
  let indentLevel = 0; // Define the indent level
  let inBlockComment = false;
  let blockCommentType: 'css' | 'html' | null = null;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    console.log(`Processing line ${index + 1}: "${trimmedLine}" (Indent Level: ${indentLevel})`);
    
    // Check if we are inside or starting/ending a comment block
    let isThisLineAComment = false;

    if (inBlockComment) {
      isThisLineAComment = true;
      if (blockCommentType === 'html' && trimmedLine.includes('-->')) {
        inBlockComment = false;
      } else if (blockCommentType === 'css' && trimmedLine.includes('*/')) {
        inBlockComment = false;
      }
    } else {
      if (trimmedLine.startsWith('/*') || trimmedLine.startsWith('/**')) {
        isThisLineAComment = true;
        if (!trimmedLine.includes('*/')) {
          inBlockComment = true;
          blockCommentType = 'css';
        }
      } else if (trimmedLine.startsWith('<!--')) {
        isThisLineAComment = true;
        if (!trimmedLine.includes('-->')) {
          inBlockComment = true;
          blockCommentType = 'html';
        }
      } else if (trimmedLine.startsWith('//') || trimmedLine.startsWith('#') || trimmedLine.startsWith('*')) {
        isThisLineAComment = true;
      }
    }
    
    if (isThisLineAComment) {
      let indentSpaceCount = indentLevel * indentationSpaces;
      if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('/*')) {
        indentSpaceCount += 1;
      }
      const indentedLine = ' '.repeat(indentSpaceCount) + trimmedLine;
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
  const totalChange = getHTMLIndentChange(line);
  const leadingCloseCount = getLeadingClosingTagsCount(line);
  
  const printIndent = Math.max(0, currentIndent - leadingCloseCount);
  formattedLines.push(' '.repeat(printIndent * spaces) + line);
  
  currentIndent = Math.max(0, currentIndent + totalChange);
  return currentIndent;
}

function handleCSSFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
  const cleanLine = cleanCodeLine(line, 'css');
  const leadingCloseCount = getLeadingClosingBracketsCount(cleanLine);
  const totalChange = getBracketIndentChange(cleanLine);
  
  const printIndent = Math.max(0, currentIndent - leadingCloseCount);
  formattedLines.push(' '.repeat(printIndent * spaces) + line);
  
  currentIndent = Math.max(0, currentIndent + totalChange);
  return currentIndent;
}

function handlePHPFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
  const cleanLine = cleanCodeLine(line, 'php');
  const leadingCloseCount = getLeadingClosingBracketsCount(cleanLine);
  const totalChange = getBracketIndentChange(cleanLine);
  
  const printIndent = Math.max(0, currentIndent - leadingCloseCount);
  formattedLines.push(' '.repeat(printIndent * spaces) + line);
  
  currentIndent = Math.max(0, currentIndent + totalChange);
  return currentIndent;
}

function handleJSFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
  const cleanLine = cleanCodeLine(line, 'javascript');
  const leadingCloseCount = getLeadingClosingBracketsCount(cleanLine);
  const totalChange = getBracketIndentChange(cleanLine);
  
  if (line.startsWith('case ') || line.startsWith('default:')) {
    formattedLines.push(' '.repeat(Math.max(0, currentIndent - 1) * spaces) + line);
    return currentIndent;
  }
  
  const printIndent = Math.max(0, currentIndent - leadingCloseCount);
  formattedLines.push(' '.repeat(printIndent * spaces) + line);
  
  currentIndent = Math.max(0, currentIndent + totalChange);
  return currentIndent;
}

function handleGeneralFormatting(line: string, formattedLines: string[], spaces: number, currentIndent: number): number {
  const cleanLine = cleanCodeLine(line, 'general');
  const leadingCloseCount = getLeadingClosingBracketsCount(cleanLine);
  const totalChange = getBracketIndentChange(cleanLine);
  
  const printIndent = Math.max(0, currentIndent - leadingCloseCount);
  formattedLines.push(' '.repeat(printIndent * spaces) + line);
  
  currentIndent = Math.max(0, currentIndent + totalChange);
  return currentIndent;
}
        
        // Helper Functions
function cleanCodeLine(line: string, languageId: string): string {
  let clean = line;
  if (languageId === 'php') {
    clean = clean.replace(/\/\/.*$/, '').replace(/#.*$/, '');
  } else {
    clean = clean.replace(/\/\/.*$/, '');
  }
  
  clean = clean.replace(/\/\*[\s\S]*?\*\//g, '');
  
  clean = clean.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  clean = clean.replace(/'(?:[^'\\]|\\.)*'/g, "''");
  clean = clean.replace(/`(?:[^`\\]|\\.)*`/g, "``");
  
  return clean;
}

function getBracketIndentChange(cleanLine: string): number {
  let change = 0;
  for (const char of cleanLine) {
    if (char === '{' || char === '[' || char === '(') {
      change++;
    } else if (char === '}' || char === ']' || char === ')') {
      change--;
    }
  }
  return change;
}

function getLeadingClosingBracketsCount(cleanLine: string): number {
  let count = 0;
  const trimmed = cleanLine.trim();
  for (const char of trimmed) {
    if (char === '}' || char === ']' || char === ')') {
      count++;
    } else if (char === ' ' || char === '\t') {
      continue;
    } else {
      break;
    }
  }
  return count;
}

function getHTMLIndentChange(line: string): number {
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const tagRegex = /<\/?([a-zA-Z0-9\-:]+)(?:\s+[^>]*?)?(\/?)>/g;
  let match;
  let change = 0;
  
  while ((match = tagRegex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isSelfClosingAttr = match[2] === '/';
    const isClosing = fullTag.startsWith('</');
    
    if (isClosing) {
      change--;
    } else if (!isSelfClosingAttr && !voidTags.has(tagName)) {
      change++;
    }
  }
  return change;
}

function getLeadingClosingTagsCount(line: string): number {
  const regex = /^\s*(<\/[a-zA-Z0-9\-:]+>)+/;
  const match = line.match(regex);
  if (!match) {
    return 0;
  }
  const closingTags = match[0].match(/<\/[a-zA-Z0-9\-:]+>/g);
  return closingTags ? closingTags.length : 0;
}
        