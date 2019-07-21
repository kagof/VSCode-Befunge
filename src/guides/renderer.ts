import * as vscode from 'vscode';
import * as whitespace from './whitespace';
import { Configurer } from './configurer';

/**
 * renders the guides.
 */
export class Renderer {
  private configurer: Configurer;

  verticalDecoration: vscode.TextEditorDecorationType;
  horizontalDecoration: vscode.TextEditorDecorationType;

  constructor() {
    this.configurer = new Configurer();
  }

  /**
   * renders the guides, if guides are enabled.
   * @param editor the current text editor
   */
  render(editor: vscode.TextEditor): void {
    if (!this.configurer.isEnabled()) {
      return;
    }

    const ranges: whitespace.HorizontalAndVerticalRanges = whitespace.findWhitespaceRanges(editor);

    this.configurer.refresh(this); // refreshes the color configuration
    editor.setDecorations(this.verticalDecoration, ranges.verticalRanges);
    editor.setDecorations(this.horizontalDecoration, ranges.horizontalRanges);
  }

}
