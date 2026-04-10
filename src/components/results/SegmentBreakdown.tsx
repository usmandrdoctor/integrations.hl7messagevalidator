import type { ParsedHL7Message } from '../../types/hl7'
import type { ValidationIssue } from '../../types/validation'
import { SegmentCard } from './SegmentCard'

interface SegmentBreakdownProps {
  parsedMessage: ParsedHL7Message
  issues: ValidationIssue[]
}

export function SegmentBreakdown({ parsedMessage, issues }: SegmentBreakdownProps) {
  // Group issues by segment name
  const issuesBySegment = new Map<string, ValidationIssue[]>()
  for (const iss of issues) {
    const seg = iss.segment || ''
    if (!issuesBySegment.has(seg)) issuesBySegment.set(seg, [])
    issuesBySegment.get(seg)!.push(iss)
  }

  const segments = parsedMessage.segmentOrder.flatMap(name =>
    parsedMessage.segments.get(name) ?? []
  )

  if (segments.length === 0) {
    return <p className="text-sm text-gray-400 italic">No segments parsed</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {segments.map((seg, idx) => (
        <SegmentCard
          key={`${seg.name}-${idx}`}
          segment={seg}
          issues={issuesBySegment.get(seg.name) ?? []}
        />
      ))}
    </div>
  )
}
