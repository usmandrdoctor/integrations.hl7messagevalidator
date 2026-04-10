import type { ValidationResult, ValidationContext, ValidationIssue } from '../types/validation'
import { parseHL7 } from '../parser/messageParser'
import { MESSAGE_TYPE_RULES } from './messageTypeRules'
import { validateCrossFields } from './rules/crossField'
import { error } from './helpers'

export function validate(raw: string): ValidationResult {
  if (!raw.trim()) {
    return {
      isValid: false,
      messageType: null,
      triggerEvent: null,
      issues: [error('', '', 'No message provided — paste an HL7 message to validate', 'EMPTY_MESSAGE')],
      parseWarnings: [],
      parsedMessage: null,
    }
  }

  const parsed = parseHL7(raw)
  const issues: ValidationIssue[] = []

  // Surface parse-level warnings as validation errors
  for (const warn of parsed.parseWarnings) {
    issues.push(error('', '', warn, 'PARSE_WARNING'))
  }

  const triggerEvent = parsed.triggerEvent?.trim().toUpperCase()
  const messageType = parsed.messageType?.trim().toUpperCase()

  if (!triggerEvent) {
    return {
      isValid: false,
      messageType: messageType || null,
      triggerEvent: null,
      issues: [...issues, error('MSH', 'MSH-9.2', 'Cannot determine trigger event from MSH-9.2 — validation cannot proceed', 'UNKNOWN_TRIGGER')],
      parseWarnings: parsed.parseWarnings,
      parsedMessage: parsed,
    }
  }

  const config = MESSAGE_TYPE_RULES[triggerEvent]

  if (!config) {
    return {
      isValid: false,
      messageType: messageType || null,
      triggerEvent,
      issues: [...issues, error('MSH', 'MSH-9.2', `Trigger event "${triggerEvent}" is not supported — supported: ADT (A28, A31, A40, A05, A38, A08), SIU (S12, S14, S15, S26, Z02), ORU (R01), MFN (Z03), REF (I12, I13, I14)`, 'UNSUPPORTED_TRIGGER')],
      parseWarnings: parsed.parseWarnings,
      parsedMessage: parsed,
    }
  }

  // Check required segments are present
  for (const segName of config.requiredSegments) {
    if (!parsed.segments.has(segName)) {
      issues.push(error(segName, segName, `Required segment ${segName} is missing from the message`, `${segName}_MISSING`))
    }
  }

  // Build context
  const context: ValidationContext = {
    message: parsed,
    zu33Constraint: config.constraints.zu33,
    sch25Constraint: config.constraints.sch25,
  }

  // Run per-segment rule functions
  for (const [segName, ruleFn] of Object.entries(config.segmentRuleFns)) {
    const segs = parsed.segments.get(segName)
    if (!segs || segs.length === 0) continue // missing segments already flagged above

    for (const seg of segs) {
      const segIssues = ruleFn(seg, context)
      issues.push(...segIssues)
    }
  }

  // Run cross-field rules
  issues.push(...validateCrossFields(parsed))

  // Sort issues by segment order so errors appear grouped by their segment position
  const segmentOrder = parsed.segmentOrder
  issues.sort((a, b) => {
    const ai = segmentOrder.indexOf(a.segment)
    const bi = segmentOrder.indexOf(b.segment)
    const aIdx = ai === -1 ? Infinity : ai
    const bIdx = bi === -1 ? Infinity : bi
    return aIdx - bIdx
  })

  const hasErrors = issues.some(i => i.severity === 'error')

  return {
    isValid: !hasErrors,
    messageType: messageType || null,
    triggerEvent,
    issues,
    parseWarnings: parsed.parseWarnings,
    parsedMessage: parsed,
  }
}
