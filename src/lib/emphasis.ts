/**
 * Headings mix upright and italic: words wrapped in *asterisks* in the interface copy are set in
 * italic. The copy is escaped first, so only the <em> this adds is markup.
 */
const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export function emphasis(text: string): string {
  return text
    .replace(/[&<>"]/g, (char) => entities[char] ?? char)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** The same copy without its marks, for titles and labels. */
export function plain(text: string): string {
  return text.replaceAll('*', '');
}
