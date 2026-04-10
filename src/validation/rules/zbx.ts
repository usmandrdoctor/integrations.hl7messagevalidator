import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error, warning } from '../helpers'

export function validateZBX(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // ZBX-1: Set ID — fixed value "1"
  const zbx1 = getField(segment, 1)
  if (!zbx1.trim()) {
    issues.push(error('ZBX', 'ZBX-1', 'Set ID (ZBX-1) is required — expected fixed value "1"', 'ZBX_1_REQUIRED'))
  } else if (zbx1.trim() !== '1') {
    issues.push(warning('ZBX', 'ZBX-1', `Set ID (ZBX-1) should be "1" but got "${zbx1}"`, 'ZBX_1_VALUE'))
  }

  // ZBX-2: Value Type — fixed value "CE"
  const zbx2 = getField(segment, 2)
  if (!zbx2.trim()) {
    issues.push(error('ZBX', 'ZBX-2', 'Value type (ZBX-2) is required — expected fixed value "CE"', 'ZBX_2_REQUIRED'))
  } else if (zbx2.trim() !== 'CE') {
    issues.push(warning('ZBX', 'ZBX-2', `Value type (ZBX-2) should be "CE" but got "${zbx2}"`, 'ZBX_2_VALUE'))
  }

  // ZBX-3: ZBX Segment Identifier — fixed value "CLINIC_CODE_INFO"
  const zbx3 = getField(segment, 3)
  if (!zbx3.trim()) {
    issues.push(error('ZBX', 'ZBX-3', 'Segment identifier (ZBX-3) is required — expected fixed value "CLINIC_CODE_INFO"', 'ZBX_3_REQUIRED'))
  } else if (zbx3.trim() !== 'CLINIC_CODE_INFO') {
    issues.push(warning('ZBX', 'ZBX-3', `Segment identifier (ZBX-3) should be "CLINIC_CODE_INFO" but got "${zbx3}"`, 'ZBX_3_VALUE'))
  }

  // ZBX-5.1: Clinic Code — required, max 100 chars
  const clinicCode = getComponent(segment, 5, 0)
  if (!clinicCode.trim()) {
    issues.push(error('ZBX', 'ZBX-5.1', 'Clinic code (ZBX-5.1) is required but missing', 'ZBX_5_1_REQUIRED'))
  } else if (clinicCode.length > 100) {
    issues.push(warning('ZBX', 'ZBX-5.1', `Clinic code (ZBX-5.1) exceeds 100 character limit (${clinicCode.length} chars)`, 'ZBX_5_1_LENGTH'))
  }

  // ZBX-5.2: Clinic Description — optional, max 250 chars
  const clinicDesc = getComponent(segment, 5, 1)
  if (clinicDesc.trim() && clinicDesc.length > 250) {
    issues.push(warning('ZBX', 'ZBX-5.2', `Clinic description (ZBX-5.2) exceeds 250 character limit (${clinicDesc.length} chars)`, 'ZBX_5_2_LENGTH'))
  }

  return issues
}
