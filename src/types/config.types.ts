export interface ConfigInterface {
  /**
   * Executable script name
   */
  command: string;
  /**
   * Linked directory paths
   */
  links: Record<string, string>;
}
