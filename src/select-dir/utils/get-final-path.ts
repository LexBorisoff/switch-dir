import path from 'node:path';

export function getFinalPath(currentDir: string, dirNames: string[]): string {
  return path.resolve(currentDir, ...dirNames);
}
