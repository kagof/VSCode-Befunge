import * as vscode from 'vscode';
import { Renderer } from './renderer';

export const CONFIGURATION_NAME = 'befunge.guides';

/**
 * configures the renderer.
 */
export class Configurer {
  private colorDark: String;
  private colorLight: String;
  private config: vscode.WorkspaceConfiguration;

  /**
   * Returns whether or not alignment guides are enabled in the workspace configuration.
   */
  isEnabled(): boolean {
    return this.forceRefreshConfig().enabled;
  }

  /**
   * Rereads the configuration, purging old decorations and reloading styles as needed.
   * @param renderer the renderer to refresh the configuration of
   * @param forceRefreshConfig whether to force a configuration refresh or not
   */
  refresh(renderer: Renderer, forceRefreshConfig: boolean = false): void {
    const cfg: vscode.WorkspaceConfiguration = forceRefreshConfig ? this.forceRefreshConfig() : this.getConfig();
    if (this.colorDark !== cfg.color.dark || this.colorLight !== cfg.color.light) {
      renderer.verticalDecoration && renderer.verticalDecoration.dispose(); // erase all vertical decorations in old style
      renderer.horizontalDecoration && renderer.horizontalDecoration.dispose(); // erase all horizontal decorations in old style
      this.loadDecorations(renderer, cfg);
    }
  }

  /**
   * retrieves the current workspace configuration.
   */
  private getConfig(): vscode.WorkspaceConfiguration {
    if (this.config == null) {
      this.forceRefreshConfig();
    }
    return this.config;
  }

  /**
   * forces updating the current workspace configuration.
   */
  private forceRefreshConfig(): vscode.WorkspaceConfiguration {
    this.config = vscode.workspace.getConfiguration(CONFIGURATION_NAME);
    return this.config;
  }

  /**
   * Refreshes the decorations. To be called when a color configuration has been changed.
   * @param renderer the renderer to update, if needed
   * @param config the configuration to load the decorations from
   */
  private loadDecorations(renderer: Renderer, config: vscode.WorkspaceConfiguration): void {
    this.colorDark = config.color.dark;
    this.colorLight = config.color.light;
    const verticalConfig = {
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
    const horizontalConfig = {
      dark: {
        textDecoration: `line-through ${this.colorDark}`,
      },
      light: {
        textDecoration: `line-through ${this.colorLight}`,
      },
    };
    renderer.verticalDecoration = vscode.window.createTextEditorDecorationType(verticalConfig);
    renderer.horizontalDecoration = vscode.window.createTextEditorDecorationType(horizontalConfig);
  }
}
