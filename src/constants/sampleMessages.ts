export const SAMPLE_MESSAGES: Record<string, { label: string; message: string }> = {

  // ── ADT Messages ────────────────────────────────────────────────────────

  A28: {
    label: 'ADT A28 — Add New Patient',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ADT^A28|0000000000820327|P|2.4|||AL|NE|GBR
EVN|A28|20190822140527|||||
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y||||||||||||||||20191212|`,
  },

  A31: {
    label: 'ADT A31 — Update Patient',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ADT^A31|0000000000820328|P|2.4|||AL|NE|GBR
EVN|A31|20190822140527|||||
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y||||||||||||||||20191212|`,
  },

  A40: {
    label: 'ADT A40 — Merge Patient',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ADT^A40|0000000000820329|P|2.4|||AL|NE|GBR
EVN|A40|20190822140527|||||
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y||||||||||||||||20191212|
MRG|0444333^^^TRUST^MRN|`,
  },

  A05: {
    label: 'ADT A05 — Add/Update Appointment',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ADT^A05|0000000000820330|P|2.4|||AL|NE|GBR
EVN|A05|20190822140527|||||
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O|GEN345_BAB^^^^^^^^General Morning Clinic||||||CONS001^SMITH^JOHN^^^DR|410|||||||||APT001
PV2||||||||20191024094500|||||||||||||||||1
ZU1|Y||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
ZU3|||1||Y|||2|1`,
  },

  A38: {
    label: 'ADT A38 — Cancel Appointment',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ADT^A38|0000000000820331|P|2.4|||AL|NE|GBR
EVN|A38|20190822140527|||||
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O|GEN345_BAB^^^^^^^^General Morning Clinic||||||CONS001^SMITH^JOHN^^^DR|410|||||||||APT001
PV2||||||||20191024094500|||||||||||||||||1
ZU1|N||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
ZU3|||4||N|||2|1`,
  },

  A08: {
    label: 'ADT A08 — Appointment Attendance',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ADT^A08|0000000000820332|P|2.4|||AL|NE|GBR
EVN|A08|20190822140527|||||
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O|GEN345_BAB^^^^^^^^General Morning Clinic||||||CONS001^SMITH^JOHN^^^DR|410|||||||||APT001
PV2||||||||20191024094500|||||||||||||||||1
ZU1|Y||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
ZU3|||1||Y|||2|1`,
  },

  // ── SIU Messages ────────────────────────────────────────────────────────

  S12: {
    label: 'SIU S12 — Add Appointment',
    // SCH-25 (attendance) is at field 25 — needs 13 empty fields (12-24) after timing field (11)
    // PV1-10 (specialty) needs 8 pipes after O; PV1-15 (transport) is 4 fields after specialty
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||SIU^S12|0000000000820333|P|2.4|||AL|NE|GBR
EVN|S12|20190822140527|||||
SCH|APT001|||||||1|20||^^20^20191024094500^20191024095500^3^^1||||||||||||||1
ZBX|1|CE|CLINIC_CODE_INFO||GEN345_BAB^General Morning Clinic|
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O||||||||410|||||Y|||NHS|
ZU1|Y||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
AIP|1||CONS001^SMITH^JOHN^^^DR|Resource^Text||20190822140527|0|MINS|15|MINS||confirmed`,
  },

  S14: {
    label: 'SIU S14 — Reschedule/Modify Appointment',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||SIU^S14|0000000000820334|P|2.4|||AL|NE|GBR
EVN|S14|20190822140527|||||
SCH|APT001|||||||1|20||^^20^20191031100000^20191031101000^3^^1||||||||||||||1
ZBX|1|CE|CLINIC_CODE_INFO||GEN345_BAB^General Morning Clinic|
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O||||||||410|||||Y|||NHS|
ZU1|Y||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
AIP|1||CONS001^SMITH^JOHN^^^DR|Resource^Text||20190822140527|0|MINS|15|MINS||confirmed`,
  },

  S15: {
    label: 'SIU S15 — Cancel Appointment',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||SIU^S15|0000000000820335|P|2.4|||AL|NE|GBR
EVN|S15|20190822140527|||||
SCH|APT001|||||||1|20||^^20^20191024094500^20191024095500^3^^1||||||||||||||4
ZBX|1|CE|CLINIC_CODE_INFO||GEN345_BAB^General Morning Clinic|
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O||||||||410|||||N|||NHS|
ZU1|N||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123`,
  },

  S26: {
    label: 'SIU S26 — DNA Appointment',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||SIU^S26|0000000000820336|P|2.4|||AL|NE|GBR
EVN|S26|20190822140527|||||
SCH|APT001|||||||1|20||^^20^20191024094500^20191024095500^3^^1||||||||||||||5
ZBX|1|CE|CLINIC_CODE_INFO||GEN345_BAB^General Morning Clinic|
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O||||||||410|||||N|||NHS|
ZU1|N||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
AIP|1||CONS001^SMITH^JOHN^^^DR|Resource^Text||20190822140527|0|MINS|15|MINS||confirmed`,
  },

  Z02: {
    label: 'SIU Z02 — Check-out (Attended)',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140533||SIU^Z02|0000000000820338|P|2.4|||AL|NE|GBR
EVN|Z02|20190822140533|||||
SCH|APT001|||||||1|20||^^20^20191024094500^20191024095500^3^^1||||||||||||||3
ZBX|1|CE|CLINIC_CODE_INFO||GEN345_BAB^General Morning Clinic|
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y
PV1|1|O||||||||410|||||Y|||NHS|
ZU1|Y||||||||||||ERS
ZU2|A||320|||^^||20240131000000|||^^REFID0123
AIP|1||CONS001^SMITH^JOHN^^^DR|Resource^Text||20190822140527|0|MINS|15|MINS||confirmed`,
  },

  // ── ORU Messages ────────────────────────────────────────────────────────

  R01: {
    label: 'ORU R01 — PROM Assessment Results',
    // OBR-4.2 (clinical title) = component 2, OBR-4.5 (patient title) = component 5
    // OBR-25 (result status) at field 25 — 18 pipes after OBR-7
    // OBX-11 (result status) at field 11 — 5 pipes after OBX-5
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||ORU^R01|0000000000820340|P|2.4|||AL|NE|GBR
PID|||0123123^^^TRUST^MRN||JONES||19990521
OBR||||^Clinical Knee Assessment^^^Patient Knee Assessment|||20190822140527||||||||||||||||||F
OBX|1|NM|Q1^Pain score (0-10)||7||||||F
OBX|2|ST|Q2^Mobility level||Moderate||||||F
NTE|1||Patient completed the assessment online via the DrDoctor portal`,
  },

  // ── MFN Messages ────────────────────────────────────────────────────────

  Z03: {
    label: 'MFN Z03 — Clinic Code Master File',
    // LOC-1 uses component 9 (description): 8 carets between clinic code and description
    // STF-3.5 (title) at component 5: 4 carets between firstname and title
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||MFN^Z03|0000000000820341|P|2.4|||AL|NE|GBR
MFI|CLN||UPD|||AL
MFE|MAD|||GEN345_BAB|CE
LOC|GEN345_BAB^^^^^^^^General Morning Clinic||C
LDP|GEN345_BAB|410
STF||CONS001|SMITH^JOHN^^^DR`,
  },

  // ── REF Messages ────────────────────────────────────────────────────────

  I12: {
    label: 'REF I12 — Add Referral',
    // RF1-6.3 originating ID at component 3 (^^REF001), RF1-11.3 external ID (^^REF001)
    // RF1-8.1 expiration/RTT breach date at field 8
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||REF^I12|0000000000820342|P|2.4|||AL|NE|GBR
EVN|I12|20190822140527|||||
RF1|A||320|||^^REF001||20201231000000|||^^REF001
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y||||||||||||||||20191212|`,
  },

  I13: {
    label: 'REF I13 — Update Referral',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||REF^I13|0000000000820343|P|2.4|||AL|NE|GBR
EVN|I13|20190822140527|||||
RF1|A||320|||^^REF001||20201231000000|||^^REF001
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y||||||||||||||||20191212|`,
  },

  I14: {
    label: 'REF I14 — Cancel Referral',
    message: `MSH|^~\\&|TRUST_PAS|TRUST|23|23.TRUST_PAS|20190822140527||REF^I14|0000000000820344|P|2.4|||AL|NE|GBR
EVN|I14|20190822140527|||||
RF1|R||320|||^^REF001||20201231000000|||^^REF001
PID|||0123123^^^TRUST^MRN~0000255355^^^^NHS||JONES^JOAN^^^MISS||19990521|2|||10 SOME STREET^^TESTTOWN^^SY8 1NP^^HOME||02111111111^^^HOME^^^^^Y~07999123123^^^MOBILE^^^^^N~test@test.com^^^EMAIL^^^^^Y||||||||||||||||20191212|`,
  },
}
