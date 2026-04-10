import type { EncodingChars, ParsedSegment, RawField } from '../types/hl7'

const DEFAULT_ENCODING: EncodingChars = {
  fieldSep: '|',
  componentSep: '^',
  repetitionSep: '~',
  escapeSep: '\\',
  subCompSep: '&',
}

function tokenizeValue(
  value: string,
  enc: EncodingChars
): string[][][] {
  // Split by repetition separator → components → sub-components
  return value.split(enc.repetitionSep).map(rep =>
    rep.split(enc.componentSep).map(comp =>
      comp.split(enc.subCompSep)
    )
  )
}

export interface TokenizedLine {
  name: string
  lineNumber: number
  raw: string
  // fields[fieldIndex] — 1-based; index 0 = segment name placeholder
  fields: RawField[]
}

export function tokenize(
  raw: string,
  enc: EncodingChars
): TokenizedLine[] {
  const lines = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  return lines.map((line, idx) => {
    const lineNumber = idx + 1
    const name = line.substring(0, 3).toUpperCase()

    if (name === 'MSH') {
      return tokenizeMSH(line, lineNumber, enc)
    }

    const rawParts = line.split(enc.fieldSep)
    // rawParts[0] = segment name, rawParts[1] = field 1, etc.
    const fields: RawField[] = [
      // index 0: segment name (not a real field)
      [[[rawParts[0]]]],
    ]
    for (let i = 1; i < rawParts.length; i++) {
      fields.push(tokenizeValue(rawParts[i], enc))
    }

    return { name, lineNumber, raw: line, fields }
  })
}

function tokenizeMSH(
  line: string,
  lineNumber: number,
  enc: EncodingChars
): TokenizedLine {
  // MSH is special:
  // MSH-1 = field separator (the '|' character itself)
  // MSH-2 = encoding characters (e.g. '^~\&') — treated as a literal string, not tokenized
  // MSH-3 onwards = normal fields

  const rawParts = line.split(enc.fieldSep)
  // rawParts[0] = "MSH"
  // rawParts[1] = encoding chars (^~\&)
  // rawParts[2] = MSH-3 value, etc.

  const fields: RawField[] = [
    // index 0: segment name
    [[['MSH']]],
    // index 1: MSH-1 = the field separator itself
    [[[enc.fieldSep]]],
    // index 2: MSH-2 = encoding chars as a literal (rawParts[1])
    [[[rawParts[1] ?? '']]],
  ]

  // rawParts[2] = MSH-3 → field index 3
  for (let i = 2; i < rawParts.length; i++) {
    fields.push(tokenizeValue(rawParts[i], enc))
  }

  return { name: 'MSH', lineNumber, raw: line, fields }
}

export function detectEncodingChars(raw: string): EncodingChars {
  const mshLine = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .find(l => l.trimStart().toUpperCase().startsWith('MSH'))

  if (!mshLine || mshLine.length < 8) return DEFAULT_ENCODING

  // MSH|^~\&| — character at index 3 is field sep, 4-7 are encoding chars
  const fieldSep = mshLine[3] ?? '|'
  const encStr = mshLine.substring(4, 8)

  return {
    fieldSep,
    componentSep: encStr[0] ?? '^',
    repetitionSep: encStr[1] ?? '~',
    escapeSep: encStr[2] ?? '\\',
    subCompSep: encStr[3] ?? '&',
  }
}

export function buildParsedSegments(
  lines: TokenizedLine[]
): ParsedSegment[] {
  return lines.map(l => ({
    name: l.name,
    lineNumber: l.lineNumber,
    raw: l.raw,
    fields: l.fields,
  }))
}
