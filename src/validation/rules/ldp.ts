import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error, warning } from '../helpers'

export function validateLDP(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // LDP-1: Primary Key — clinic code (required, must match MFE-4 and LOC-1.1; cross-field checked separately)
  const ldp1 = getField(segment, 1)
  if (!ldp1.trim()) {
    issues.push(error('LDP', 'LDP-1', 'Clinic code (LDP-1) is required but missing', 'LDP_1_REQUIRED'))
  }

  // LDP-2: Location Department — NHS standard 3-digit specialty code (required)
  const ldp2 = getField(segment, 2)
  if (!ldp2.trim()) {
    issues.push(error('LDP', 'LDP-2', 'NHS specialty code (LDP-2) is required but missing — must be a 3-digit NHS standard specialty code', 'LDP_2_REQUIRED'))
  } else if (!/^\d{3}$/.test(ldp2.trim())) {
    issues.push(warning('LDP', 'LDP-2', `NHS specialty code (LDP-2) should be a 3-digit code but got "${ldp2.trim()}"`, 'LDP_2_FORMAT'))
  }

  return issues
}
