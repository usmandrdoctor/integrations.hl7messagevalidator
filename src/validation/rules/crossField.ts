import type { ParsedHL7Message } from '../../types/hl7'
import type { ValidationIssue } from '../../types/validation'
import { getField, getComponent } from '../../parser/segmentParser'
import { error } from '../helpers'

export function validateCrossFields(message: ParsedHL7Message): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const msh = message.segments.get('MSH')?.[0]
  const evn = message.segments.get('EVN')?.[0]
  const pid = message.segments.get('PID')?.[0]
  const pv1 = message.segments.get('PV1')?.[0]
  const pv2 = message.segments.get('PV2')?.[0]

  if (!msh) return issues

  const msh3 = getField(msh, 3)        // Sending application
  const msh4 = getField(msh, 4)        // Sending facility (Client Code)
  const msh5 = getField(msh, 5)        // Receiving application
  const msh6 = getField(msh, 6)        // Receiving facility
  const msh7 = getField(msh, 7)        // Date/time
  const msh92 = getComponent(msh, 9, 1) // Trigger event

  // Rule: MSH-6 must equal MSH-5 + "." + MSH-3
  if (msh3.trim() && msh5.trim() && msh6.trim()) {
    const expected = `${msh5.trim()}.${msh3.trim()}`
    if (msh6.trim() !== expected) {
      issues.push(error(
        'MSH',
        'MSH-6',
        `Receiving facility (MSH-6) should be "${expected}" (MSH-5 + "." + MSH-3) but got "${msh6.trim()}"`,
        'MSH_6_CROSS_FIELD'
      ))
    }
  }

  // Rule: EVN-1 must equal MSH-9.2
  if (evn && msh92.trim()) {
    const evn1 = getField(evn, 1)
    if (evn1.trim() && evn1.trim() !== msh92.trim()) {
      issues.push(error(
        'EVN',
        'EVN-1',
        `Event type code (EVN-1) should match trigger event (MSH-9.2) — expected "${msh92.trim()}" but got "${evn1.trim()}"`,
        'EVN_1_CROSS_FIELD'
      ))
    }
  }

  // Rule: EVN-2 must equal MSH-7 (normalise by comparing first 14 chars)
  if (evn && msh7.trim()) {
    const evn2 = getField(evn, 2)
    if (evn2.trim()) {
      const msh7Norm = msh7.trim().substring(0, 14)
      const evn2Norm = evn2.trim().substring(0, 14)
      if (msh7Norm !== evn2Norm) {
        issues.push(error(
          'EVN',
          'EVN-2',
          `Date/time of event (EVN-2) should match message date/time (MSH-7) — expected "${msh7.trim()}" but got "${evn2.trim()}"`,
          'EVN_2_CROSS_FIELD'
        ))
      }
    }
  }

  // Rule: PID-3.4 for MRN repeat must equal MSH-4
  if (pid && msh4.trim()) {
    const pid3Field = pid.fields[3]
    if (pid3Field) {
      for (let repIdx = 0; repIdx < pid3Field.length; repIdx++) {
        const rep = pid3Field[repIdx]
        if (!rep) continue
        const idType = rep[4]?.[0] ?? ''
        const assignAuth = rep[3]?.[0] ?? ''
        if (idType.trim() === 'MRN' && assignAuth.trim() && assignAuth.trim() !== msh4.trim()) {
          const repLabel = pid3Field.length > 1 ? `[${repIdx + 1}]` : ''
          issues.push(error(
            'PID',
            `PID-3${repLabel}.4`,
            `Assigning authority for MRN (PID-3${repLabel}.4) should match client code (MSH-4) — expected "${msh4.trim()}" but got "${assignAuth.trim()}"`,
            'PID_3_4_CROSS_FIELD'
          ))
        }
      }
    }
  }

  // Rule: If PV2-8 is blank, PV1-44 must be present
  if (pv1 && pv2) {
    const pv28 = getField(pv2, 8)
    const pv144 = getField(pv1, 44)
    if (!pv28.trim() && !pv144.trim()) {
      issues.push(error(
        'PV1',
        'PV1-44',
        'Admit date/time (PV1-44) must be present when appointment date/time (PV2-8) is blank',
        'PV1_44_CONDITIONAL'
      ))
    }
  }

  // Rule: MFN^Z03 — MFE-4, LOC-1.1 and LDP-1 must all contain the same clinic code
  const mfe = message.segments.get('MFE')?.[0]
  const loc = message.segments.get('LOC')?.[0]
  const ldp = message.segments.get('LDP')?.[0]

  if (mfe && loc && ldp) {
    const mfe4  = getField(mfe, 4).trim()
    const loc11 = getComponent(loc, 1, 0).trim()
    const ldp1  = getField(ldp, 1).trim()

    if (mfe4 && loc11 && mfe4 !== loc11) {
      issues.push(error(
        'LOC',
        'LOC-1.1',
        `Clinic code (LOC-1.1) "${loc11}" must match MFE-4 "${mfe4}" — all three segments must reference the same clinic code`,
        'MFN_CLINIC_CODE_CROSS_FIELD'
      ))
    }
    if (mfe4 && ldp1 && mfe4 !== ldp1) {
      issues.push(error(
        'LDP',
        'LDP-1',
        `Clinic code (LDP-1) "${ldp1}" must match MFE-4 "${mfe4}" — all three segments must reference the same clinic code`,
        'MFN_CLINIC_CODE_CROSS_FIELD'
      ))
    }
  }

  return issues
}
