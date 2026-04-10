import type { ParsedHL7Message, ParsedSegment } from './hl7'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface ValidationIssue {
  severity: ValidationSeverity
  segment: string    // e.g. "MSH"
  fieldRef: string   // e.g. "MSH-6" or "PID-3[1].4"
  message: string    // Human-readable description
  ruleId: string     // e.g. "MSH_6_CROSS_FIELD"
}

export interface SegmentValidationResult {
  segmentName: string
  issues: ValidationIssue[]
}

export interface ValidationResult {
  isValid: boolean
  messageType: string | null
  triggerEvent: string | null
  issues: ValidationIssue[]
  parseWarnings: string[]
  parsedMessage: ParsedHL7Message | null
}

export interface ValidationContext {
  message: ParsedHL7Message
  // Constraint for ADT: ZU3-3 expected value (e.g. '1' for A05 Booked)
  zu33Constraint?: string
  // Constraint for SIU: SCH-25 expected value (e.g. '1' for S12 Booked)
  sch25Constraint?: string
}

export type SegmentRuleFn = (
  segment: ParsedSegment,
  context: ValidationContext
) => ValidationIssue[]

export interface MessageTypeConfig {
  requiredSegments: string[]
  optionalSegments: string[]
  segmentRuleFns: Record<string, SegmentRuleFn>
  // Per-trigger constraints passed into context
  constraints: {
    zu33?: string   // expected value for ZU3-3 (ADT), undefined means any valid value
    sch25?: string  // expected value for SCH-25 (SIU), undefined means any valid value
  }
}
