import * as assert from 'assert';
import { formatText } from '../extension';

suite('Extension Test Suite', () => {
  test('Basic HTML indentation test', () => {
    const input = `<div>\n<p>\nHello\n</p>\n</div>`;
    const expected = `<div>\n  <p>\n    Hello\n  </p>\n</div>`;
    assert.strictEqual(formatText(input, 'html', 2), expected);
  });

  test('Handles empty input', () => {
    const input = ``;
    const expected = ``;
    assert.strictEqual(formatText(input, 'javascript', 2), expected);
  });

  test('Handles multiple blocks in Javascript', () => {
    const input = `{\na: [\nb,\n{\nc: d\n}\n]\n}`;
    const expected = `{\n  a: [\n    b,\n    {\n      c: d\n    }\n  ]\n}`;
    assert.strictEqual(formatText(input, 'javascript', 2), expected);
  });

  test('Comment drift prevention', () => {
    const input = `function foo() {\n  // comment here\n  /* another comment */\n  /**\n   * JSDoc line\n   */\n}`;
    const firstFormat = formatText(input, 'javascript', 2);
    const secondFormat = formatText(firstFormat, 'javascript', 2);
    assert.strictEqual(secondFormat, firstFormat);
  });

  test('HTML inline tag handling', () => {
    const input = `<div>\n<p>Hello</p>\n<div>World</div>\n</div>`;
    const expected = `<div>\n  <p>Hello</p>\n  <div>World</div>\n</div>`;
    assert.strictEqual(formatText(input, 'html', 2), expected);
  });

  test('HTML comment blocks', () => {
    const input = `<div>\n<!-- single line comment -->\n<!--\nmulti line comment\n-->\n<p>test</p>\n</div>`;
    const expected = `<div>\n  <!-- single line comment -->\n  <!--\n  multi line comment\n  -->\n  <p>test</p>\n</div>`;
    assert.strictEqual(formatText(input, 'html', 2), expected);
  });

  test('Multi-bracket lines in JS', () => {
    const input = `const x = [{\na: 1\n}];`;
    const expected = `const x = [{\n    a: 1\n}];`;
    assert.strictEqual(formatText(input, 'javascript', 2), expected);
  });

  test('Trailing parenthesis in JS/PHP', () => {
    const input = `foo(\nbar\n),\ntest(\nbaz\n);`;
    const expected = `foo(\n  bar\n),\ntest(\n  baz\n);`;
    assert.strictEqual(formatText(input, 'javascript', 2), expected);
  });
});
