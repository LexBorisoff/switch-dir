import { paths } from '../paths.js';

export const bashFunction = (
  functionName: string,
): string => `#!/usr/bin/env bash

${functionName}() {
  if test -f "${paths.main}"; then
    # get the directory name
    node "${paths.main}" "$@"
    local directory=$(<"${paths.directory}")
    
    # clear tmp files
    >"${paths.directory}"

    # cd to directory
    if test -n "$directory"; then
      cd "$directory"
    fi
  fi
}
`;

export const bashStartScript = `#!/usr/bin/env bash

if test -d "${paths.bin}"; then
	for file in "${paths.bin}"/*.sh; do
		if test -f "$file"; then
			. "$file"
		fi
	done
fi
`;

export const powershellScript = `#!/usr/bin/env pwsh

if (Test-Path -Path "${paths.main}") {
  # get the script name  
  node "${paths.main}" $args
  $Directory = Get-Content -Path "${paths.directory}" -ErrorAction SilentlyContinue

  # clear tmp files
  Clear-Content -Path "${paths.directory}"

  # run the script
  if (![string]::IsNullOrEmpty($Directory)) {
    Set-Location "$Directory"
  }
}
`;
