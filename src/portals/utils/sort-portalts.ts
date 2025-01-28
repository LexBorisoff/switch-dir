export function sortPortals(
  portals: Record<string, string>,
): Record<string, string> {
  const sortedNames = Object.keys(portals).sort((a, b) => a.localeCompare(b));
  return sortedNames.reduce<Record<string, string>>((acc, key) => {
    acc[key] = portals[key];
    return acc;
  }, {});
}
