/**
 *
 * @param {string} string - String to convert
 * @return {string} - String converted to sentence case
 * @example
 * toSentenceCase('this is a sentence'); // This is a sentence
 */
export function toSentenceCase(string: string): string {
  if (!string)
    return '';

  return string[0].toUpperCase() + string.slice(1);
}
