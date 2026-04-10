import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'

const LOC_3_EXPECTED = 'C'

export function validateLOC(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // LOC-1.1: Clinic code — required (primary key)
  const loc11 = getComponent(segment, 1, 0)
  if (!loc11.trim()) {
    issues.push(error('LOC', 'LOC-1.1', 'Clinic code (LOC-1.1) is required but missing', 'LOC_1_1_REQUIRED'))
  }

  // LOC-1.9: Description — human-readable clinic name for booking teams (required)
  // Component index 8 = component 9 (0-based)
  const loc19 = getComponent(segment, 1, 8)
  if (!loc19.trim()) {
    issues.push(error('LOC', 'LOC-1.9', 'Clinic description (LOC-1.9) is required but missing — used for patient-facing booking information', 'LOC_1_9_REQUIRED'))
  }

  // LOC-3: Location type — must be "C" (Clinic)
  const loc3 = getField(segment, 3)
  if (!loc3.trim()) {
    issues.push(error('LOC', 'LOC-3', 'Location type (LOC-3) is required but missing — expected "C" (Clinic)', 'LOC_3_REQUIRED'))
  } else if (loc3.trim() !== LOC_3_EXPECTED) {
    issues.push(error('LOC', 'LOC-3', `Location type (LOC-3) must be "C" (Clinic) but got "${loc3.trim()}"`, 'LOC_3_INVALID'))
  }

  return issues
}
