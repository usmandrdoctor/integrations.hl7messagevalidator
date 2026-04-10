// Valid values for PID-8 (Sex)
export const VALID_SEX_CODES = new Set(['0', '1', '2', '9'])
export const SEX_CODE_LABELS: Record<string, string> = {
  '0': 'Not known',
  '1': 'Male',
  '2': 'Female',
  '9': 'Not specified',
}

// Valid values for MSH-11 (Processing ID)
export const VALID_PROCESSING_IDS = new Set(['P', 'T'])

// Valid values for PV2-25 (Appointment Priority)
export const VALID_PRIORITY_CODES = new Set(['1', '3', '4'])
export const PRIORITY_CODE_LABELS: Record<string, string> = {
  '1': 'Routine',
  '3': 'Urgent',
  '4': 'Two Week Wait',
}

// Valid values for ZU1-1 (Translation required)
export const VALID_YN = new Set(['Y', 'N'])

// Valid values for ZU2-1.1 (Referral Status)
export const VALID_REFERRAL_STATUS = new Set(['A', 'E', 'P', 'R'])
export const REFERRAL_STATUS_LABELS: Record<string, string> = {
  A: 'Accepted',
  E: 'Expired',
  P: 'Pending',
  R: 'Rejected',
}

// Valid values for ZU2-2.1 (Referral Priority)
export const VALID_REFERRAL_PRIORITY = new Set(['1', '2', '3'])

// Valid values for ZU2-5.1 (Referral Category)
export const VALID_REFERRAL_CATEGORY = new Set(['A', 'E', 'I', 'O'])

// Valid values for ZU2-10.1 (Referral Reason)
export const VALID_REFERRAL_REASON = new Set(['01', '02', '03', '04'])

// Valid values for ZU3-3 (Attended or DNA)
// Reference: NHS Attendance Type codes
export const VALID_ATTENDED_DNA = new Set([
  '1',  // Attended — seen
  '2',  // Attended — not seen
  '3',  // Did not attend — no advance warning
  '4',  // Cancelled by patient
  '5',  // Cancelled by hospital
  '6',  // Arrived — not seen
  '7',  // Cancelled by DrDoctor
])
export const ATTENDED_DNA_LABELS: Record<string, string> = {
  '1': 'Attended — seen',
  '2': 'Attended — not seen',
  '3': 'Did not attend (no advance warning)',
  '4': 'Cancelled by patient',
  '5': 'Cancelled by hospital',
  '6': 'Arrived — not seen',
  '7': 'Cancelled by DrDoctor',
}

// Valid values for ZU3-8 (Appointment Type)
export const VALID_APPOINTMENT_TYPE = new Set(['1', '2', '5'])
export const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  '1': 'New',
  '2': 'Follow Up',
  '5': 'Pre-Assessment',
}

// Valid values for ZU3-9 (Appointment Format / Consultation Mode)
export const VALID_APPOINTMENT_FORMAT = new Set(['1', '2', '3', '4', '5'])
export const APPOINTMENT_FORMAT_LABELS: Record<string, string> = {
  '1': 'In person',
  '2': 'Video',
  '3': 'Telephone',
  '4': 'Digital review',
  '5': 'Walk in',
}

// PID-11.7 must be HOME
export const REQUIRED_ADDRESS_TYPE = 'HOME'

// Valid values for PID-13.4 (Contact Type)
export const VALID_CONTACT_TYPES = new Set(['HOME', 'MOBILE', 'EMAIL'])

// PV1-2 expected value
export const EXPECTED_PATIENT_CLASS = 'O'

// PID-3.5 identifier type codes
export const VALID_IDENTIFIER_TYPES = new Set(['MRN', 'NHS'])

// ZU3-3 constraint values per message type
export const ZU33_CONSTRAINT: Record<string, string> = {
  A05: '1',  // Booked
  A38: '4',  // Cancelled
}

// Valid values for SCH-25 (Attendance Status) — SIU messages
export const VALID_SCH25_ATTENDANCE = new Set(['1', '2', '3', '4', '5', '6'])
export const SCH25_ATTENDANCE_LABELS: Record<string, string> = {
  '1': 'Booked',
  '2': 'Not Booked',
  '3': 'Attended',
  '4': 'Cancelled',
  '5': 'DNA',
  '6': 'Other',
}

// SCH-25 constraint values per SIU message type
export const SCH25_CONSTRAINT: Record<string, string> = {
  S12: '1',  // Booked
  S15: '4',  // Cancelled
  S26: '5',  // DNA
  Z02: '3',  // Attended
}

// ── ORU^R01 ─────────────────────────────────────────────────────────────────

// Valid values for OBX-2 (Value Type)
export const VALID_OBX_VALUE_TYPES = new Set(['ST', 'NM', 'ED'])
export const OBX_VALUE_TYPE_LABELS: Record<string, string> = {
  ST: 'String',
  NM: 'Numeric',
  ED: 'Encapsulated Data (PDF)',
}

// ── MFN^Z03 ─────────────────────────────────────────────────────────────────

// Valid values for MFE-1 (Record-level Event Code)
export const VALID_MFE_EVENT_CODES = new Set(['MUP', 'MAD', 'MDL', 'MDC', 'MAC'])
export const MFE_EVENT_CODE_LABELS: Record<string, string> = {
  MUP: 'Add/Update clinic',
  MAD: 'Add/Update clinic',
  MDL: 'Archive clinic',
  MDC: 'Archive clinic',
  MAC: 'Unarchive clinic',
}

// ── REF^I12/I13/I14 ─────────────────────────────────────────────────────────

// Valid values for RF1-1.1 (Referral Status)
export const VALID_RF1_STATUS = new Set(['A', 'E', 'P', 'R'])
export const RF1_STATUS_LABELS: Record<string, string> = {
  A: 'Accepted',
  E: 'Expired',
  P: 'Pending',
  R: 'Rejected',
}

// Valid values for RF1-2.1 (Referral Priority)
export const VALID_RF1_PRIORITY = new Set(['1', '2', '3'])
export const RF1_PRIORITY_LABELS: Record<string, string> = {
  '1': 'Routine',
  '2': 'Urgent',
  '3': 'Two Week Wait',
}

// Valid values for RF1-5.1 (Referral Category)
export const VALID_RF1_CATEGORY = new Set(['A', 'E', 'I', 'O'])
export const RF1_CATEGORY_LABELS: Record<string, string> = {
  A: 'Ambulatory',
  E: 'Emergency',
  I: 'Inpatient',
  O: 'Outpatient',
}

// Valid values for RF1-10.1 (Referral Reason)
export const VALID_RF1_REASON = new Set(['01', '02', '03', '04'])
export const RF1_REASON_LABELS: Record<string, string> = {
  '01': 'Transfer',
  '02': 'Opinion',
  '03': 'Diagnostic',
  '04': 'New Referral',
}
