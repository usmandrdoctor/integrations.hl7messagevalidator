import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { requireField, collect } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'
import { error } from '../helpers'
import { getField } from '../../parser/segmentParser'

export function validateEVN(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // EVN-1: Event Type Code — required
  issues.push(...collect(requireField(segment, 1, 'EVN-1', 'Event type code (EVN-1)', 'EVN_1_REQUIRED')))

  // EVN-2: Date/Time of Event — required, YYYYMMDDHHMMSS
  const evn2 = getField(segment, 2)
  if (!evn2.trim()) {
    issues.push(error('EVN', 'EVN-2', 'Date/time of event (EVN-2) is required but missing', 'EVN_2_REQUIRED'))
  } else {
    const dateError = validateHL7DateTime(evn2.trim())
    if (dateError) {
      issues.push(error('EVN', 'EVN-2', `Date/time of event (EVN-2): ${dateError}`, 'EVN_2_FORMAT'))
    }
  }

  return issues
}
