import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { requireField, collect } from '../helpers'

export function validateMRG(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  // MRG-1: Prior patient identifier list (secondary patient ID)
  return collect(
    requireField(segment, 1, 'MRG-1', 'Prior patient identifier (MRG-1)', 'MRG_1_REQUIRED')
  )
}
