import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { requireField, collect, error } from '../helpers'
import { VALID_YN } from '../../constants/referenceData'

export function validateZU1(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // ZU1-1: Translation required — Y or N
  const translation = getField(segment, 1)
  if (!translation.trim()) {
    issues.push(error('ZU1', 'ZU1-1', 'Translation required flag (ZU1-1) is required but missing — use "Y" or "N"', 'ZU1_1_REQUIRED'))
  } else if (!VALID_YN.has(translation.trim())) {
    issues.push(error('ZU1', 'ZU1-1', `Translation required flag (ZU1-1) has invalid value "${translation}" — expected "Y" or "N"`, 'ZU1_1_INVALID'))
  }

  // ZU1-13: Source of referral
  issues.push(...collect(requireField(segment, 13, 'ZU1-13', 'Source of referral (ZU1-13)', 'ZU1_13_REQUIRED')))

  return issues
}
