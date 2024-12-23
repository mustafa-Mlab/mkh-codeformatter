import * as assert from 'assert';
import { formatText } from '../extension';


suite('Extension Test Suite', () => {
	test('Basic indentation test', () => {
		const input = `<div>\n<p>\nHello</p>\n</div>`;
		const expected = `<div>\n  <p>\n    Hello\n  </p>\n</div>`;
		assert.strictEqual(formatText(input), expected);
	});

	test('Handles empty input', () => {
		const input = ``;
		const expected = ``;
		assert.strictEqual(formatText(input), expected);
	});

	test('Handles multiple blocks', () => {
		const input = `{a: [b, {c: d}]}`;
		const expected = `{\n  a: [\n    b, \n    {\n      c: d\n    }\n  ]\n}`;
		assert.strictEqual(formatText(input), expected);
	});
});
