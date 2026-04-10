import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7DateTime } from '../../utils/dateUtils'
import { VALID_REFERRAL_STATUS } from '../../constants/referenceData'
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

  // ZU2-11.3: Referral External Identifier — required
  const extId = getComponent(segment, 11, 2)
  if (!extId.trim()) {
    issues.push(error('ZU2', 'ZU2-11.3', 'Referral external identifier (ZU2-11.3) is required but missing', 'ZU2_11_REQUIRED'))
  }

  return issues
}
