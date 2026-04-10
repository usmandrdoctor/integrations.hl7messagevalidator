import type { ParsedSegment } from '../types/hl7'
import type { ValidationIssue, ValidationSeverity } from '../types/validation'
import { getField, getComponent } from '../parser/segmentParser'
import { formatValidValues } from '../utils/formatUtils'

export function issue(
  severity: ValidationSeverity,
  segment: string,
  fieldRef: string,
  message: string,
  ruleId: string
): ValidationIssue {
  return { severity, segment, fieldRef, message, ruleId }
}

export function error(
  segment: string,
  fieldRef: string,
  message: string,
  ruleId: string
): ValidationIssue {
  return issue('error', segment, fieldRef, message, ruleId)
}

export function warning(
  segment: string,
  fieldRef: string,
  message: string,
  ruleId: string
): ValidationIssue {
  return issue('warning', segment, fieldRef, message, ruleId)
}

/**
 * Require that a field (first component, first repetition) is non-empty.
 */
export function requireField(
  seg: ParsedSegment,
  fieldIndex: number,
  fieldRef: string,
  label: string,
  ruleId: string
): ValidationIssue | null {
  const val = getField(seg, fieldIndex)
  if (!val.trim()) {
    return error(seg.name, fieldRef, `${label} is required but missing`, ruleId)
  }
  return null
}

/**
 * Require that a component within a field is non-empty.
 */
export function requireComponent(
  seg: ParsedSegment,
  fieldIndex: number,
  compIndex: number,
  fieldRef: string,
  label: string,
  ruleId: string,
  repIndex = 0
): ValidationIssue | null {
  const val = getComponent(seg, fieldIndex, compIndex - 1, repIndex)
  if (!val.trim()) {
    return error(seg.name, fieldRef, `${label} is required but missing`, ruleId)
  }
  return null
}

/**
 * Require that a value is one of a set of allowed values.
 */
export function requireEnum(
  seg: ParsedSegment,
  fieldIndex: number,
  allowed: Set<string>,
  fieldRef: string,
  label: string,
  ruleId: string,
  repIndex = 0,
  compIndex = 0
): ValidationIssue | null {
  const val = getComponent(seg, fieldIndex, compIndex, repIndex)
  if (!val.trim()) {
    return error(seg.name, fieldRef, `${label} is required but missing`, ruleId)
  }
  if (!allowed.has(val)) {
    return error(
      seg.name,
      fieldRef,
      `${label} has invalid value "${val}" — expected one of ${formatValidValues(allowed)}`,
      ruleId
    )
  }
  return null
}

/**
 * Collect non-null issues from an array of nullable issues.
 */
export function collect(...items: (ValidationIssue | null)[]): ValidationIssue[] {
  return items.filter((i): i is ValidationIssue => i !== null)
}
