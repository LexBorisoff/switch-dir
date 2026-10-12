import { useCoreActions } from '../actions/core-actions.js';

export function updateTmp(data: string): void {
  const rootDir = useCoreActions((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.createDir('tmp');
  }

  const dirFile = useCoreActions(({ tmp }) => tmp.directory);
  dirFile.write(data);
}
