import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { requireField, requireComponent, collect, error } from '../helpers'
import { VALID_PROCESSING_IDS } from '../../constants/referenceData'

export function validateMSH(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // MSH-3: Sending application
  issues.push(...collect(requireField(segment, 3, 'MSH-3', 'Sending application (MSH-3)', 'MSH_3_REQUIRED')))

  // MSH-4: Sending facility (Client Code)
  issues.push(...collect(requireField(segment, 4, 'MSH-4', 'Sending facility / Client Code (MSH-4)', 'MSH_4_REQUIRED')))

  // MSH-5: Receiving application (Provider ID)
  issues.push(...collect(requireField(segment, 5, 'MSH-5', 'Receiving application / Provider ID (MSH-5)', 'MSH_5_REQUIRED')))

  // MSH-6: Receiving facility
  issues.push(...collect(requireField(segment, 6, 'MSH-6', 'Receiving facility (MSH-6)', 'MSH_6_REQUIRED')))

  // MSH-7: Date/time
  issues.push(...collect(requireField(segment, 7, 'MSH-7', 'Date/time of message (MSH-7)', 'MSH_7_REQUIRED')))

  // MSH-9.1: Message type
  issues.push(...collect(requireComponent(segment, 9, 1, 'MSH-9.1', 'Message type (MSH-9.1)', 'MSH_9_1_REQUIRED')))

  // MSH-9.2: Trigger event
  issues.push(...collect(requireComponent(segment, 9, 2, 'MSH-9.2', 'Trigger event (MSH-9.2)', 'MSH_9_2_REQUIRED')))

  // MSH-10: Message control ID
  issues.push(...collect(requireField(segment, 10, 'MSH-10', 'Message control ID (MSH-10)', 'MSH_10_REQUIRED')))

  // MSH-11: Processing ID — must be P or T
  const processingId = getField(segment, 11)
  if (!processingId.trim()) {
    issues.push(error('MSH', 'MSH-11', 'Processing ID (MSH-11) is required but missing', 'MSH_11_REQUIRED'))
  } else if (!VALID_PROCESSING_IDS.has(processingId.trim())) {
    issues.push(error('MSH', 'MSH-11', `Processing ID (MSH-11) has invalid value "${processingId}" — expected "P" (Production) or "T" (Test)`, 'MSH_11_INVALID'))
  }

  // MSH-12: Version ID
  issues.push(...collect(requireField(segment, 12, 'MSH-12', 'Version ID (MSH-12)', 'MSH_12_REQUIRED')))

  return issues
}
