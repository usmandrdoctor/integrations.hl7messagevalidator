import type { ParsedSegment } from '../types/hl7'

/**
 * Get a raw field value from a segment.
 * fieldIndex is 1-based (HL7 field numbering).
 * repIndex, compIndex, subCompIndex are 0-based.
 */
export function getField(
  segment: ParsedSegment,
  fieldIndex: number,
  repIndex = 0,
  compIndex = 0,
  subCompIndex = 0
): string {
  const field = segment.fields[fieldIndex]
  if (!field) return ''
  const rep = field[repIndex]
  if (!rep) return ''
  const comp = rep[compIndex]
  if (!comp) return ''
  return comp[subCompIndex] ?? ''
}

/**
 * Get a component from a field.
 * fieldIndex is 1-based, compIndex is 0-based.
 */
export function getComponent(
  segment: ParsedSegment,
  fieldIndex: number,
  compIndex: number,
  repIndex = 0
): string {
  return getField(segment, fieldIndex, repIndex, compIndex, 0)
}

/**
 * Get a sub-component from a field.
 */
export function getSubComponent(
  segment: ParsedSegment,
  fieldIndex: number,
  compIndex: number,
  subCompIndex: number,
  repIndex = 0
): string {
  return getField(segment, fieldIndex, repIndex, compIndex, subCompIndex)
}

/**
 * Get all repetitions of a field as an array of component arrays.
 * Returns an array where each element is one repetition's component array.
 */
export function getRepetitions(
  segment: ParsedSegment,
  fieldIndex: number
): string[][] {
  const field = segment.fields[fieldIndex]
  if (!field) return []
  return field.map(rep => rep.map(comp => comp[0] ?? ''))
}

/**
 * Get the full first-component value of each repetition of a field.
 */
export function getRepetitionValues(
  segment: ParsedSegment,
  fieldIndex: number
): string[] {
  return getRepetitions(segment, fieldIndex).map(rep => rep[0] ?? '')
}

/**
 * Get all component values for a specific repetition of a field.
 * Returns 1-based array where index 0 is empty (placeholder).
 */
export function getComponentsForRep(
  segment: ParsedSegment,
  fieldIndex: number,
  repIndex: number
): string[] {
  const field = segment.fields[fieldIndex]
  if (!field) return []
  const rep = field[repIndex]
  if (!rep) return []
  return ['', ...rep.map(comp => comp[0] ?? '')]  // 1-based: index 1 = component 1
}

/**
 * Count repetitions of a field.
 */
export function countRepetitions(
  segment: ParsedSegment,
  fieldIndex: number
): number {
  const field = segment.fields[fieldIndex]
  if (!field) return 0
  // A single empty value still counts as 0 repetitions conceptually
  if (field.length === 1 && (field[0]?.[0]?.[0] ?? '') === '') return 0
  return field.length
}
