import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'
import { VALID_PRIORITY_CODES } from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

export function validatePV2(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // PV2-8: Expected admit date/time (appointment date)
  const apptDateTime = getField(segment, 8)
  if (!apptDateTime.trim()) {
    issues.push(error('PV2', 'PV2-8', 'Appointment date/time (PV2-8) is required but missing — PV1-44 will be used as fallback if present', 'PV2_8_REQUIRED'))
  } else {
    const dtError = validateHL7DateTime(apptDateTime.trim())
    if (dtError) {
      issues.push(error('PV2', 'PV2-8', `Appointment date/time (PV2-8): ${dtError}`, 'PV2_8_FORMAT'))
    }
  }

  // PV2-25: Appointment Priority
  const priority = getField(segment, 25)
  if (!priority.trim()) {
    issues.push(error('PV2', 'PV2-25', 'Appointment priority (PV2-25) is required but missing', 'PV2_25_REQUIRED'))
  } else if (!VALID_PRIORITY_CODES.has(priority.trim())) {
    issues.push(error('PV2', 'PV2-25', `Appointment priority (PV2-25) has invalid value "${priority}" — expected one of ${formatValidValues(VALID_PRIORITY_CODES)} (1=Routine, 3=Urgent, 4=Two Week Wait)`, 'PV2_25_INVALID'))
  }

  return issues
}
