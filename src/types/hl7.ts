export interface EncodingChars {
  fieldSep: string       // |
  componentSep: string   // ^
  repetitionSep: string  // ~
  escapeSep: string      // \
  subCompSep: string     // &
}

// [repetitionIndex][componentIndex][subComponentIndex]
export type RawField = string[][][]

export interface ParsedSegment {
  name: string
  lineNumber: number // 1-based
  raw: string
  // fields[fieldIndex] = RawField
  // fieldIndex is 1-based (HL7 field numbers), index 0 is the segment name
  fields: RawField[]
}

export interface ParsedHL7Message {
  raw: string
  encodingChars: EncodingChars
  // Map of segment name -> ordered list of ParsedSegment (supports repeated segments)
  segments: Map<string, ParsedSegment[]>
  // Ordered list of segment names as they appear in the message
  segmentOrder: string[]
  messageType: string   // e.g. "ADT"
  triggerEvent: string  // e.g. "A28"
  parseWarnings: string[]
}
