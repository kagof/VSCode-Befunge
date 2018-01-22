import * as vscode from 'vscode';

/**
 * The "main" function, VS Code runs this. This is only used for the alignment guides.
 * @param context context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext) {
  const renderer: Renderer = new Renderer();
  let editor = vscode.window.activeTextEditor;
  if (editor && isBefungeDoc(editor)) {
    renderer.render(editor);
  }
  vscode.window.onDidChangeActiveTextEditor(
    (ed) => {
      editor = ed;
      if (editor && isBefungeDoc(editor)) {
        renderer.render(editor);
      }
    },
    null, context.subscriptions);
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (editor && event.document === editor.document && isBefungeDoc(editor)) {
        renderer.render(editor);
      }
    },
    null, context.subscriptions);
}

/**
 * Determines if the language being used by the editor is Befunge (93 or 98)
 * @param editor the current text editor
 */
function isBefungeDoc(editor: vscode.TextEditor): boolean {
  return ((editor.document.languageId === 'befunge') || editor.document.languageId === 'befunge98');
}

/**
 * Class which renders the guides.
 */
export class Renderer {

  private enabled: boolean;

  private verticalConfig: vscode.DecorationRenderOptions;
  private horizontalConfig: vscode.DecorationRenderOptions;

  private verticalDecoration: vscode.TextEditorDecorationType;
  private horizontalDecoration: vscode.TextEditorDecorationType;
  private colorDark: string;
  private colorLight: string;


  // regex to find arrows
  private regex = /[v<>^?]/g;

  constructor() {
    this.refresh();
  }

  /**
   * renders the guides, if guides are enabled.
   * @param editor the current text editor
   */
  render(editor: vscode.TextEditor): void {
    this.refresh();
    if (!this.enabled) {
      return;
    }
    let vRanges: vscode.Range[] = [];
    let hRanges: vscode.Range[] = [];
    const text = editor.document.getText();

    let matchArray: RegExpExecArray;
    while (matchArray = this.regex.exec(text)) {
      const match: string = matchArray[0];
      const absoluteIndex: number = matchArray.index;

      const startPos: vscode.Position = editor.document.positionAt(absoluteIndex);
      if (match === 'v' || match === '?') {
        vRanges = vRanges.concat(this.execDown(startPos, editor));
      }
      if (match === '^' || match === '?') {
        vRanges = vRanges.concat(this.execUp(startPos, editor));
      }
      if (match === '>' || match === '?') {
        hRanges = hRanges.concat(this.execRight(startPos, editor));
      }
      if (match === '<' || match === '?') {
        hRanges = hRanges.concat(this.execLeft(startPos, editor));
      }
    }

    editor.setDecorations(this.verticalDecoration, vRanges);
    editor.setDecorations(this.horizontalDecoration, hRanges);
  }

  /**
   * Checks if a character is a whitespace character
   * @param char the character to check
   */
  isWhiteSpace(char: string): boolean {
    return /\s/.test(char);
  }

  /**
   * finds the whitespace between startPos and the next non-whitespace character below startPos
   * @param startPos the position of the v or ? character
   * @param editor the current editor
   */
  execDown(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
    const outRanges: vscode.Range[] = [];
    const charIndex: number = startPos.character;
    let lineIndex: number = startPos.line;
    for (lineIndex += 1; lineIndex < editor.document.lineCount; lineIndex += 1) {
      const line: string = editor.document.lineAt(lineIndex).text;

      if (line.length > charIndex) {
        if (this.isWhiteSpace(line[charIndex])) {
          const pos: vscode.Position = new vscode.Position(lineIndex, charIndex);
          outRanges.push(new vscode.Range(pos, pos));
        } else {
          break; // character was not whitespace
        }
      }
    }
    return outRanges;
  }

  /**
   * finds the whitespace between startPos and the next non-whitespace character above startPos
   * @param startPos the position of the ^ or ? character
   * @param editor the current editor
   */
  execUp(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
    const outRanges: vscode.Range[] = [];
    const charIndex: number = startPos.character;
    let lineIndex: number = startPos.line;
    for (lineIndex -= 1; lineIndex >= 0; lineIndex -= 1) {
      const line: string = editor.document.lineAt(lineIndex).text;

      if (line.length > charIndex) {
        if (this.isWhiteSpace(line[charIndex])) {
          const pos: vscode.Position = new vscode.Position(lineIndex, charIndex);
          outRanges.push(new vscode.Range(pos, pos));
        } else {
          break; // character was not whitespace
        }
      }
    }
    return outRanges;
  }

  /**
   * finds the whitespace between startPos and the next non-whitespace character right of startPos
   * @param startPos the position of the > or ? character
   * @param editor the current editor
   */
  execRight(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
    const outRanges: vscode.Range[] = [];
    let charIndex: number = startPos.character;
    const lineIndex: number = startPos.line;
    const line: string = editor.document.lineAt(lineIndex).text;
    for (charIndex += 1; charIndex < line.length; charIndex += 1) {
      if (!this.isWhiteSpace(line[charIndex])) {
        break; // character was not whitespace
      }
    }
    const right: vscode.Position = new vscode.Position(lineIndex, charIndex);
    const left: vscode.Position = startPos.translate(0, 1);
    if (right.isAfter(left)) {
      outRanges.push(new vscode.Range(left, right));
    }
    return outRanges;
  }

  /**
   * finds the whitespace between startPos and the next non-whitespace character left of startPos
   * @param startPos the position of the < or ? character
   * @param editor the current editor
   */
  execLeft(startPos: vscode.Position, editor: vscode.TextEditor): vscode.Range[] {
    const outRanges: vscode.Range[] = [];
    let charIndex: number = startPos.character;
    const lineIndex: number = startPos.line;
    const line: string = editor.document.lineAt(lineIndex).text;
    for (charIndex -= 1; charIndex >= 0; charIndex -= 1) {
      if (!this.isWhiteSpace(line[charIndex])) {
        break; // character was not whitespace
      }
    }
    const right: vscode.Position = startPos;
    const left: vscode.Position = new vscode.Position(lineIndex, charIndex + 1);
    if (right.isAfter(left)) {
      outRanges.push(new vscode.Range(left, right));
    }
    return outRanges;
  }

  /**
   * Rereads the configuration.
   * This allows the colors to stay updated, as well as whether to enable/disable guides.
   */
  refresh(): void {
    const cfg: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('befunge.guides');
    this.enabled = cfg.enable;
    if (this.colorDark !== cfg.color.dark || this.colorLight !== cfg.color.light) {
      this.colorDark = cfg.color.dark;
      this.colorLight = cfg.color.light;
      this.refreshDecorations();
    }
  }

  /**
   * Refreshes the decorations. To be called when a color configuration has been changed.
   */
  refreshDecorations() {
    this.verticalConfig = {
      dark: {
        outlineWidth: '1px',
        outlineColor: this.colorDark,
        outlineStyle: 'solid',
      },
      light: {
        outlineWidth: '1px',
        outlineColor: this.colorLight,
        outlineStyle: 'solid',
      },
    };
    this.horizontalConfig = {
      dark: {
        textDecoration: `line-through ${this.colorDark}`,
      },
      light: {
        textDecoration: `line-through ${this.colorLight}`,
      },
    };
    this.verticalDecoration = vscode.window.createTextEditorDecorationType(this.verticalConfig);
    this.horizontalDecoration = vscode.window.createTextEditorDecorationType(this.horizontalConfig);
  }
}
