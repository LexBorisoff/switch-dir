export interface ConfigInterface {
  /**
   * Executable script name
   */
  command: string;
  /**
   * Saved directories for quick navigation
   */
  portals: Record<string, string>;
}
