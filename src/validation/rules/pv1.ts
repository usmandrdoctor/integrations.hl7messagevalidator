import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { requireField, collect, error, warning } from '../helpers'

export function validatePV1(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // PV1-1: Set ID — must be "1"
  const setId = getField(segment, 1)
  if (!setId.trim()) {
    issues.push(error('PV1', 'PV1-1', 'Set ID (PV1-1) is required — expected fixed value "1"', 'PV1_1_REQUIRED'))
  } else if (setId.trim() !== '1') {
    issues.push(warning('PV1', 'PV1-1', `Set ID (PV1-1) should be "1" but got "${setId}"`, 'PV1_1_VALUE'))
  }

  // PV1-2: Patient class — optional, but if present should be "O" for outpatients
  const patientClass = getField(segment, 2)
  if (patientClass.trim() && patientClass.trim() !== 'O') {
    issues.push(warning('PV1', 'PV1-2', `Patient class (PV1-2) should be "O" (outpatient) but got "${patientClass}" — DrDoctor only processes outpatient messages`, 'PV1_2_OUTPATIENT'))
  }

  // PV1-3.1: Clinic code (Locality)
  const clinicCode = getComponent(segment, 3, 0)
  if (!clinicCode.trim()) {
    issues.push(error('PV1', 'PV1-3.1', 'Clinic code (PV1-3.1) is required but missing', 'PV1_3_1_REQUIRED'))
  } else if (clinicCode.length > 100) {
    issues.push(warning('PV1', 'PV1-3.1', `Clinic code (PV1-3.1) exceeds 100 character limit (${clinicCode.length} chars)`, 'PV1_3_1_LENGTH'))
  }

  // PV1-3.9: Clinic description
  const clinicDesc = getComponent(segment, 3, 8)
  if (!clinicDesc.trim()) {
    issues.push(error('PV1', 'PV1-3.9', 'Clinic description (PV1-3.9) is required but missing', 'PV1_3_9_REQUIRED'))
  } else if (clinicDesc.length > 250) {
    issues.push(warning('PV1', 'PV1-3.9', `Clinic description (PV1-3.9) exceeds 250 character limit (${clinicDesc.length} chars)`, 'PV1_3_9_LENGTH'))
  }

  // PV1-9: Consulting Doctor — optional, but if present sub-fields are required
  const consultantId = getComponent(segment, 9, 0)
  const consultantFamily = getComponent(segment, 9, 1)
  const consultantFirst = getComponent(segment, 9, 2)

  if (consultantId.trim() || consultantFamily.trim() || consultantFirst.trim()) {
    // PV1-9 is present — all three sub-fields must be populated
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

  // PV1-10: Specialty (NHS standard specialty codes)
  issues.push(...collect(requireField(segment, 10, 'PV1-10', 'Specialty code (PV1-10)', 'PV1_10_REQUIRED')))

  // PV1-19: Visit Number (unique appointment ID) — required for ADT
  issues.push(...collect(requireField(segment, 19, 'PV1-19', 'Visit number / appointment ID (PV1-19)', 'PV1_19_REQUIRED')))

  return issues
}
