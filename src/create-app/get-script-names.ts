type ScriptType = 'bash' | 'powershell';

export function getScriptNames(command: string): Record<ScriptType, string> {
  return {
    bash: `${command}.sh`,
    powershell: `${command}.ps1`,
  };
}
