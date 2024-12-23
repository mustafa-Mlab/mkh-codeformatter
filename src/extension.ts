import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// Register the formatCode command
	const disposable = vscode.commands.registerCommand('mkh-codeformatter.formatCode', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			// Show a warning if no active editor is found
			vscode.window.showWarningMessage('No active editor found. Open a file to format.');
			return;
		}

		// Get the document and its full text
		const document = editor.document;
		const fullText = document.getText();

		// Validate the content
		if (!fullText || fullText.trim() === '') {
			vscode.window.showWarningMessage('The document is empty or contains only whitespace.');
			return;
		}

		try {
			// Apply custom formatting
			const formattedText = formatText(fullText);

			// Replace the entire document with the formatted text
			const entireRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(fullText.length)
			);

			editor.edit((editBuilder: vscode.TextEditorEdit) => {
				editBuilder.replace(entireRange, formattedText);
			}).then(success => {
				if (success) {
					vscode.window.showInformationMessage('Document formatted successfully!');
				} else {
					vscode.window.showErrorMessage('Failed to apply formatting to the document.');
				}
			});
		} catch (error) {
			// Log and display any errors that occur during formatting
			console.error('Error during formatting:', error);
			vscode.window.showErrorMessage('An error occurred during formatting. Check the logs for details.');
		}
	});

	// Add the command to the extension's subscriptions
	context.subscriptions.push(disposable);
}

export function deactivate() {}

// Formatting logic
export function formatText(text: string): string {
	const lines = text.split('\n');
	const formattedLines: string[] = [];

	// Get the user's preferred indentation size, default to 2 spaces
	const indentationSpaces = vscode.workspace.getConfiguration('mkhCodeFormatter').get<number>('indentationSize', 2);

	let indentLevel = 0;
	let insidePHPBlock = false;

	lines.forEach((line, index) => {
			const trimmedLine = line.trim();

			// Handle PHP and Blade blocks
			if (trimmedLine.startsWith('<?php')) {
					insidePHPBlock = true;
			}
			if (trimmedLine.endsWith('?>')) {
					insidePHPBlock = false;
			}

			if (insidePHPBlock || trimmedLine.startsWith('@')) {
					// PHP/Blade-specific formatting
					handlePHPFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
			} else {
					// HTML-specific formatting
					handleHTMLFormatting(trimmedLine, formattedLines, indentationSpaces, indentLevel);
			}
	});

	return formattedLines.join('\n');
}

function handlePHPFormatting(trimmedLine: string, formattedLines: string[], indentationSpaces: number, indentLevel: number) {
	if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']') || trimmedLine.startsWith(');')) {
			indentLevel = Math.max(0, indentLevel - 1);
	}

	const indentedLine = ' '.repeat(indentLevel * indentationSpaces) + trimmedLine;
	formattedLines.push(indentedLine);

	if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[') || (trimmedLine.endsWith('(') && !trimmedLine.includes(');'))) {
			indentLevel++;
	}
}

function handleHTMLFormatting(trimmedLine: string, formattedLines: string[], indentationSpaces: number, indentLevel: number) {
	if (trimmedLine.startsWith('</')) {
			indentLevel = Math.max(0, indentLevel - 1);
	}

	const indentedLine = ' '.repeat(indentLevel * indentationSpaces) + trimmedLine;
	formattedLines.push(indentedLine);

	if (trimmedLine.endsWith('>') && !trimmedLine.startsWith('</') && !isSelfClosingHTMLTag(trimmedLine)) {
			indentLevel++;
	}
}

function isSelfClosingHTMLTag(line: string): boolean {
	const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
	const tagMatch = line.match(/<(\w+)/);
	if (!tagMatch) { return false; }
	const tagName = tagMatch[1];
	return selfClosingTags.includes(tagName);
}



