import { useCoreHooks } from './hooks/use-core-hooks.js';

export function updateTmp(dir: string): void {
  const rootDir = useCoreHooks((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.dirCreate('tmp');
  }

  const dirFile = useCoreHooks(({ tmp }) => tmp.directory);
  dirFile.write(dir);
}
