/**
 * Maps each supported trigger event to its DrDoctor specification URL.
 */
export const SPEC_LINKS: Record<string, string> = {
  // ADT
  A28: 'https://docs.dr.doctor/en/articles/83321-adt-a28-add-new-patient',
  A31: 'https://docs.dr.doctor/en/articles/83326-adt-a31-update-patient',
  A40: 'https://docs.dr.doctor/en/articles/83327-adt-a40-merge-patient',
  A05: 'https://docs.dr.doctor/en/articles/83328-adt-a05-add-update-appointment',
  A38: 'https://docs.dr.doctor/en/articles/83330-adt-a38-cancel-appointment',
  A08: 'https://docs.dr.doctor/en/articles/83329-adt-a08-appointment-attendance',
  // SIU
  S12: 'https://docs.dr.doctor/en/articles/83342-siu-s12-add-appointment',
  S14: 'https://docs.dr.doctor/en/articles/83352-siu-s14-reschedule-modify-undo-appointment',
  S15: 'https://docs.dr.doctor/en/articles/83353-siu-s15-cancel-appointment',
  S26: 'https://docs.dr.doctor/en/articles/83354-siu-s26-dna-appointment',
  Z02: 'https://docs.dr.doctor/en/articles/83355-siu-z02-check-out-appointment',
  // ORU
  R01: 'https://docs.dr.doctor/en/articles/83366-oru-workflow',
  // MFN
  Z03: 'https://docs.dr.doctor/en/articles/83340-mfn-z03-clinic-code-master-file',
  // REF
  I12: 'https://docs.dr.doctor/en/articles/83429',
  I13: 'https://docs.dr.doctor/en/articles/83430',
  I14: 'https://docs.dr.doctor/en/articles/83431',
}
