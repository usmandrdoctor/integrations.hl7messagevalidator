/**
 * Format a field reference in HL7 notation.
 * e.g. formatFieldRef('PID', 3, 1, 4) → "PID-3[2].4"
 * repIndex is 0-based internally; displayed as 1-based.
 */
export function formatFieldRef(
  segment: string,
  fieldIndex: number,
  repIndex?: number,
  compIndex?: number
): string {
  let ref = `${segment}-${fieldIndex}`
  if (repIndex !== undefined && repIndex > 0) {
    ref += `[${repIndex + 1}]`
  }
  if (compIndex !== undefined && compIndex > 0) {
    ref += `.${compIndex}`
  }
  return ref
}

/**
 * Format a list of valid values for display in error messages.
 */
export function formatValidValues(values: Iterable<string>): string {
  return Array.from(values).map(v => `"${v}"`).join(', ')
}
