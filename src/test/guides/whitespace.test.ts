import * as assert from 'assert';
import * as typemoq from 'typemoq';

import * as vscode from 'vscode';
import * as whitespace from '../../guides/whitespace';

suite('Whitespace Tests', () => {

  test('is whitespace', () => {
    assert.strictEqual(true, whitespace._isWhiteSpace(' '), 'space not whitespace');
    assert.strictEqual(true, whitespace._isWhiteSpace('\t'), 'tab not whitespace');
    assert.strictEqual(true, whitespace._isWhiteSpace('\n'), 'newline not whitespace');
    assert.strictEqual(false, whitespace._isWhiteSpace('f'), 'alpha character not whitespace');
  });

  test('matches', () => {
    assert.strictEqual(true, whitespace._matches('f', 'f'), 'f not in [\'f\']');
    assert.strictEqual(true, whitespace._matches('f', 'f', 'a'), '\'f\' not in [\'f\',\'a\']');
    assert.strictEqual(true, whitespace._matches('f', '', 'f'), '\'f\' not in [\'\',\'f\']');
    assert.strictEqual(false, whitespace._matches('f', 'b', '', 'a'), '\'f\' in [\'b\',\'\',\'a\']');
    assert.strictEqual(false, whitespace._matches('f'), '\'f\' in empty list');
  });

  // sets up the mock VS Code objects
  const mockEd: typemoq.IMock<vscode.TextEditor> = setupMock(
    '?   ?',
    '     ',
    '  ? ', // missing 1 char
    '     ',
    '?   ?',
  );

  test('find connected whitespace down', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceDown(new vscode.Position(0, 0), mockEd.object, false);
    assert.strictEqual(ranges.length, 3, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[2].isSingleLine, true, 'ranges[2] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(1, 0, 1, 0)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(2, 0, 2, 0)), true, 'ranges[1] did not match');
    assert.strictEqual(ranges[2].isEqual(new vscode.Range(3, 0, 3, 0)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace down none found', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceDown(new vscode.Position(4, 0), mockEd.object, false);
    assert.strictEqual(ranges.length, 0, 'number of ranges incorrect');
  });

  test('find connected whitespace down with gap', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceDown(new vscode.Position(0, 4), mockEd.object, false);
    assert.strictEqual(ranges.length, 2, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(1, 4, 1, 4)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(3, 4, 3, 4)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace down hits edge', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceDown(new vscode.Position(2, 2), mockEd.object, false);
    assert.strictEqual(ranges.length, 2, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(3, 2, 3, 2)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(4, 2, 4, 2)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace down with wrap', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceDown(new vscode.Position(2, 2), mockEd.object, true);
    assert.strictEqual(ranges.length, 4, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[2].isSingleLine, true, 'ranges[2] not single line');
    assert.strictEqual(ranges[3].isSingleLine, true, 'ranges[3] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(3, 2, 3, 2)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(4, 2, 4, 2)), true, 'ranges[1] did not match');
    assert.strictEqual(ranges[2].isEqual(new vscode.Range(0, 2, 0, 2)), true, 'ranges[2] did not match');
    assert.strictEqual(ranges[3].isEqual(new vscode.Range(1, 2, 1, 2)), true, 'ranges[3] did not match');
  });

  test('find connected whitespace up', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceUp(new vscode.Position(4, 0), mockEd.object, false);
    assert.strictEqual(ranges.length, 3, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[2].isSingleLine, true, 'ranges[2] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(3, 0, 3, 0)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(2, 0, 2, 0)), true, 'ranges[1] did not match');
    assert.strictEqual(ranges[2].isEqual(new vscode.Range(1, 0, 1, 0)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace up none found', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceUp(new vscode.Position(0, 0), mockEd.object, false);
    assert.strictEqual(ranges.length, 0, 'number of ranges incorrect');
  });

  test('find connected whitespace up with gap', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceUp(new vscode.Position(4, 4), mockEd.object, false);
    assert.strictEqual(ranges.length, 2, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(3, 4, 3, 4)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(1, 4, 1, 4)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace up hits edge', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceUp(new vscode.Position(2, 2), mockEd.object, false);
    assert.strictEqual(ranges.length, 2, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(1, 2, 1, 2)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(0, 2, 0, 2)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace up with wrap', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceUp(new vscode.Position(2, 2), mockEd.object, true);
    assert.strictEqual(ranges.length, 4, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[2].isSingleLine, true, 'ranges[2] not single line');
    assert.strictEqual(ranges[3].isSingleLine, true, 'ranges[3] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(1, 2, 1, 2)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(0, 2, 0, 2)), true, 'ranges[1] did not match');
    assert.strictEqual(ranges[2].isEqual(new vscode.Range(4, 2, 4, 2)), true, 'ranges[2] did not match');
    assert.strictEqual(ranges[3].isEqual(new vscode.Range(3, 2, 3, 2)), true, 'ranges[3] did not match');
  });

  test('find connected whitespace right', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceRight(new vscode.Position(0, 0), mockEd.object, false);
    assert.strictEqual(ranges.length, 1, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(0, 1, 0, 4)), true, 'range did not match');
  });

  test('find connected whitespace right none found', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceRight(new vscode.Position(0, 4), mockEd.object, false);
    assert.strictEqual(ranges.length, 0, 'number of ranges incorrect');
  });

  test('find connected whitespace right hits edge', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceRight(new vscode.Position(2, 2), mockEd.object, false);
    assert.strictEqual(ranges.length, 1, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(2, 3, 2, 4)), true, 'range did not match');
  });

  test('find connected whitespace right with wrap', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceRight(new vscode.Position(2, 2), mockEd.object, true);
    assert.strictEqual(ranges.length, 2, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(2, 3, 2, 4)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(2, 0, 2, 2)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace left', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceLeft(new vscode.Position(0, 4), mockEd.object, false);
    assert.strictEqual(ranges.length, 1, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(0, 1, 0, 4)), true, 'range did not match');
  });

  test('find connected whitespace left none found', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceLeft(new vscode.Position(0, 0), mockEd.object, false);
    assert.strictEqual(ranges.length, 0, 'number of ranges incorrect');
  });

  test('find connected whitespace left hits edge', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceLeft(new vscode.Position(2, 2), mockEd.object, false);
    assert.strictEqual(ranges.length, 1, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(2, 0, 2, 2)), true, 'range did not match');
  });

  test('find connected whitespace left with wrap', () => {
    const ranges: vscode.Range[] = whitespace._findConnectedWhitespaceLeft(new vscode.Position(2, 2), mockEd.object, true);
    assert.strictEqual(ranges.length, 2, 'number of ranges incorrect');
    assert.strictEqual(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(ranges[0].isEqual(new vscode.Range(2, 0, 2, 2)), true, 'ranges[0] did not match');
    assert.strictEqual(ranges[1].isEqual(new vscode.Range(2, 3, 2, 4)), true, 'ranges[1] did not match');
  });

  // used to test a corner case in vertical wrapping
  const edVertWrapCorner: typemoq.IMock<vscode.TextEditor> = setupMock(
    '',
    ' ',
    '?',
    ' ',
    '',
  );

  test('find connected whitespace down with wrap edge is not present still wraps', () => {
    const rs: vscode.Range[] = whitespace._findConnectedWhitespaceDown(new vscode.Position(2, 0), edVertWrapCorner.object, true);
    assert.strictEqual(rs.length, 2, 'number of ranges incorrect');
    assert.strictEqual(rs[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(rs[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(rs[0].isEqual(new vscode.Range(3, 0, 3, 0)), true, 'ranges[0] did not match');
    assert.strictEqual(rs[1].isEqual(new vscode.Range(1, 0, 1, 0)), true, 'ranges[1] did not match');
  });

  test('find connected whitespace up with wrap edge is not present still wraps', () => {
    const rs: vscode.Range[] = whitespace._findConnectedWhitespaceUp(new vscode.Position(2, 0), edVertWrapCorner.object, true);
    assert.strictEqual(rs.length, 2, 'number of ranges incorrect');
    assert.strictEqual(rs[0].isSingleLine, true, 'ranges[0] not single line');
    assert.strictEqual(rs[1].isSingleLine, true, 'ranges[1] not single line');
    assert.strictEqual(rs[0].isEqual(new vscode.Range(1, 0, 1, 0)), true, 'ranges[0] did not match');
    assert.strictEqual(rs[1].isEqual(new vscode.Range(3, 0, 3, 0)), true, 'ranges[1] did not match');
  });

});

function setupMock(...rows: string[]): typemoq.IMock<vscode.TextEditor> {
  const mockEd: typemoq.IMock<vscode.TextEditor> = typemoq.Mock.ofType();
  const mockDoc: typemoq.IMock<vscode.TextDocument> = typemoq.Mock.ofType();
  mockDoc.setup(d => d.lineCount).returns(() => 5);
  rows.forEach((row, index) => {
    const mockLine: typemoq.IMock<vscode.TextLine> = typemoq.Mock.ofType();
    mockLine.setup(l => l.text).returns(() => row);
    mockDoc.setup(d => d.lineAt(index)).returns(() => mockLine.object);
  });
  mockEd.setup(e => e.document).returns(() => mockDoc.object);
  return mockEd;
}
