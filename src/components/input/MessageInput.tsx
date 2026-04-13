import { useEffect, useState } from 'react'
import { detectMessageType } from '../../parser'
import { Badge } from '../shared/Badge'
import { SampleLoader } from './SampleLoader'
import { SPEC_LINKS } from '../../constants/specLinks'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onValidate: () => void
}

export function MessageInput({ value, onChange, onValidate }: MessageInputProps) {
  const [detected, setDetected] = useState<{ messageType: string; triggerEvent: string } | null>(null)
  const [segmentCount, setSegmentCount] = useState(0)

  useEffect(() => {
    if (!value.trim()) {
      setDetected(null)
      setSegmentCount(0)
      return
    }
    const result = detectMessageType(value)
    setDetected(result)

    const count = value
      .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      .split('\n')
      .filter(l => l.trim().length > 0)
      .length
    setSegmentCount(count)
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onValidate()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <SampleLoader onLoad={onChange} />

        <button
          onClick={() => onChange('')}
          className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>

        {detected && (
          <Badge variant="neutral">
            {detected.messageType} {detected.triggerEvent}
          </Badge>
        )}

        {segmentCount > 0 && (
          <span className="text-xs text-gray-400 ml-auto">
            {segmentCount} segment{segmentCount !== 1 ? 's' : ''} detected
          </span>
        )}
      </div>

      {/* Spec link — shown when message type is detected */}
      {detected && SPEC_LINKS[detected.triggerEvent] && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
          <svg className="w-3.5 h-3.5 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>To view the specification for <strong>{detected.messageType} {detected.triggerEvent}</strong>, visit:</span>
          <a
            href={SPEC_LINKS[detected.triggerEvent]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primaryDark font-medium underline underline-offset-2 hover:text-brand-accent transition-colors break-all"
          >
            {SPEC_LINKS[detected.triggerEvent]}
          </a>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Paste your HL7 message here...\n\nSupported ADT: A28, A31, A40, A05, A38, A08\nSupported SIU: S12, S14, S15, S26, Z02\nSupported ORU: R01\nSupported MFN: Z03\nSupported REF: I12, I13, I14\n\nTip: Ctrl+Enter to validate`}
        spellCheck={false}
        className="w-full h-72 font-mono text-sm bg-white border border-gray-300 rounded-lg p-4 resize-y focus:outline-none focus:ring-2 focus:ring-brand-primaryDark focus:border-transparent placeholder-gray-300 text-gray-800 font-body"
      />

      {/* Validate button */}
      <button
        onClick={onValidate}
        disabled={!value.trim()}
        className="w-full py-2.5 px-4 rounded-lg font-heading font-semibold text-sm text-white bg-brand-primaryDark hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Validate message
      </button>
    </div>
  )
}
