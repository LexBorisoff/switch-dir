export function suggestMatch(dirName: string) {
  return (value: string) => dirName.toLowerCase().includes(value.toLowerCase());
}
