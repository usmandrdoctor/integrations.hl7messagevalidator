import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue, ValidationContext } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { requireComponent, collect, error, warning } from '../helpers'
import { validateHL7Date } from '../../utils/dateUtils'
import {
  VALID_SEX_CODES,
  REQUIRED_ADDRESS_TYPE,
  VALID_IDENTIFIER_TYPES,
} from '../../constants/referenceData'
import { formatValidValues } from '../../utils/formatUtils'

export function validatePID(
  segment: ParsedSegment,
  _context: ValidationContext
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // PID-3: Patient identifiers — MRN is mandatory
  issues.push(...validatePID3(segment))

  // PID-5: Patient name
  issues.push(...collect(
    requireComponent(segment, 5, 1, 'PID-5.1', 'Family name (PID-5.1)', 'PID_5_1_REQUIRED'),
    requireComponent(segment, 5, 2, 'PID-5.2', 'Given name (PID-5.2)', 'PID_5_2_REQUIRED'),
    requireComponent(segment, 5, 5, 'PID-5.5', 'Name prefix/title (PID-5.5)', 'PID_5_5_REQUIRED'),
  ))

  // PID-7: Date of birth
  const dob = getField(segment, 7)
  if (!dob.trim()) {
    issues.push(error('PID', 'PID-7', 'Date of birth (PID-7) is required but missing', 'PID_7_REQUIRED'))
  } else {
    const dobError = validateHL7Date(dob.trim())
    if (dobError) {
      issues.push(error('PID', 'PID-7', `Date of birth (PID-7): ${dobError}`, 'PID_7_FORMAT'))
    }
  }

  // PID-8: Sex
  const sex = getField(segment, 8)
  if (!sex.trim()) {
    issues.push(error('PID', 'PID-8', 'Sex (PID-8) is required but missing', 'PID_8_REQUIRED'))
  } else if (!VALID_SEX_CODES.has(sex.trim())) {
    issues.push(error('PID', 'PID-8', `Sex (PID-8) has invalid value "${sex}" — expected one of ${formatValidValues(VALID_SEX_CODES)} (0=Not known, 1=Male, 2=Female, 9=Not specified)`, 'PID_8_INVALID'))
  }

  // PID-11: Address
  issues.push(...validatePID11(segment))

  // PID-29: Patient death date (optional)
  const deathDate = getField(segment, 29)
  if (deathDate.trim()) {
    const deathError = validateHL7Date(deathDate.trim())
    if (deathError) {
      issues.push(error('PID', 'PID-29', `Patient death date (PID-29): ${deathError}`, 'PID_29_FORMAT'))
    }
  }

  return issues
}

function validatePID3(segment: ParsedSegment): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const field = segment.fields[3]

  if (!field || field.length === 0 || (field.length === 1 && (field[0]?.[0]?.[0] ?? '') === '')) {
    issues.push(error('PID', 'PID-3', 'Patient identifier(s) (PID-3) are required but missing', 'PID_3_REQUIRED'))
    return issues
  }

  let hasMRN = false

  for (let repIdx = 0; repIdx < field.length; repIdx++) {
    const rep = field[repIdx]
    if (!rep) continue

    const idValue = rep[0]?.[0] ?? ''         // PID-3.1
    const assigningAuth = rep[3]?.[0] ?? ''   // PID-3.4
    const idTypeCode = rep[4]?.[0] ?? ''      // PID-3.5
    const repLabel = field.length > 1 ? `[${repIdx + 1}]` : ''

    if (!idValue.trim()) {
      issues.push(error('PID', `PID-3${repLabel}.1`, `Patient ID value (PID-3${repLabel}.1) is required but missing`, 'PID_3_1_REQUIRED'))
    }

    if (!idTypeCode.trim()) {
      issues.push(error('PID', `PID-3${repLabel}.5`, `Identifier type code (PID-3${repLabel}.5) is required but missing`, 'PID_3_5_REQUIRED'))
    } else if (!VALID_IDENTIFIER_TYPES.has(idTypeCode.trim())) {
      issues.push(error('PID', `PID-3${repLabel}.5`, `Identifier type code (PID-3${repLabel}.5) has invalid value "${idTypeCode}" — expected "MRN" or "NHS"`, 'PID_3_5_INVALID'))
    }

    // Assigning authority is only required for MRN repeats (per spec: "For local MRN, use Client Code from MSH-4")
    if (idTypeCode.trim() === 'MRN') {
      hasMRN = true
      if (!assigningAuth.trim()) {
        issues.push(error('PID', `PID-3${repLabel}.4`, `Assigning authority (PID-3${repLabel}.4) is required for MRN identifiers but missing`, 'PID_3_4_REQUIRED'))
      }
    }
  }

  if (!hasMRN) {
    issues.push(error('PID', 'PID-3', 'At least one patient identifier with type "MRN" is required in PID-3', 'PID_3_MRN_REQUIRED'))
  }

  return issues
}

function validatePID11(segment: ParsedSegment): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const street = getComponent(segment, 11, 0)   // PID-11.1
  const postCode = getComponent(segment, 11, 4)  // PID-11.5
  const addrType = getComponent(segment, 11, 6)  // PID-11.7

  if (!street.trim()) {
    issues.push(error('PID', 'PID-11.1', 'Street address (PID-11.1) is required but missing', 'PID_11_1_REQUIRED'))
  }

  if (!postCode.trim()) {
    issues.push(error('PID', 'PID-11.5', 'Postal code (PID-11.5) is required but missing', 'PID_11_5_REQUIRED'))
  }

  if (!addrType.trim()) {
    issues.push(error('PID', 'PID-11.7', 'Address type (PID-11.7) is required but missing', 'PID_11_7_REQUIRED'))
  } else if (addrType.trim() !== REQUIRED_ADDRESS_TYPE) {
    issues.push(warning('PID', 'PID-11.7', `Address type (PID-11.7) should be "HOME" but got "${addrType}" — DrDoctor processes the HOME address only`, 'PID_11_7_HOME'))
  }

  return issues
}
