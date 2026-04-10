import type { MessageTypeConfig } from '../types/validation'
import { validateMSH } from './rules/msh'
import { validateEVN } from './rules/evn'
import { validatePID } from './rules/pid'
import { validatePIDOru } from './rules/pidOru'
import { validatePV1 } from './rules/pv1'
import { validatePV1Siu } from './rules/pv1Siu'
import { validatePV2 } from './rules/pv2'
import { validateMRG } from './rules/mrg'
import { validateZU1 } from './rules/zu1'
import { validateZU2 } from './rules/zu2'
import { validateZU3 } from './rules/zu3'
import { validateSCH } from './rules/sch'
import { validateZBX } from './rules/zbx'
import { validateAIP } from './rules/aip'
import { validateOBR } from './rules/obr'
import { validateOBX } from './rules/obx'
import { validateNTE } from './rules/nte'
import { validateMFI } from './rules/mfi'
import { validateMFE } from './rules/mfe'
import { validateLOC } from './rules/loc'
import { validateLDP } from './rules/ldp'
import { validateSTF } from './rules/stf'
import { validateRF1 } from './rules/rf1'

// Segments common to patient-only messages (A28, A31)
const patientSegmentRules = {
  MSH: validateMSH,
  EVN: validateEVN,
  PID: validatePID,
}

// Segments common to ADT appointment messages (A05, A38, A08)
const adtAppointmentSegmentRules = {
  MSH: validateMSH,
  EVN: validateEVN,
  PID: validatePID,
  PV1: validatePV1,
  PV2: validatePV2,
  ZU1: validateZU1,
  ZU2: validateZU2,
  ZU3: validateZU3,
}

// Segments common to all SIU messages (S12, S14, S15, S26, Z02)
const siuSegmentRules = {
  MSH: validateMSH,
  EVN: validateEVN,
  SCH: validateSCH,
  ZBX: validateZBX,
  PID: validatePID,
  PV1: validatePV1Siu,
  ZU1: validateZU1,
  ZU2: validateZU2,
  AIP: validateAIP,
}

export const MESSAGE_TYPE_RULES: Record<string, MessageTypeConfig> = {

  // ── ADT Messages ──────────────────────────────────────────────────────────

  A28: {
    requiredSegments: ['MSH', 'EVN', 'PID'],
    optionalSegments: [],
    segmentRuleFns: patientSegmentRules,
    constraints: {},
  },

  A31: {
    requiredSegments: ['MSH', 'EVN', 'PID'],
    optionalSegments: [],
    segmentRuleFns: patientSegmentRules,
    constraints: {},
  },

  A40: {
    requiredSegments: ['MSH', 'EVN', 'PID', 'MRG'],
    optionalSegments: [],
    segmentRuleFns: {
      MSH: validateMSH,
      EVN: validateEVN,
      PID: validatePID,
      MRG: validateMRG,
    },
    constraints: {},
  },

  A05: {
    requiredSegments: ['MSH', 'EVN', 'PID', 'PV1', 'PV2', 'ZU1', 'ZU3'],
    optionalSegments: ['ZU2'],
    segmentRuleFns: adtAppointmentSegmentRules,
    constraints: { zu33: '1' }, // ZU3-3 must be "1" (Booked)
  },

  A38: {
    requiredSegments: ['MSH', 'EVN', 'PID', 'PV1', 'PV2', 'ZU1', 'ZU3'],
    optionalSegments: ['ZU2'],
    segmentRuleFns: adtAppointmentSegmentRules,
    constraints: { zu33: '4' }, // ZU3-3 must be "4" (Cancelled)
  },

  A08: {
    requiredSegments: ['MSH', 'EVN', 'PID', 'PV1', 'PV2', 'ZU1', 'ZU3'],
    optionalSegments: ['ZU2'],
    segmentRuleFns: adtAppointmentSegmentRules,
    constraints: {}, // ZU3-3 required but any valid value acceptable
  },

  // ── SIU Messages ──────────────────────────────────────────────────────────

  S12: {
    requiredSegments: ['MSH', 'EVN', 'SCH', 'ZBX', 'PID', 'PV1', 'ZU1'],
    optionalSegments: ['ZU2', 'AIP'],
    segmentRuleFns: siuSegmentRules,
    constraints: { sch25: '1' }, // SCH-25 must be "1" (Booked)
  },

  S14: {
    requiredSegments: ['MSH', 'EVN', 'SCH', 'ZBX', 'PID', 'PV1', 'ZU1'],
    optionalSegments: ['ZU2', 'AIP'],
    segmentRuleFns: siuSegmentRules,
    constraints: {}, // SCH-25 required but any valid value acceptable (functionally like S12)
  },

  S15: {
    requiredSegments: ['MSH', 'EVN', 'SCH', 'ZBX', 'PID', 'PV1', 'ZU1'],
    optionalSegments: ['ZU2', 'AIP'],
    segmentRuleFns: siuSegmentRules,
    constraints: { sch25: '4' }, // SCH-25 must be "4" (Cancelled)
  },

  S26: {
    requiredSegments: ['MSH', 'EVN', 'SCH', 'ZBX', 'PID', 'PV1', 'ZU1'],
    optionalSegments: ['ZU2', 'AIP'],
    segmentRuleFns: siuSegmentRules,
    constraints: { sch25: '5' }, // SCH-25 must be "5" (DNA)
  },

  Z02: {
    requiredSegments: ['MSH', 'EVN', 'SCH', 'ZBX', 'PID', 'PV1', 'ZU1'],
    optionalSegments: ['ZU2', 'AIP'],
    segmentRuleFns: siuSegmentRules,
    constraints: { sch25: '3' }, // SCH-25 must be "3" (Attended)
  },

  // ── ORU Messages ─────────────────────────────────────────────────────────

  R01: {
    requiredSegments: ['MSH', 'PID', 'OBR', 'OBX'],
    optionalSegments: ['NTE'],
    segmentRuleFns: {
      MSH: validateMSH,
      PID: validatePIDOru,
      OBR: validateOBR,
      OBX: validateOBX,
      NTE: validateNTE,
    },
    constraints: {},
  },

  // ── MFN Messages ─────────────────────────────────────────────────────────

  Z03: {
    requiredSegments: ['MSH', 'MFI', 'MFE', 'LOC', 'LDP'],
    optionalSegments: ['STF'],
    segmentRuleFns: {
      MSH: validateMSH,
      MFI: validateMFI,
      MFE: validateMFE,
      LOC: validateLOC,
      LDP: validateLDP,
      STF: validateSTF,
    },
    constraints: {},
  },

  // ── REF Messages ─────────────────────────────────────────────────────────

  // Segments common to all REF messages
  I12: {
    requiredSegments: ['MSH', 'EVN', 'RF1', 'PID'],
    optionalSegments: [],
    segmentRuleFns: {
      MSH: validateMSH,
      EVN: validateEVN,
      RF1: validateRF1,
      PID: validatePID,
    },
    constraints: {},
  },

  I13: {
    requiredSegments: ['MSH', 'EVN', 'RF1', 'PID'],
    optionalSegments: [],
    segmentRuleFns: {
      MSH: validateMSH,
      EVN: validateEVN,
      RF1: validateRF1,
      PID: validatePID,
    },
    constraints: {},
  },

  I14: {
    requiredSegments: ['MSH', 'EVN', 'RF1', 'PID'],
    optionalSegments: [],
    segmentRuleFns: {
      MSH: validateMSH,
      EVN: validateEVN,
      RF1: validateRF1,
      PID: validatePID,
    },
    constraints: {},
  },
}

export const SUPPORTED_TRIGGER_EVENTS = Object.keys(MESSAGE_TYPE_RULES)
