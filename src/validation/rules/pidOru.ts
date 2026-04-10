import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'
import { validateHL7Date } from '../../utils/dateUtils'

/**
 * Simplified PID validator for ORU^R01 messages.
 * The ORU spec only mandates: PID-3.1, PID-3.5 (MRN), PID-5.1, PID-7.
 */
export function validatePIDOru(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // PID-3: Patient identifier list — must have at least one MRN
  const pid3Field = segment.fields[3]
  if (!pid3Field || pid3Field.length === 0 || (pid3Field.length === 1 && (pid3Field[0]?.[0]?.[0] ?? '') === '')) {
    issues.push(error('PID', 'PID-3', 'Patient identifier(s) (PID-3) are required but missing', 'PID_3_REQUIRED'))
  } else {
    let hasMRN = false
    for (let repIdx = 0; repIdx < pid3Field.length; repIdx++) {
      const rep = pid3Field[repIdx]
      if (!rep) continue
      const idValue   = rep[0]?.[0] ?? ''   // PID-3.1
      const idType    = rep[4]?.[0] ?? ''   // PID-3.5
      const repLabel  = pid3Field.length > 1 ? `[${repIdx + 1}]` : ''

      if (!idValue.trim()) {
        issues.push(error('PID', `PID-3${repLabel}.1`, `Patient ID value (PID-3${repLabel}.1) is required but missing`, 'PID_3_1_REQUIRED'))
      }
      if (!idType.trim()) {
        issues.push(error('PID', `PID-3${repLabel}.5`, `Identifier type code (PID-3${repLabel}.5) is required but missing`, 'PID_3_5_REQUIRED'))
      }
      if (idType.trim() === 'MRN') {
        hasMRN = true
      }
    }
    if (!hasMRN) {
      issues.push(error('PID', 'PID-3', 'At least one patient identifier with type "MRN" is required in PID-3', 'PID_3_MRN_REQUIRED'))
    }
  }

  // PID-5.1: Family name (surname) — required
  const surname = getComponent(segment, 5, 0)
  if (!surname.trim()) {
    issues.push(error('PID', 'PID-5.1', 'Family name / surname (PID-5.1) is required but missing', 'PID_5_1_REQUIRED'))
  }

  // PID-7: Date of birth — required, YYYYMMDD
  const dob = getField(segment, 7)
  if (!dob.trim()) {
    issues.push(error('PID', 'PID-7', 'Date of birth (PID-7) is required but missing', 'PID_7_REQUIRED'))
  } else {
    const dobError = validateHL7Date(dob.trim())
    if (dobError) {
      issues.push(error('PID', 'PID-7', `Date of birth (PID-7): ${dobError}`, 'PID_7_FORMAT'))
    }
  }

  return issues
}
