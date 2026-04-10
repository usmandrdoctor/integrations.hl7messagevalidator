import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'
import {
  VALID_SCH25_ATTENDANCE,
  VALID_APPOINTMENT_TYPE,
  VALID_APPOINTMENT_FORMAT,
  VALID_PRIORITY_CODES,
} from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

export function validateSCH(
  segment: ParsedSegment,
  context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // SCH-1: Placer Appointment ID — required (unique appointment ID)
  const sch1 = getField(segment, 1)
  if (!sch1.trim()) {
    issues.push(error('SCH', 'SCH-1', 'Placer appointment ID (SCH-1) is required but missing', 'SCH_1_REQUIRED'))
  }

  // SCH-8: Appointment Type — 1=New, 2=Follow Up, 5=Pre-Assessment
  const sch8 = getField(segment, 8)
  if (!sch8.trim()) {
    issues.push(error('SCH', 'SCH-8', 'Appointment type (SCH-8) is required but missing — expected 1=New, 2=Follow Up, 5=Pre-Assessment', 'SCH_8_REQUIRED'))
  } else if (!VALID_APPOINTMENT_TYPE.has(sch8.trim())) {
    issues.push(error('SCH', 'SCH-8', `Appointment type (SCH-8) has invalid value "${sch8}" — expected one of ${formatValidValues(VALID_APPOINTMENT_TYPE)} (1=New, 2=Follow Up, 5=Pre-Assessment)`, 'SCH_8_INVALID'))
  }

  // SCH-11.4: Start Date/Time — required, YYYYMMDDHHMMSS
  // SCH-11 is a repeating field; timing quantity is a composite field
  // Component index 3 = 4th component (0-based) = SCH-11.4
  const sch114 = getComponent(segment, 11, 3)
  if (!sch114.trim()) {
    issues.push(error('SCH', 'SCH-11.4', 'Appointment start date/time (SCH-11.4) is required but missing', 'SCH_11_4_REQUIRED'))
  } else {
    const dtError = validateHL7DateTime(sch114.trim())
    if (dtError) {
      issues.push(error('SCH', 'SCH-11.4', `Appointment start date/time (SCH-11.4): ${dtError}`, 'SCH_11_4_FORMAT'))
    }
  }

  // SCH-11.6: Appointment Priority — 1=Routine, 3=Urgent, 4=Two Week Wait
  const sch116 = getComponent(segment, 11, 5)
  if (!sch116.trim()) {
    issues.push(error('SCH', 'SCH-11.6', 'Appointment priority (SCH-11.6) is required but missing — expected 1=Routine, 3=Urgent, 4=Two Week Wait', 'SCH_11_6_REQUIRED'))
  } else if (!VALID_PRIORITY_CODES.has(sch116.trim())) {
    issues.push(error('SCH', 'SCH-11.6', `Appointment priority (SCH-11.6) has invalid value "${sch116}" — expected one of ${formatValidValues(VALID_PRIORITY_CODES)} (1=Routine, 3=Urgent, 4=Two Week Wait)`, 'SCH_11_6_INVALID'))
  }

  // SCH-11.8: Appointment Format — 1=In person, 2=Video, 3=Telephone, 4=Digital review, 5=Walk in
  const sch118 = getComponent(segment, 11, 7)
  if (!sch118.trim()) {
    issues.push(error('SCH', 'SCH-11.8', 'Appointment format (SCH-11.8) is required but missing — expected 1=In person, 2=Video, 3=Telephone, 4=Digital review, 5=Walk in', 'SCH_11_8_REQUIRED'))
  } else if (!VALID_APPOINTMENT_FORMAT.has(sch118.trim())) {
    issues.push(error('SCH', 'SCH-11.8', `Appointment format (SCH-11.8) has invalid value "${sch118}" — expected one of ${formatValidValues(VALID_APPOINTMENT_FORMAT)} (1=In person, 2=Video, 3=Telephone, 4=Digital review, 5=Walk in)`, 'SCH_11_8_INVALID'))
  }

  // SCH-25: Attendance Status
  const sch25 = getField(segment, 25)
  if (!sch25.trim()) {
    issues.push(error('SCH', 'SCH-25', 'Attendance status (SCH-25) is required but missing', 'SCH_25_REQUIRED'))
  } else if (!VALID_SCH25_ATTENDANCE.has(sch25.trim())) {
    issues.push(error('SCH', 'SCH-25', `Attendance status (SCH-25) has invalid value "${sch25}" — expected one of ${formatValidValues(VALID_SCH25_ATTENDANCE)} (1=Booked, 2=Not Booked, 3=Attended, 4=Cancelled, 5=DNA, 6=Other)`, 'SCH_25_INVALID'))
  } else if (context.sch25Constraint && sch25.trim() !== context.sch25Constraint) {
    const labels: Record<string, string> = {
      '1': '"1" (Booked)', '3': '"3" (Attended)', '4': '"4" (Cancelled)', '5': '"5" (DNA)',
    }
    const constraintLabel = labels[context.sch25Constraint] ?? `"${context.sch25Constraint}"`
    issues.push(error('SCH', 'SCH-25', `Attendance status (SCH-25) must be ${constraintLabel} for this message type but got "${sch25}"`, 'SCH_25_CONSTRAINT'))
  }

  return issues
}
