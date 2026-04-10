import { useState } from 'react'
import type { ValidationResult } from '../../types/validation'
import { ValidationSummary } from './ValidationSummary'
import { ErrorList } from './ErrorList'
import { SegmentBreakdown } from './SegmentBreakdown'

interface ResultsPanelProps {
  result: ValidationResult
}

type Tab = 'issues' | 'segments'

export function ResultsPanel({ result }: ResultsPanelProps) {
  const [tab, setTab] = useState<Tab>('issues')

  const errorCount = result.issues.filter(i => i.severity === 'error').length
  const warningCount = result.issues.filter(i => i.severity === 'warning').length
  const totalIssues = errorCount + warningCount

  return (
    <div className="flex flex-col gap-4">
      <ValidationSummary result={result} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          <button
            onClick={() => setTab('issues')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'issues'
                ? 'border-brand-primaryDark text-brand-primaryDark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Issues
            {totalIssues > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs bg-red-100 text-red-700">
                {totalIssues}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('segments')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'segments'
                ? 'border-brand-primaryDark text-brand-primaryDark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Segments
            {result.parsedMessage && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({result.parsedMessage.segmentOrder.length})
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {tab === 'issues' && (
        <ErrorList issues={result.issues} />
      )}

      {tab === 'segments' && result.parsedMessage && (
        <SegmentBreakdown
          parsedMessage={result.parsedMessage}
          issues={result.issues}
        />
      )}

      {tab === 'segments' && !result.parsedMessage && (
        <p className="text-sm text-gray-400 italic">No parsed message available</p>
      )}
    </div>
  )
}
