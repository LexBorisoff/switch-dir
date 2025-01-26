import os from 'node:os';
import path from 'node:path';

import { PACKAGE_NAME } from './constants.js';

class Paths {
  get root(): string {
    return path.resolve(os.homedir(), `.${PACKAGE_NAME}`);
  }

  get bin(): string {
    return path.resolve(this.root, 'bin');
  }

  get lib(): string {
    return path.resolve(this.root, 'lib');
  }

  get tmp(): string {
    return path.resolve(this.root, 'tmp');
  }

  get distLinkName(): string {
    return '.dist';
  }

  get distLink(): string {
    return path.resolve(this.root, this.distLinkName);
  }

  get main(): string {
    return path.resolve(this.distLink, 'main.js');
  }

  get directory(): string {
    return path.resolve(this.tmp, 'directory');
  }
}

export const paths = new Paths();
