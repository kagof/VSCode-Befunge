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
 */
export function findWhitespaceRanges(editor: vscode.TextEditor): HorizontalAndVerticalRanges {
  let vRanges: vscode.Range[] = [];
  let hRanges: vscode.Range[] = [];
  const text = editor.document.getText();
  let matchArray: RegExpExecArray;
  while (matchArray = ARROW_REGEX.exec(text)) {
    const match: string = matchArray[0];
    const absoluteIndex: number = matchArray.index;

    const startPos: vscode.Position = editor.document.positionAt(absoluteIndex);
    if (_matches(match, 'v', '?')) {
      vRanges = vRanges.concat(this._findConnectedWhitespaceDown(startPos, editor));
    }
    if (_matches(match, '^', '?')) {
      vRanges = vRanges.concat(this._findConnectedWhitespaceUp(startPos, editor));
    }
    if (_matches(match, '>', '?')) {
      hRanges = hRanges.concat(this._findConnectedWhitespaceRight(startPos, editor));
    }
    if (_matches(match, '<', '?')) {
      hRanges = hRanges.concat(this._findConnectedWhitespaceLeft(startPos, editor));
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
 * finds the whitespace between startPos and the next non-whitespace character below startPos
 * @param startPos the position of the v or ? character
 * @param editor the current editor
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceDown(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
  return findConnectedWhitespaceVert(startPos, editor, i => i + 1, i => i < editor.document.lineCount);
}

/**
 * finds the whitespace between startPos and the next non-whitespace character above startPos
 * @param startPos the position of the ^ or ? character
 * @param editor the current editor
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceUp(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
  return findConnectedWhitespaceVert(startPos, editor, i => i - 1, i => i >= 0);
}

/**
 * finds the whitespace between startPos and the next non-whitespace character right of startPos
 * @param startPos the position of the > or ? character
 * @param editor the current editor
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceRight(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
  return findConnectedWhitespaceHoriz(startPos, editor, c => c + 1, (c, line) => c < line.length);
}

/**
 * finds the whitespace between startPos and the next non-whitespace character left of startPos
 * @param startPos the position of the < or ? character
 * @param editor the current editor
 */
// tslint:disable-next-line:function-name exported for testing
export function _findConnectedWhitespaceLeft(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
  return findConnectedWhitespaceHoriz(startPos, editor, c => c - 1, c => c >= 0);
}

/**
 * finds the whitespace between startPos and the next non-whitespace character in this row.
 * @param startPos the position of the arrow character
 * @param editor the current editor
 * @param succ the successor to the current character index
 * @param predicate the predicate of the character index with terminates the loop
 */
function findConnectedWhitespaceHoriz(
    startPos: vscode.Position,
    editor: vscode.TextEditor,
    succ: (charIndex: number) => number,
    predicate: (charIndex: number, line: string) => boolean,
  ): vscode.Range[] {
  const outRanges: vscode.Range[] = [];
  let charIndex: number = startPos.character;
  const lineIndex: number = startPos.line;
  const line: string = editor.document.lineAt(lineIndex).text;
  const posList: vscode.Position[] = [];
  for (charIndex = succ(charIndex); predicate(charIndex, line); charIndex = succ(charIndex)) {
    if (_isWhiteSpace(line[charIndex])) {
      posList.push(new vscode.Position(lineIndex, charIndex));
    } else {
      break; // character was not whitespace
    }
  }

  if (posList.length > 0) {
    const sorted = posList.sort((p1, p2) => p1.compareTo(p2));
    // end translated, since the end of the range appears to be exclusive??
    outRanges.push(new vscode.Range(sorted[0], sorted[sorted.length - 1].translate(0, 1)));
  }

  return outRanges;
}

/**
 * finds the whitespace between startPos and the next non-whitespace character in this column.
 * @param startPos the position of the arrow character
 * @param editor the current editor
 * @param succ the successor to the current line index
 * @param predicate the predicate of the line index with terminates the loop
 */
function findConnectedWhitespaceVert(
    startPos: vscode.Position,
    editor: vscode.TextEditor,
    succ: (lineIndex: number) => number,
    predicate: (lineIndex: number) => boolean,
  ): vscode.Range[] {
  const outRanges: vscode.Range[] = [];
  const charIndex: number = startPos.character;
  let lineIndex: number = startPos.line;
  for (lineIndex = succ(lineIndex); predicate(lineIndex); lineIndex = succ(lineIndex)) {
    const line: string = editor.document.lineAt(lineIndex).text;

    if (line.length > charIndex) {
      if (_isWhiteSpace(line[charIndex])) {
        const pos: vscode.Position = new vscode.Position(lineIndex, charIndex);
        outRanges.push(new vscode.Range(pos, pos));
      } else {
        break; // character was not whitespace
      }
    }
  }
  return outRanges;
}
