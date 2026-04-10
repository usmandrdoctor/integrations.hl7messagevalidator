import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'
import {
  VALID_RF1_STATUS,
  VALID_RF1_PRIORITY,
  VALID_RF1_CATEGORY,
  VALID_RF1_REASON,
} from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

export function validateRF1(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // RF1-1.1: Referral Status — required, A=Accepted, E=Expired, P=Pending, R=Rejected
  const rf11 = getComponent(segment, 1, 0)
  if (!rf11.trim()) {
    issues.push(error('RF1', 'RF1-1.1', `Referral status (RF1-1.1) is required but missing — expected one of ${formatValidValues(VALID_RF1_STATUS)} (A=Accepted, E=Expired, P=Pending, R=Rejected)`, 'RF1_1_REQUIRED'))
  } else if (!VALID_RF1_STATUS.has(rf11.trim())) {
    issues.push(error('RF1', 'RF1-1.1', `Referral status (RF1-1.1) has invalid value "${rf11.trim()}" — expected one of ${formatValidValues(VALID_RF1_STATUS)} (A=Accepted, E=Expired, P=Pending, R=Rejected)`, 'RF1_1_INVALID'))
  }

  // RF1-2.1: Referral Priority — optional, 1=Routine, 2=Urgent, 3=Two Week Wait
  const rf12 = getComponent(segment, 2, 0)
  if (rf12.trim() && !VALID_RF1_PRIORITY.has(rf12.trim())) {
    issues.push(error('RF1', 'RF1-2.1', `Referral priority (RF1-2.1) has invalid value "${rf12.trim()}" — expected one of ${formatValidValues(VALID_RF1_PRIORITY)} (1=Routine, 2=Urgent, 3=Two Week Wait)`, 'RF1_2_INVALID'))
  }

  // RF1-3.1: Referral Type / Specialty — required for E-Meet and Greet (EMAG)
  const rf13 = getComponent(segment, 3, 0)
  if (!rf13.trim()) {
    issues.push(error('RF1', 'RF1-3.1', 'Referral type / NHS specialty code (RF1-3.1) is required but missing — needed for E-Meet and Greet functionality', 'RF1_3_REQUIRED'))
  }

  // RF1-5.1: Referral Category — optional, A=Ambulatory, E=Emergency, I=Inpatient, O=Outpatient
  const rf15 = getComponent(segment, 5, 0)
  if (rf15.trim() && !VALID_RF1_CATEGORY.has(rf15.trim())) {
    issues.push(error('RF1', 'RF1-5.1', `Referral category (RF1-5.1) has invalid value "${rf15.trim()}" — expected one of ${formatValidValues(VALID_RF1_CATEGORY)} (A=Ambulatory, E=Emergency, I=Inpatient, O=Outpatient)`, 'RF1_5_INVALID'))
  }

  // RF1-6.3: Originating Referral Identifier — required
  // Component index 2 = component 3 (0-based)
  const rf163 = getComponent(segment, 6, 2)
  if (!rf163.trim()) {
    issues.push(error('RF1', 'RF1-6.3', 'Originating referral identifier (RF1-6.3) is required but missing', 'RF1_6_3_REQUIRED'))
  }

  // RF1-7.1: Effective Date — optional, YYYYMMDDHHMMSS
  const rf17 = getComponent(segment, 7, 0)
  if (rf17.trim()) {
    const dtError = validateHL7DateTime(rf17.trim())
    if (dtError) {
      issues.push(error('RF1', 'RF1-7.1', `Effective date (RF1-7.1): ${dtError}`, 'RF1_7_FORMAT'))
    }
  }

  // RF1-8.1: Expiration Date — required, YYYYMMDDHHMMSS (may represent RTT breach date)
  const rf18 = getComponent(segment, 8, 0)
  if (!rf18.trim()) {
    issues.push(error('RF1', 'RF1-8.1', 'Expiration / RTT breach date (RF1-8.1) is required but missing', 'RF1_8_REQUIRED'))
  } else {
    const dtError = validateHL7DateTime(rf18.trim())
    if (dtError) {
      issues.push(error('RF1', 'RF1-8.1', `Expiration date (RF1-8.1): ${dtError}`, 'RF1_8_FORMAT'))
    }
  }

  // RF1-9.1: Process Date — optional, YYYYMMDDHHMMSS
  const rf19 = getComponent(segment, 9, 0)
  if (rf19.trim()) {
    const dtError = validateHL7DateTime(rf19.trim())
    if (dtError) {
      issues.push(error('RF1', 'RF1-9.1', `Process date (RF1-9.1): ${dtError}`, 'RF1_9_FORMAT'))
    }
  }

  // RF1-10.1: Referral Reason — optional, 01=Transfer, 02=Opinion, 03=Diagnostic, 04=New Referral
  const rf1101 = getComponent(segment, 10, 0)
  if (rf1101.trim() && !VALID_RF1_REASON.has(rf1101.trim())) {
    issues.push(error('RF1', 'RF1-10.1', `Referral reason (RF1-10.1) has invalid value "${rf1101.trim()}" — expected one of ${formatValidValues(VALID_RF1_REASON)} (01=Transfer, 02=Opinion, 03=Diagnostic, 04=New Referral)`, 'RF1_10_INVALID'))
  }

  // RF1-11.3: Referral External Identifier — required
  // Component index 2 = component 3 (0-based)
  const rf1113 = getComponent(segment, 11, 2)
  if (!rf1113.trim()) {
    issues.push(error('RF1', 'RF1-11.3', 'Referral external identifier (RF1-11.3) is required but missing', 'RF1_11_3_REQUIRED'))
  }

  return issues
}
