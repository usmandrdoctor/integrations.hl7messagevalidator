import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error, warning } from '../helpers'

export function validateAIP(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // AIP-1: Set ID — fixed value "1"
  const aip1 = getField(segment, 1)
  if (!aip1.trim()) {
    issues.push(error('AIP', 'AIP-1', 'Set ID (AIP-1) is required — expected fixed value "1"', 'AIP_1_REQUIRED'))
  } else if (aip1.trim() !== '1') {
    issues.push(warning('AIP', 'AIP-1', `Set ID (AIP-1) should be "1" but got "${aip1}"`, 'AIP_1_VALUE'))
  }

  // AIP-3.1: Personnel Resource ID Number — required
  const idNumber = getComponent(segment, 3, 0)
  if (!idNumber.trim()) {
    issues.push(error('AIP', 'AIP-3.1', 'Personnel resource ID (AIP-3.1) is required but missing', 'AIP_3_1_REQUIRED'))
  }

  // AIP-3.2: Family Name — required
  const familyName = getComponent(segment, 3, 1)
  if (!familyName.trim()) {
    issues.push(error('AIP', 'AIP-3.2', 'Personnel resource family name (AIP-3.2) is required but missing', 'AIP_3_2_REQUIRED'))
  }

  // AIP-3.3: First Name — required
  const firstName = getComponent(segment, 3, 2)
  if (!firstName.trim()) {
    issues.push(error('AIP', 'AIP-3.3', 'Personnel resource first name (AIP-3.3) is required but missing', 'AIP_3_3_REQUIRED'))
  }

  // AIP-3.6: Title — optional, no validation needed

  return issues
}
