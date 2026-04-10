import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error } from '../helpers'
import {
  VALID_ATTENDED_DNA,
  VALID_YN,
  VALID_APPOINTMENT_TYPE,
  VALID_APPOINTMENT_FORMAT,
} from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

export function validateZU3(
  segment: ParsedSegment,
  context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // ZU3-3: Attended or DNA
  const attended = getField(segment, 3)
  if (!attended.trim()) {
    issues.push(error('ZU3', 'ZU3-3', 'Attended/DNA status (ZU3-3) is required but missing', 'ZU3_3_REQUIRED'))
  } else if (!VALID_ATTENDED_DNA.has(attended.trim())) {
    issues.push(error('ZU3', 'ZU3-3', `Attended/DNA status (ZU3-3) has invalid value "${attended}" — expected one of ${formatValidValues(VALID_ATTENDED_DNA)}`, 'ZU3_3_INVALID'))
  } else if (context.zu33Constraint && attended.trim() !== context.zu33Constraint) {
    const constraintLabel =
      context.zu33Constraint === '1' ? '"1" (Booked)' :
      context.zu33Constraint === '4' ? '"4" (Cancelled)' :
      `"${context.zu33Constraint}"`
    issues.push(error('ZU3', 'ZU3-3', `Attended/DNA status (ZU3-3) must be ${constraintLabel} for this message type but got "${attended}"`, 'ZU3_3_CONSTRAINT'))
  }

  // ZU3-5: Transport requirements — Y or N
  const transport = getField(segment, 5)
  if (!transport.trim()) {
    issues.push(error('ZU3', 'ZU3-5', 'Transport requirements (ZU3-5) is required but missing — use "Y" or "N"', 'ZU3_5_REQUIRED'))
  } else if (!VALID_YN.has(transport.trim())) {
    issues.push(error('ZU3', 'ZU3-5', `Transport requirements (ZU3-5) has invalid value "${transport}" — expected "Y" or "N"`, 'ZU3_5_INVALID'))
  }

  // ZU3-8: Appointment type
  const apptType = getField(segment, 8)
  if (!apptType.trim()) {
    issues.push(error('ZU3', 'ZU3-8', 'Appointment type (ZU3-8) is required but missing — expected 1=New, 2=Follow Up, 5=Pre-Assessment', 'ZU3_8_REQUIRED'))
  } else if (!VALID_APPOINTMENT_TYPE.has(apptType.trim())) {
    issues.push(error('ZU3', 'ZU3-8', `Appointment type (ZU3-8) has invalid value "${apptType}" — expected one of ${formatValidValues(VALID_APPOINTMENT_TYPE)} (1=New, 2=Follow Up, 5=Pre-Assessment)`, 'ZU3_8_INVALID'))
  }

  // ZU3-9: Appointment format / consultation mode
  const apptFormat = getField(segment, 9)
  if (!apptFormat.trim()) {
    issues.push(error('ZU3', 'ZU3-9', 'Appointment format (ZU3-9) is required but missing — expected 1=In person, 2=Video, 3=Telephone, 4=Digital review, 5=Walk in', 'ZU3_9_REQUIRED'))
  } else if (!VALID_APPOINTMENT_FORMAT.has(apptFormat.trim())) {
    issues.push(error('ZU3', 'ZU3-9', `Appointment format (ZU3-9) has invalid value "${apptFormat}" — expected one of ${formatValidValues(VALID_APPOINTMENT_FORMAT)} (1=In person, 2=Video, 3=Telephone, 4=Digital review, 5=Walk in)`, 'ZU3_9_INVALID'))
  }

  return issues
}
