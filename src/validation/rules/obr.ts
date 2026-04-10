import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'

// OBR-25 fixed value
const OBR_25_RESULT_STATUS = 'F'

export function validateOBR(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // OBR-4.2: Text — clinical title (required)
  const obr42 = getComponent(segment, 4, 1)
  if (!obr42.trim()) {
    issues.push(error('OBR', 'OBR-4.2', 'Clinical title (OBR-4.2) is required but missing', 'OBR_4_2_REQUIRED'))
  }

  // OBR-4.5: Alternative text — patient-facing title (required)
  const obr45 = getComponent(segment, 4, 4)
  if (!obr45.trim()) {
    issues.push(error('OBR', 'OBR-4.5', 'Patient-facing title (OBR-4.5) is required but missing', 'OBR_4_5_REQUIRED'))
  }

  // OBR-7: Observation date/time — required, YYYYMMDDHHMMSS
  const obr7 = getField(segment, 7)
  if (!obr7.trim()) {
    issues.push(error('OBR', 'OBR-7', 'Observation date/time (OBR-7) is required but missing', 'OBR_7_REQUIRED'))
  } else {
    const dtError = validateHL7DateTime(obr7.trim())
    if (dtError) {
      issues.push(error('OBR', 'OBR-7', `Observation date/time (OBR-7): ${dtError}`, 'OBR_7_FORMAT'))
    }
  }

  // OBR-25: Result status — required, fixed "F"
  const obr25 = getField(segment, 25)
  if (!obr25.trim()) {
    issues.push(error('OBR', 'OBR-25', 'Result status (OBR-25) is required but missing — expected "F" (Final)', 'OBR_25_REQUIRED'))
  } else if (obr25.trim() !== OBR_25_RESULT_STATUS) {
    issues.push(error('OBR', 'OBR-25', `Result status (OBR-25) must be "F" (Final) but got "${obr25.trim()}"`, 'OBR_25_INVALID'))
  }

  return issues
}
