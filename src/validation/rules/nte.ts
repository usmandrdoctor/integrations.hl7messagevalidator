import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error } from '../helpers'

export function validateNTE(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // NTE-1: Set ID — sequential identifier (required)
  const nte1 = getField(segment, 1)
  if (!nte1.trim()) {
    issues.push(error('NTE', 'NTE-1', 'Set ID (NTE-1) is required but missing', 'NTE_1_REQUIRED'))
  }

  // NTE-3: Comment — relates to the preceding OBX segment (required)
  const nte3 = getField(segment, 3)
  if (!nte3.trim()) {
    issues.push(error('NTE', 'NTE-3', 'Comment (NTE-3) is required but missing', 'NTE_3_REQUIRED'))
  }

  return issues
}
