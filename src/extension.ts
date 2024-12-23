import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('mkhCodeFormatter is now active!');

	// Register the formatCode command
	const disposable = vscode.commands.registerCommand('mkh-codeformatter.formatCode', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const fullText = document.getText();

			// Apply custom formatting
			const formattedText = formatText(fullText);

			// Replace the entire document with the formatted text
			const entireRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(fullText.length)
			);

			editor.edit((editBuilder: vscode.TextEditorEdit) => {
				editBuilder.replace(entireRange, formattedText);
			});

			vscode.window.showInformationMessage('Document formatted successfully!');
		} else {
			vscode.window.showWarningMessage('No active editor found.');
		}
	});

	context.subscriptions.push(disposable);
}

export function formatText(text: string): string {
	const lines = text.split('\n');
	const formattedLines: string[] = [];
	let indentLevel = 0;

	lines.forEach(line => {
		const trimmedLine = line.trim();

		// Decrease indentation for closing tags or brackets
		if (trimmedLine.endsWith('}') || trimmedLine.endsWith(']') || trimmedLine.endsWith('>')) {
			indentLevel--;
		}

		// Add spaces for indentation
		const indentedLine = ' '.repeat(indentLevel * 2) + trimmedLine;
		formattedLines.push(indentedLine);

		// Increase indentation for opening tags or brackets
		if (
			(trimmedLine.startsWith('<') && !trimmedLine.endsWith('>')) ||
			trimmedLine.endsWith('{') ||
			trimmedLine.endsWith('[')
		) {
			indentLevel++;
		}
	});

	return formattedLines.join('\n');
}

export function deactivate() {}
