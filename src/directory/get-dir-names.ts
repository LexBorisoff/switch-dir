import fs from 'node:fs';
import path from 'node:path';

export function getDirNames(dirPath: string): string[] {
  const dirFiles = fs.readdirSync(dirPath);
  return dirFiles.filter((file) => {
    try {
      return fs.statSync(path.resolve(dirPath, file)).isDirectory();
    } catch {
      return false;
    }
  });
}
