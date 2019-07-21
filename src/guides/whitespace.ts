import * as vscode from 'vscode';

// regex to find arrows
const ARROW_REGEX = /[v<>^?]/g;
// regex to find whitespace
const WHITESPACE_REGEX = /\s/;

/**
 * object containing a collection of ranges in the horizontal & vertical directions.
 */
export interface HorizontalAndVerticalRanges {
  horizontalRanges: vscode.Range[];
  verticalRanges: vscode.Range[];
}

/**
 * finds all valid whitespace ranges on the current editor that are pointed to by a Befunge control character.
 * @param editor the current text editor.
 * @param shouldWrap whether to wrap the lines around when they hit the 'edge' of the torus
 */
export function findWhitespaceRanges(editor: vscode.TextEditor, shouldWrap: boolean): HorizontalAndVerticalRanges {
  let vRanges: vscode.Range[] = [];
  let hRanges: vscode.Range[] = [];
  const text = editor.document.getText();
  let matchArray: RegExpExecArray;
  while (matchArray = ARROW_REGEX.exec(text)) {
    const match: string = matchArray[0];
    const absoluteIndex: number = matchArray.index;

    const startPos: vscode.Position = editor.document.positionAt(absoluteIndex);
    if (_matches(match, 'v', '?')) {
      vRanges = vRanges.concat(this._findConnectedWhitespaceDown(startPos, editor, shouldWrap));
    }
    if (_matches(match, '^', '?')) {
      vRanges = vRanges.concat(this._findConnectedWhitespaceUp(startPos, editor, shouldWrap));
    }
    if (_matches(match, '>', '?')) {
      hRanges = hRanges.concat(this._findConnectedWhitespaceRight(startPos, editor, shouldWrap));
    }
    if (_matches(match, '<', '?')) {
      hRanges = hRanges.concat(this._findConnectedWhitespaceLeft(startPos, editor, shouldWrap));
    }
  }
  return { horizontalRanges: hRanges, verticalRanges: vRanges };
}

/**
 * checks whether a given character is contained in an array.
 * @param actual the value to check
 * @param toMatch the array of values
 */
// tslint:disable-next-line:function-name exported for testing
export function _matches<T>(actual: T, ...toMatch: T[]): boolean {
  if (toMatch == null || toMatch.length === 0) {
    return false;
  }
  return toMatch.indexOf(actual) >= 0;
}

/**
 * Checks if a character is a whitespace character
 * @param char the character to check
 */
// tslint:disable-next-line:function-name exported for testing
export function _isWhiteSpace(char: string): boolean {
  return WHITESPACE_REGEX.test(char);
}

/**
 * finds the whitespace between start and the next non-whitespace character below start
 * @param start the position of the v or ? character
 * @param editor the current editor
 * @param wrap whether to wrap when the 'edge' of the torus is reached
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceDown(start: vscode.Position, editor: vscode.TextEditor, wrap: boolean): vscode.Range[] {
  const edge = editor.document.lineCount - 1;
  const noWrap = findConnectedWhitespaceVert(start, editor, i => i + 1, i => i <= edge, false);
  if (wrap && noWrap.isAtEdge) {
    return  [
      ...noWrap.ranges,
      ...findConnectedWhitespaceVert(start.with(0, start.character), editor, i => i + 1, i => i <= edge, true).ranges,
    ];
  }
  return noWrap.ranges;
}

/**
 * finds the whitespace between start and the next non-whitespace character above start
 * @param start the position of the ^ or ? character
 * @param editor the current editor
 * @param wrap whether to wrap when the 'edge' of the torus is reached
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceUp(start: vscode.Position, editor: vscode.TextEditor, wrap: boolean): vscode.Range[] {
  const noWrap = findConnectedWhitespaceVert(start, editor, i => i - 1, i => i >= 0, false);
  if (wrap && noWrap.isAtEdge) {
    const otherSide = editor.document.lineCount - 1;
    return [
      ...noWrap.ranges,
      ...findConnectedWhitespaceVert(start.with(otherSide, start.character), editor, i => i - 1, i => i >= 0, true).ranges,
    ];
  }
  return noWrap.ranges;
}

/**
 * finds the whitespace between start and the next non-whitespace character right of start
 * @param start the position of the > or ? character
 * @param editor the current editor
 * @param wrap whether to wrap when the 'edge' of the torus is reached
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceRight(start: vscode.Position, editor: vscode.TextEditor, wrap: boolean): vscode.Range[] {
  const line = editor.document.lineAt(start.line).text;
  const edge = line.length - 1;
  const noWrap = findConnectedWhitespaceHoriz(start, editor, c => c + 1, c => c <= edge, false);
  if (wrap && noWrap.isAtEdge) {
    return [
      ...noWrap.ranges,
      ...findConnectedWhitespaceHoriz(start.with(start.line, 0), editor, c => c + 1, c => c <= edge, true).ranges,
    ];
  }
  return noWrap.ranges;
}

/**
 * finds the whitespace between start and the next non-whitespace character left of start
 * @param start the position of the < or ? character
 * @param editor the current editor
 * @param wrap whether to wrap when the 'edge' of the torus is reached
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceLeft(start: vscode.Position, editor: vscode.TextEditor, wrap: boolean): vscode.Range[] {
  const noWrap = findConnectedWhitespaceHoriz(start, editor, c => c - 1, c => c >= 0, false);
  if (wrap && noWrap.isAtEdge) {
    const otherSide = editor.document.lineAt(start.line).text.length - 1;
    return [
      ...noWrap.ranges,
      ...findConnectedWhitespaceHoriz(start.with(start.line, otherSide), editor, c => c - 1, c => c >= 0, true).ranges,
    ];
  }
  return noWrap.ranges;
}

/**
 * finds the whitespace between startPos and the next non-whitespace character in this row.
 * @param startPos the position of the arrow character
 * @param editor the current editor
 * @param succ the successor to the current character index
 * @param predicate the predicate of the character index with terminates the loop
 * @param includeStart whether to include the startPos in the check. Used for wrapping
 */
function findConnectedWhitespaceHoriz(
    startPos: vscode.Position,
    editor: vscode.TextEditor,
    succ: (charIndex: number) => number,
    predicate: (charIndex: number) => boolean,
    includeStart: boolean,
  ): { ranges: vscode.Range[], isAtEdge: boolean } {
  const outRanges: vscode.Range[] = [];
  let charIndex: number = startPos.character;
  const lineIndex: number = startPos.line;
  const line: string = editor.document.lineAt(lineIndex).text;
  const posList: vscode.Position[] = [];
  let hitACharacter = false;
  for (charIndex = includeStart ? charIndex : succ(charIndex); predicate(charIndex); charIndex = succ(charIndex)) {
    if (_isWhiteSpace(line[charIndex])) {
      posList.push(new vscode.Position(lineIndex, charIndex));
    } else {
      hitACharacter = true;
      break; // character was not whitespace
    }
  }

  if (posList.length > 0) {
    const sorted = posList.sort((p1, p2) => p1.compareTo(p2));
    // end translated, since the end of the range appears to be exclusive??
    outRanges.push(new vscode.Range(sorted[0], sorted[sorted.length - 1].translate(0, 1)));
  }

  return { ranges: outRanges, isAtEdge: !hitACharacter };
}

/**
 * finds the whitespace between startPos and the next non-whitespace character in this column.
 * @param startPos the position of the arrow character
 * @param editor the current editor
 * @param succ the successor to the current line index
 * @param predicate the predicate of the line index with terminates the loop
 * @param includeStart whether to include the startPos in the check. Used for wrapping
 */
function findConnectedWhitespaceVert(
    startPos: vscode.Position,
    editor: vscode.TextEditor,
    succ: (lineIndex: number) => number,
    predicate: (lineIndex: number) => boolean,
    includeStart: boolean,
  ): { ranges: vscode.Range[], isAtEdge: boolean } {
  const outRanges: vscode.Range[] = [];
  const charIndex: number = startPos.character;
  let lineIndex: number = startPos.line;
  let hitACharacter = false;
  for (lineIndex = includeStart ? lineIndex : succ(lineIndex); predicate(lineIndex); lineIndex = succ(lineIndex)) {
    const line: string = editor.document.lineAt(lineIndex).text;

    if (line.length > charIndex) {
      if (_isWhiteSpace(line[charIndex])) {
        const pos: vscode.Position = new vscode.Position(lineIndex, charIndex);
        outRanges.push(new vscode.Range(pos, pos));
      } else {
        hitACharacter = true;
        break; // character was not whitespace
      }
    }
  }
  return { ranges: outRanges, isAtEdge: !hitACharacter };
}
