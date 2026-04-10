import type { ParsedHL7Message, EncodingChars } from '../types/hl7'
import { detectEncodingChars, tokenize, buildParsedSegments } from './tokenizer'
import { getComponent, getField } from './segmentParser'

const DEFAULT_ENCODING: EncodingChars = {
  fieldSep: '|',
  componentSep: '^',
  repetitionSep: '~',
  escapeSep: '\\',
  subCompSep: '&',
}

export function parseHL7(raw: string): ParsedHL7Message {
  const parseWarnings: string[] = []
  const trimmed = raw.trim()

  if (!trimmed) {
    return emptyMessage(raw, DEFAULT_ENCODING, ['Message is empty'])
  }

  const encodingChars = detectEncodingChars(trimmed)
  const tokenLines = tokenize(trimmed, encodingChars)
  const parsedSegments = buildParsedSegments(tokenLines)

  if (parsedSegments.length === 0) {
    return emptyMessage(raw, encodingChars, ['No segments found in message'])
  }

  if (parsedSegments[0].name !== 'MSH') {
    parseWarnings.push('Message does not start with MSH segment')
  }

  const segments = new Map<string, ReturnType<typeof buildParsedSegments>>()
  const segmentOrder: string[] = []

  for (const seg of parsedSegments) {
    const known = [
      // ADT segments
      'MSH', 'EVN', 'PID', 'PV1', 'PV2', 'MRG',
      'ZU1', 'ZU2', 'ZU3',
      // SIU segments
      'SCH', 'ZBX', 'AIP',
      // ORU segments
      'OBR', 'OBX', 'NTE',
      // MFN segments
      'MFI', 'MFE', 'LOC', 'LDP', 'STF',
      // REF segments
      'RF1',
    ]
    if (!known.includes(seg.name)) {
      parseWarnings.push(`Unrecognised segment: ${seg.name} (line ${seg.lineNumber})`)
    }
    if (!segments.has(seg.name)) {
      segments.set(seg.name, [])
      segmentOrder.push(seg.name)
    }
    segments.get(seg.name)!.push(seg)
  }

  const mshSegs = segments.get('MSH')
  const msh = mshSegs?.[0]

  let messageType = ''
  let triggerEvent = ''

  if (msh) {
    messageType = getComponent(msh, 9, 0)    // MSH-9.1
    triggerEvent = getComponent(msh, 9, 1)   // MSH-9.2
  } else {
    parseWarnings.push('MSH segment missing — cannot determine message type')
  }

  return {
    raw,
    encodingChars,
    segments,
    segmentOrder,
    messageType,
    triggerEvent,
    parseWarnings,
  }
}

function emptyMessage(
  raw: string,
  encodingChars: EncodingChars,
  warnings: string[]
): ParsedHL7Message {
  return {
    raw,
    encodingChars,
    segments: new Map(),
    segmentOrder: [],
    messageType: '',
    triggerEvent: '',
    parseWarnings: warnings,
  }
}

export function detectMessageType(raw: string): { messageType: string; triggerEvent: string } | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const enc = detectEncodingChars(trimmed)
  const lines = tokenize(trimmed, enc)
  const mshLine = lines.find(l => l.name === 'MSH')
  if (!mshLine) return null
  const seg = buildParsedSegments([mshLine])[0]
  if (!seg) return null
  const mt = getComponent(seg, 9, 0)
  const te = getComponent(seg, 9, 1)
  if (!mt && !te) return null
  return { messageType: mt, triggerEvent: te }
}

// Re-export getField for convenience in tests / validation
export { getField }
