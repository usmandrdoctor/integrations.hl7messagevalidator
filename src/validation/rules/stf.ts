import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'

/**
 * STF validator for MFN^Z03.
 * STF is an optional segment — if included ALL fields become required.
 */
export function validateSTF(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // STF-2: Staff ID Code — required when STF is present
  const stf2 = getField(segment, 2)
  if (!stf2.trim()) {
    issues.push(error('STF', 'STF-2', 'Staff ID code (STF-2) is required when STF segment is present', 'STF_2_REQUIRED'))
  }

  // STF-3.1: Staff last name (family name) — required when STF is present
  const stf31 = getComponent(segment, 3, 0)
  if (!stf31.trim()) {
    issues.push(error('STF', 'STF-3.1', 'Staff last name (STF-3.1) is required when STF segment is present', 'STF_3_1_REQUIRED'))
  }

  // STF-3.2: Staff first name — required when STF is present
  const stf32 = getComponent(segment, 3, 1)
  if (!stf32.trim()) {
    issues.push(error('STF', 'STF-3.2', 'Staff first name (STF-3.2) is required when STF segment is present', 'STF_3_2_REQUIRED'))
  }

  // STF-3.5: Staff title — required when STF is present
  // Component index 4 = component 5 (0-based)
  const stf35 = getComponent(segment, 3, 4)
  if (!stf35.trim()) {
    issues.push(error('STF', 'STF-3.5', 'Staff title (STF-3.5) is required when STF segment is present', 'STF_3_5_REQUIRED'))
  }

  return issues
}
