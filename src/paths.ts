import os from 'node:os';
import path from 'node:path';

import { APP_NAME, PACKAGE_NAMESPACE } from './constants.js';

class Paths {
  get namespace(): string {
    return path.join(os.homedir(), `.${PACKAGE_NAMESPACE}`);
  }

  get root(): string {
    return path.join(this.namespace, APP_NAME);
  }

  get bin(): string {
    return path.join(this.root, 'bin');
  }

  get lib(): string {
    return path.join(this.root, 'lib');
  }

  get tmp(): string {
    return path.join(this.root, 'tmp');
  }

  get distLinkName(): string {
    return '.dist';
  }

  get distLink(): string {
    return path.join(this.root, this.distLinkName);
  }

  get main(): string {
    return path.join(this.distLink, 'main.js');
  }

  get directory(): string {
    return path.join(this.tmp, 'directory');
  }
}

export const paths = new Paths();
