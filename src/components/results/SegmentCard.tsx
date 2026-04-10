import { useState } from 'react'
import type { ParsedSegment } from '../../types/hl7'
import type { ValidationIssue } from '../../types/validation'
import { Badge } from '../shared/Badge'
import { CopyButton } from '../shared/CopyButton'

interface SegmentCardProps {
  segment: ParsedSegment
  issues: ValidationIssue[]
}

// Human-readable labels for known fields per segment
const FIELD_LABELS: Record<string, Record<number, string>> = {
  MSH: {
    1: 'Field separator', 2: 'Encoding characters', 3: 'Sending application',
    4: 'Sending facility', 5: 'Receiving application', 6: 'Receiving facility',
    7: 'Date/time of message', 8: 'Security', 9: 'Message type',
    10: 'Message control ID', 11: 'Processing ID', 12: 'Version ID',
  },
  EVN: { 1: 'Event type code', 2: 'Date/time of event', 3: 'Date/time planned event', 6: 'Event occurred' },
  PID: {
    1: 'Set ID', 3: 'Patient identifier list', 5: 'Patient name',
    7: 'Date of birth', 8: 'Sex', 11: 'Patient address',
    13: 'Phone (home)', 14: 'Phone (work)', 18: 'Account number',
    29: 'Patient death date/time',
  },
  PV1: {
    1: 'Set ID', 2: 'Patient class', 3: 'Assigned patient location',
    9: 'Consulting doctor', 10: 'Specialty', 15: 'Transport requirements (SIU)',
    19: 'Visit number (ADT)', 44: 'Admit date/time',
  },
  PV2: { 1: 'Prior pending location', 8: 'Expected admit date/time', 25: 'Visit priority code' },
  MRG: { 1: 'Prior patient identifier list' },
  ZU1: { 1: 'Translation required', 13: 'Source of referral' },
  ZU2: {
    1: 'Referral status', 2: 'Referral priority', 3: 'Referral type',
    8: 'Expiration date', 10: 'Referral reason', 11: 'Referral external identifier',
  },
  ZU3: { 3: 'Attended or DNA', 5: 'Transport requirements', 8: 'Appointment type', 9: 'Appointment format' },
  SCH: {
    1: 'Placer appointment ID', 2: 'Filler appointment ID', 8: 'Appointment type',
    11: 'Appointment timing quantity', 25: 'Attendance status',
  },
  ZBX: { 1: 'Set ID', 2: 'Value type', 3: 'Segment identifier', 5: 'Clinic' },
  AIP: { 1: 'Set ID', 3: 'Personnel resource ID', 6: 'Start date/time' },
  // ORU
  OBR: {
    1: 'Set ID', 2: 'Placer order number', 3: 'Filler order number',
    4: 'Universal service ID', 7: 'Observation date/time', 25: 'Result status',
  },
  OBX: {
    1: 'Set ID', 2: 'Value type', 3: 'Observation identifier',
    4: 'Sub-ID', 5: 'Observation value', 11: 'Result status',
    14: 'Date/time of observation',
  },
  NTE: { 1: 'Set ID', 2: 'Source of comment', 3: 'Comment' },
  // MFN
  MFI: { 1: 'Master file identifier', 2: 'Master file application identifier', 3: 'File-level event code' },
  MFE: { 1: 'Record-level event code', 2: 'MFN control ID', 3: 'Effective date/time', 4: 'Primary key (clinic code)', 5: 'Primary key value type' },
  LOC: { 1: 'Primary key (clinic code + description)', 2: 'Location description', 3: 'Location type', 4: 'Organization name' },
  LDP: { 1: 'Primary key (clinic code)', 2: 'NHS specialty code', 5: 'Location services' },
  STF: { 1: 'Primary key (staff ID)', 2: 'Staff ID code', 3: 'Staff name', 4: 'Staff type', 5: 'Sex' },
  // REF
  RF1: {
    1: 'Referral status', 2: 'Referral priority', 3: 'Referral type (specialty)',
    4: 'Referral disposition', 5: 'Referral category', 6: 'Originating referral ID',
    7: 'Effective date', 8: 'Expiration / RTT breach date', 9: 'Process date',
    10: 'Referral reason / source', 11: 'Referral external identifier',
  },
}

function getFieldLabel(segName: string, fieldIndex: number): string {
  return FIELD_LABELS[segName]?.[fieldIndex] ?? `Field ${fieldIndex}`
}

function renderFieldValue(fields: ParsedSegment['fields'], fieldIndex: number): string {
  const field = fields[fieldIndex]
  if (!field || field.length === 0) return ''
  return field
    .map(rep => rep.map(comp => comp.join('&')).join('^'))
    .join('~')
}

export function SegmentCard({ segment, issues }: SegmentCardProps) {
  const [expanded, setExpanded] = useState(false)

  const errorCount = issues.filter(i => i.severity === 'error').length
  const warningCount = issues.filter(i => i.severity === 'warning').length

  const statusBadge =
    errorCount > 0 ? <Badge variant="error">{errorCount} error{errorCount !== 1 ? 's' : ''}</Badge> :
    warningCount > 0 ? <Badge variant="warning">{warningCount} warning{warningCount !== 1 ? 's' : ''}</Badge> :
    <Badge variant="pass">OK</Badge>

  // Build field rows — only show fields that have a value or are known
  const fieldRows: { index: number; label: string; value: string }[] = []
  for (let i = 1; i < segment.fields.length; i++) {
    const value = renderFieldValue(segment.fields, i)
    if (value || FIELD_LABELS[segment.name]?.[i]) {
      fieldRows.push({ index: i, label: getFieldLabel(segment.name, i), value })
    }
  }

  // Map issues to field indexes for inline highlighting
  const issuesByField = new Map<number, ValidationIssue[]>()
  for (const iss of issues) {
    // Extract field number from fieldRef like "MSH-6" or "PID-3[1].4"
    const match = iss.fieldRef.match(/-(\d+)/)
    if (match) {
      const fi = parseInt(match[1], 10)
      if (!issuesByField.has(fi)) issuesByField.set(fi, [])
      issuesByField.get(fi)!.push(iss)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        <code className="font-mono font-bold text-sm text-brand-secondary w-10 flex-shrink-0">
          {segment.name}
        </code>

        <span className="text-xs text-gray-400 flex-shrink-0">line {segment.lineNumber}</span>

        <div className="ml-auto flex items-center gap-2">
          {statusBadge}
          <CopyButton text={segment.raw} label="" />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-2 font-medium w-16">Field</th>
                  <th className="text-left px-4 py-2 font-medium w-40">Name</th>
                  <th className="text-left px-4 py-2 font-medium">Value</th>
                  <th className="text-right px-4 py-2 font-medium w-16">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fieldRows.map(({ index, label, value }) => {
                  const fieldIssues = issuesByField.get(index) ?? []
                  const hasError = fieldIssues.some(i => i.severity === 'error')
                  const hasWarning = fieldIssues.some(i => i.severity === 'warning')

                  return (
                    <tr
                      key={index}
                      className={
                        hasError ? 'bg-red-50' :
                        hasWarning ? 'bg-amber-50' :
                        value ? 'bg-white' : 'bg-gray-50'
                      }
                    >
                      <td className="px-4 py-2 font-mono text-gray-500">
                        {segment.name}-{index}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{label}</td>
                      <td className="px-4 py-2 font-mono text-gray-800 break-all">
                        {value || <span className="text-gray-300 italic">empty</span>}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {hasError ? (
                          <span className="text-red-500">✕</span>
                        ) : hasWarning ? (
                          <span className="text-amber-500">⚠</span>
                        ) : value ? (
                          <span className="text-green-500">✓</span>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
                {fieldRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-gray-400 italic text-center">
                      No fields
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
