import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error } from '../helpers'

const MFI_1_EXPECTED = 'CLN'
const MFI_3_EXPECTED = 'UPD'

export function validateMFI(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // MFI-1: Master File Identifier — must be "CLN"
  const mfi1 = getField(segment, 1)
  if (!mfi1.trim()) {
    issues.push(error('MFI', 'MFI-1', 'Master file identifier (MFI-1) is required but missing — expected "CLN"', 'MFI_1_REQUIRED'))
  } else if (mfi1.trim() !== MFI_1_EXPECTED) {
    issues.push(error('MFI', 'MFI-1', `Master file identifier (MFI-1) must be "CLN" but got "${mfi1.trim()}"`, 'MFI_1_INVALID'))
  }

  // MFI-3: File-level Event Code — must be "UPD"
  const mfi3 = getField(segment, 3)
  if (!mfi3.trim()) {
    issues.push(error('MFI', 'MFI-3', 'File-level event code (MFI-3) is required but missing — expected "UPD"', 'MFI_3_REQUIRED'))
  } else if (mfi3.trim() !== MFI_3_EXPECTED) {
    issues.push(error('MFI', 'MFI-3', `File-level event code (MFI-3) must be "UPD" but got "${mfi3.trim()}"`, 'MFI_3_INVALID'))
  }

  return issues
}
