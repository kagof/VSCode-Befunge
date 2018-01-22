//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as typemoq from 'typemoq';

import * as vscode from 'vscode';
import * as extension from '../extension';

suite('Extension Tests', () => {

  const renderer: extension.Renderer = new extension.Renderer();

  test('is whitespace', () => {
    assert.equal(true, renderer.isWhiteSpace(' '));
    assert.equal(true, renderer.isWhiteSpace('\t'));
    assert.equal(true, renderer.isWhiteSpace('\n'));
    assert.equal(false, renderer.isWhiteSpace('f'));
  });

  const mockEd: typemoq.IMock<vscode.TextEditor> = typemoq.Mock.ofType();
  const mockDoc: typemoq.IMock<vscode.TextDocument> = typemoq.Mock.ofType();
  const mockLine: typemoq.IMock<vscode.TextLine> = typemoq.Mock.ofType();
  mockLine.setup(l => l.text).returns(() => '   ');
  mockDoc.setup(d => d.lineCount).returns(() => 3);
  mockDoc.setup(d => d.lineAt(0)).returns(() => mockLine.object);
  mockDoc.setup(d => d.lineAt(1)).returns(() => mockLine.object);
  mockDoc.setup(d => d.lineAt(2)).returns(() => mockLine.object);
  mockEd.setup(e => e.document).returns(() => mockDoc.object);

  test('execute down', () => {
    const ranges: vscode.Range[] = renderer.execDown(new vscode.Position(0, 0), mockEd.object);
    assert.equal(ranges.length, 2, 'number of ranges incorrect');
    assert.equal(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.equal(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.equal(ranges[0].isEqual(new vscode.Range(1, 0, 1, 0)), true, 'ranges[0] did not match');
    assert.equal(ranges[1].isEqual(new vscode.Range(2, 0, 2, 0)), true, 'ranges[1] did not match');
  });

  test('execute up', () => {
    const ranges: vscode.Range[] = renderer.execUp(new vscode.Position(2, 0), mockEd.object);
    assert.equal(ranges.length, 2, 'number of ranges incorrect');
    assert.equal(ranges[0].isSingleLine, true, 'ranges[0] not single line');
    assert.equal(ranges[1].isSingleLine, true, 'ranges[1] not single line');
    assert.equal(ranges[0].isEqual(new vscode.Range(1, 0, 1, 0)), true, 'ranges[0] did not match');
    assert.equal(ranges[1].isEqual(new vscode.Range(0, 0, 0, 0)), true, 'ranges[1] did not match');
  });

  test('execute right', () => {
    const ranges: vscode.Range[] = renderer.execRight(new vscode.Position(0, 0), mockEd.object);
    assert.equal(ranges.length, 1, 'number of ranges incorrect');
    assert.equal(ranges[0].isSingleLine, true, 'not single line');
    assert.equal(ranges[0].isEqual(new vscode.Range(0, 1, 0, 3)), true, 'range did not match');
  });

  test('execute left', () => {
    const ranges: vscode.Range[] = renderer.execLeft(new vscode.Position(0, 3), mockEd.object);
    assert.equal(1, ranges.length, 'number of ranges incorrect');
    assert.equal(true, ranges[0].isSingleLine, 'not single line');
    assert.equal(ranges[0].isEqual(new vscode.Range(0, 0, 0, 3)), true, 'range did not match');
  });

});
