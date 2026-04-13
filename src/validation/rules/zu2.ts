import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'
import {
  VALID_REFERRAL_STATUS,
  VALID_REFERRAL_PRIORITY,
  VALID_REFERRAL_CATEGORY,
  VALID_REFERRAL_REASON,
} from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

export function validateZU2(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // ZU2 is optional — only validate if present (called only when segment exists)

  // ZU2-1.1: Referral Status — required, A/E/P/R
  const refStatus = getComponent(segment, 1, 0)
  if (!refStatus.trim()) {
    issues.push(error('ZU2', 'ZU2-1.1', 'Referral status (ZU2-1.1) is required — expected one of A (Accepted), E (Expired), P (Pending), R (Rejected)', 'ZU2_1_REQUIRED'))
  } else if (!VALID_REFERRAL_STATUS.has(refStatus.trim())) {
    issues.push(error('ZU2', 'ZU2-1.1', `Referral status (ZU2-1.1) has invalid value "${refStatus}" — expected one of ${formatValidValues(VALID_REFERRAL_STATUS)}`, 'ZU2_1_INVALID'))
  }

  // ZU2-2.1: Referral Priority — optional, but if present must be 1/2/3
  const refPriority = getComponent(segment, 2, 0)
  if (refPriority.trim() && !VALID_REFERRAL_PRIORITY.has(refPriority.trim())) {
    issues.push(error('ZU2', 'ZU2-2.1', `Referral priority (ZU2-2.1) has invalid value "${refPriority}" — expected one of ${formatValidValues(VALID_REFERRAL_PRIORITY)} (1=Routine, 2=Urgent, 3=Two Week Wait)`, 'ZU2_2_INVALID'))
  }

  // ZU2-5.1: Referral Category — optional, but if present must be A/E/I/O
  const refCategory = getComponent(segment, 5, 0)
  if (refCategory.trim() && !VALID_REFERRAL_CATEGORY.has(refCategory.trim())) {
    issues.push(error('ZU2', 'ZU2-5.1', `Referral category (ZU2-5.1) has invalid value "${refCategory}" — expected one of ${formatValidValues(VALID_REFERRAL_CATEGORY)} (A=Ambulatory, E=Emergency, I=Inpatient, O=Outpatient)`, 'ZU2_5_INVALID'))
  }

  // ZU2-7.1: Effective Date — optional, but if present must be valid datetime
  const effectiveDate = getComponent(segment, 7, 0)
  if (effectiveDate.trim()) {
    const dtError = validateHL7DateTime(effectiveDate.trim())
    if (dtError) {
      issues.push(error('ZU2', 'ZU2-7.1', `Effective date (ZU2-7.1): ${dtError}`, 'ZU2_7_FORMAT'))
    }
  }

  // ZU2-8.1: Expiration Date — required, YYYYMMDDHHMMSS
  const expDate = getComponent(segment, 8, 0)
  if (!expDate.trim()) {
    issues.push(error('ZU2', 'ZU2-8.1', 'Expiration date (ZU2-8.1) is required but missing', 'ZU2_8_REQUIRED'))
  } else {
    const dtError = validateHL7DateTime(expDate.trim())
    if (dtError) {
      issues.push(error('ZU2', 'ZU2-8.1', `Expiration date (ZU2-8.1): ${dtError}`, 'ZU2_8_FORMAT'))
    }
  }

  // ZU2-9.1: Process Date — optional, but if present must be valid datetime
  const processDate = getComponent(segment, 9, 0)
  if (processDate.trim()) {
    const dtError = validateHL7DateTime(processDate.trim())
    if (dtError) {
      issues.push(error('ZU2', 'ZU2-9.1', `Process date (ZU2-9.1): ${dtError}`, 'ZU2_9_FORMAT'))
    }
  }

  // ZU2-10.1: Referral Reason — optional, but if present must be 01/02/03/04
  const refReason = getComponent(segment, 10, 0)
  if (refReason.trim() && !VALID_REFERRAL_REASON.has(refReason.trim())) {
    issues.push(error('ZU2', 'ZU2-10.1', `Referral reason (ZU2-10.1) has invalid value "${refReason}" — expected one of ${formatValidValues(VALID_REFERRAL_REASON)} (01=Transfer, 02=Opinion, 03=Diagnostic, 04=New Referral)`, 'ZU2_10_INVALID'))
  }

  // ZU2-11.3: Referral External Identifier — required
  const extId = getComponent(segment, 11, 2)
  if (!extId.trim()) {
    issues.push(error('ZU2', 'ZU2-11.3', 'Referral external identifier (ZU2-11.3) is required but missing', 'ZU2_11_REQUIRED'))
  }

  return issues
}
