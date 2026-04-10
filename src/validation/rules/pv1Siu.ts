import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { requireField, collect, error, warning } from '../helpers'
import { VALID_YN } from '../../constants/referenceData'

/**
 * SIU-specific PV1 validator.
 * Key differences from ADT PV1:
 * - PV1-3 (clinic location) is NOT used — clinic info comes from ZBX
 * - PV1-15 (transport) IS required (Y/N)
 * - PV1-19 (visit number) is NOT used in SIU
 */
export function validatePV1Siu(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // PV1-1: Set ID — fixed value "1"
  const setId = getField(segment, 1)
  if (!setId.trim()) {
    issues.push(error('PV1', 'PV1-1', 'Set ID (PV1-1) is required — expected fixed value "1"', 'PV1_1_REQUIRED'))
  } else if (setId.trim() !== '1') {
    issues.push(warning('PV1', 'PV1-1', `Set ID (PV1-1) should be "1" but got "${setId}"`, 'PV1_1_VALUE'))
  }

  // PV1-2: Patient class — optional, but if present should be "O"
  const patientClass = getField(segment, 2)
  if (patientClass.trim() && patientClass.trim() !== 'O') {
    issues.push(warning('PV1', 'PV1-2', `Patient class (PV1-2) should be "O" (outpatient) but got "${patientClass}" — DrDoctor only processes outpatient messages`, 'PV1_2_OUTPATIENT'))
  }

  // PV1-9: Consulting Doctor — optional, but if present sub-fields are required
  const consultantId = getComponent(segment, 9, 0)
  const consultantFamily = getComponent(segment, 9, 1)
  const consultantFirst = getComponent(segment, 9, 2)

  if (consultantId.trim() || consultantFamily.trim() || consultantFirst.trim()) {
    if (!consultantId.trim()) {
      issues.push(error('PV1', 'PV1-9.1', 'Consultant ID (PV1-9.1) is required when PV1-9 is present', 'PV1_9_1_REQUIRED'))
    }
    if (!consultantFamily.trim()) {
      issues.push(error('PV1', 'PV1-9.2', 'Consultant family name (PV1-9.2) is required when PV1-9 is present', 'PV1_9_2_REQUIRED'))
    }
    if (!consultantFirst.trim()) {
      issues.push(error('PV1', 'PV1-9.3', 'Consultant first name (PV1-9.3) is required when PV1-9 is present', 'PV1_9_3_REQUIRED'))
    }
  }

  // PV1-10: Specialty — required
  issues.push(...collect(requireField(segment, 10, 'PV1-10', 'Specialty code (PV1-10)', 'PV1_10_REQUIRED')))

  // PV1-15: Ambulatory Status / Transport requirements — required for SIU (Y or N)
  const transport = getField(segment, 15)
  if (!transport.trim()) {
    issues.push(error('PV1', 'PV1-15', 'Transport requirements (PV1-15) is required for SIU messages but missing — use "Y" or "N"', 'PV1_15_REQUIRED'))
  } else if (!VALID_YN.has(transport.trim())) {
    issues.push(error('PV1', 'PV1-15', `Transport requirements (PV1-15) has invalid value "${transport}" — expected "Y" or "N"`, 'PV1_15_INVALID'))
  }

  // PV1-3 (clinic location) and PV1-19 (visit number) are NOT used in SIU — no validation

  return issues
}
