import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField } from '../../parser/segmentParser'
import { error } from '../helpers'
import { VALID_OBX_VALUE_TYPES } from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

// OBX-11 fixed value
const OBX_11_RESULT_STATUS = 'F'

export function validateOBX(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // OBX-1: Set ID — sequential identifier (required)
  const obx1 = getField(segment, 1)
  if (!obx1.trim()) {
    issues.push(error('OBX', 'OBX-1', 'Set ID (OBX-1) is required but missing', 'OBX_1_REQUIRED'))
  }

  // OBX-2: Value type — ST (string) or NM (numeric) (required)
  const obx2 = getField(segment, 2)
  if (!obx2.trim()) {
    issues.push(error('OBX', 'OBX-2', 'Value type (OBX-2) is required but missing — expected ST (string) or NM (numeric)', 'OBX_2_REQUIRED'))
  } else if (!VALID_OBX_VALUE_TYPES.has(obx2.trim())) {
    issues.push(error('OBX', 'OBX-2', `Value type (OBX-2) has invalid value "${obx2.trim()}" — expected one of ${formatValidValues(VALID_OBX_VALUE_TYPES)} (ST=String, NM=Numeric, ED=Encapsulated Data)`, 'OBX_2_INVALID'))
  }

  // OBX-3: Observation identifier — question text (required)
  const obx3 = getField(segment, 3)
  if (!obx3.trim()) {
    issues.push(error('OBX', 'OBX-3', 'Observation identifier / question (OBX-3) is required but missing', 'OBX_3_REQUIRED'))
  }

  // OBX-5: Observation value — answer/response (required)
  const obx5 = getField(segment, 5)
  if (!obx5.trim()) {
    issues.push(error('OBX', 'OBX-5', 'Observation value / answer (OBX-5) is required but missing', 'OBX_5_REQUIRED'))
  }

  // OBX-11: Observation result status — required, fixed "F"
  const obx11 = getField(segment, 11)
  if (!obx11.trim()) {
    issues.push(error('OBX', 'OBX-11', 'Observation result status (OBX-11) is required but missing — expected "F" (Final)', 'OBX_11_REQUIRED'))
  } else if (obx11.trim() !== OBX_11_RESULT_STATUS) {
    issues.push(error('OBX', 'OBX-11', `Observation result status (OBX-11) must be "F" (Final) but got "${obx11.trim()}"`, 'OBX_11_INVALID'))
  }

  return issues
}
