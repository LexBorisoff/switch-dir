import { useCoreHooks } from '../hooks/use-core-hooks.js';

function checkTmpDir(): void {
  const rootDir = useCoreHooks((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.dirCreate('tmp');
  }
}

export const updateTmp = {
  directory(directory: string): void {
    checkTmpDir();

    const dirFile = useCoreHooks(({ tmp }) => tmp.directory);
    dirFile.write(directory);
  },
};
