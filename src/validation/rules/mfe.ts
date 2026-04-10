import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error } from '../helpers'
import { VALID_MFE_EVENT_CODES } from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

const MFE_5_EXPECTED = 'CE'

export function validateMFE(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // MFE-1: Record-level Event Code — MUP/MAD (add/update), MDL/MDC (archive), MAC (unarchive)
  const mfe1 = getField(segment, 1)
  if (!mfe1.trim()) {
    issues.push(error('MFE', 'MFE-1', `Record-level event code (MFE-1) is required but missing — expected one of ${formatValidValues(VALID_MFE_EVENT_CODES)}`, 'MFE_1_REQUIRED'))
  } else if (!VALID_MFE_EVENT_CODES.has(mfe1.trim())) {
    issues.push(error('MFE', 'MFE-1', `Record-level event code (MFE-1) has invalid value "${mfe1.trim()}" — expected one of ${formatValidValues(VALID_MFE_EVENT_CODES)} (MUP/MAD=add/update, MDL/MDC=archive, MAC=unarchive)`, 'MFE_1_INVALID'))
  }

  // MFE-4: Primary Key Value — the DrDoctor clinic code (required)
  const mfe4 = getField(segment, 4)
  if (!mfe4.trim()) {
    issues.push(error('MFE', 'MFE-4', 'Primary key / clinic code (MFE-4) is required but missing', 'MFE_4_REQUIRED'))
  }

  // MFE-5: Primary Key Value Type — must be "CE"
  const mfe5 = getField(segment, 5)
  if (!mfe5.trim()) {
    issues.push(error('MFE', 'MFE-5', 'Primary key value type (MFE-5) is required but missing — expected "CE"', 'MFE_5_REQUIRED'))
  } else if (mfe5.trim() !== MFE_5_EXPECTED) {
    issues.push(error('MFE', 'MFE-5', `Primary key value type (MFE-5) must be "CE" (coded element) but got "${mfe5.trim()}"`, 'MFE_5_INVALID'))
  }

  return issues
}
