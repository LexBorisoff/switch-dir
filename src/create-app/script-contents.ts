import { PATHS } from '../constants.js';

export const bashFunction = (
  functionName: string,
): string => `#!/usr/bin/env bash

${functionName}() {
  if test -f "${PATHS.MAIN_FILE}"; then
    # get the directory name
    node "${PATHS.MAIN_FILE}" "$@"
    local directory=$(<"${PATHS.DIR_FILE}")
    
    # clear tmp files
    >"${PATHS.DIR_FILE}"

    # cd to directory
    if test -n "$directory"; then
      cd "$directory"
    fi
  fi
}
`;

export const bashStartScript = `#!/usr/bin/env bash

if test -d "${PATHS.BIN_DIR}"; then
	for file in "${PATHS.BIN_DIR}"/*.sh; do
		if test -f "$file"; then
			. "$file"
		fi
	done
fi
`;

export const powershellScript = `#!/usr/bin/env pwsh

if (Test-Path -Path "${PATHS.MAIN_FILE}") {
  # get the script name  
  node "${PATHS.MAIN_FILE}" $args
  $Directory = Get-Content -Path "${PATHS.DIR_FILE}" -ErrorAction SilentlyContinue

  # clear tmp files
  Clear-Content -Path "${PATHS.DIR_FILE}"

  # run the script
  if (![string]::IsNullOrEmpty($Directory)) {
    Set-Location "$Directory"
  }
}
`;
