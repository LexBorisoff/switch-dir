export interface ConfigInterface {
  /**
   * Executable script name
   */
  command: string;
  /**
   * Quick access directories
   */
  quickAccess: Record<string, string>;
}
