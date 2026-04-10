import type { ValidationIssue } from '../../types/validation'
import { Badge } from '../shared/Badge'

interface ErrorItemProps {
  issue: ValidationIssue
}

const SEVERITY_ICON = {
  error: (
    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const BORDER_CLASS = {
  error: 'border-l-red-400',
  warning: 'border-l-amber-400',
  info: 'border-l-blue-400',
}

export function ErrorItem({ issue }: ErrorItemProps) {
  return (
    <div className={`flex gap-3 pl-3 border-l-2 py-1 ${BORDER_CLASS[issue.severity]}`}>
      {SEVERITY_ICON[issue.severity]}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {issue.fieldRef && (
            <code className="text-xs font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
              {issue.fieldRef}
            </code>
          )}
          <Badge variant={issue.severity}>
            {issue.severity}
          </Badge>
        </div>
        <p className="text-sm text-gray-700 mt-0.5">{issue.message}</p>
      </div>
    </div>
  )
}
