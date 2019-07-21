import * as vscode from 'vscode';
import { Renderer } from './renderer';
import { CONFIGURATION_NAME } from './configurer';

/**
 * listens to events that affect the Befunge guides.
 */
export class Listener {
  private renderer: Renderer;
  private editor: vscode.TextEditor;

  constructor (private context: vscode.ExtensionContext) {
    this.renderer = new Renderer();
  }

  /**
   * begin listening for changes.
   */
  listen(): void {
    this.editor = vscode.window.activeTextEditor;
    if (this.isBefungeDoc(this.editor)) {
      this.renderer.render(this.editor);
    }
    this.listenToDidChangeActiveTextEditor();
    this.listenToDidChangeTextDocument();
    this.listenToDidChangeConfiguration();
  }

  /**
   * Begins listening for changes to the active text editor.
   */
  private listenToDidChangeActiveTextEditor(): void {
    vscode.window.onDidChangeActiveTextEditor(
      (ed) => {
        this.editor = ed;
        if (this.isBefungeDoc(this.editor)) {
          this.renderer.render(this.editor);
        }
      },
      null, this.context.subscriptions);
  }

  /**
   * Begins listening for changes to the active text document.
   */
  private listenToDidChangeTextDocument(): void {
    vscode.workspace.onDidChangeTextDocument(
      (event) => {
        if (this.editor && event.document === this.editor.document && this.isBefungeDoc(this.editor)) {
          this.renderer.render(this.editor);
        }
      },
      null, this.context.subscriptions);
  }

  /**
   * Begins listening for changes to the befunge guides configuration.
   */
  private listenToDidChangeConfiguration(): void {
    vscode.workspace.onDidChangeConfiguration(
      (event: vscode.ConfigurationChangeEvent) => {
        if (event.affectsConfiguration(CONFIGURATION_NAME) && this.isBefungeDoc(this.editor)) {
          this.renderer.render(this.editor);
        }
      },
      null, this.context.subscriptions);
  }

  /**
   * Determines if the language being used by the editor is Befunge (93 or 98)
   * @param editor the current text editor
   */
  private isBefungeDoc(editor?: vscode.TextEditor): boolean {
    return (editor && editor.document &&
      (editor.document.languageId === 'befunge' || editor.document.languageId === 'befunge98'));
  }
}
