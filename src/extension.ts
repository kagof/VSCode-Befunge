import * as vscode from 'vscode';
import { Listener } from './guides/listener';

/**
 * The "main" function, VS Code runs this.
 * @param context context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext): void {
  const listener = new Listener(context);
  listener.listen();
}
