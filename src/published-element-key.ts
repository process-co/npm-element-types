/** Strip only the complete namespace prefix, preserving the operation's local spelling. */
export function publishedElementLocalKey(namespace: string, qualifiedKey: string): string {
  const key = qualifiedKey.trim();
  const normalized = namespace.trim().replaceAll('_', '-');
  const boundary = normalized ? `${normalized}-` : '';
  // Historical provider keys retain underscores in their namespace prefix.
  // Compare only that prefix; underscores inside the local operation are significant.
  if (boundary && key.length > boundary.length
    && key.slice(0, boundary.length).replaceAll('_', '-') === boundary) {
    return key.slice(boundary.length);
  }
  return key;
}
