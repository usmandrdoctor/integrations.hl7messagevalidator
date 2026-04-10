import type { ValidationIssue } from '../../types/validation'
import { ErrorItem } from './ErrorItem'

interface ErrorListProps {
  issues: ValidationIssue[]
}

export function ErrorList({ issues }: ErrorListProps) {
  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-700 text-sm py-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        No issues found
      </div>
    )
  }

  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')
  const infos = issues.filter(i => i.severity === 'info')

  return (
    <div className="flex flex-col gap-4">
      {errors.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-2">
            Errors ({errors.length})
          </h3>
          <div className="flex flex-col gap-2">
            {errors.map((issue, idx) => (
              <ErrorItem key={`${issue.ruleId}-${idx}`} issue={issue} />
            ))}
          </div>
        </section>
      )}

      {warnings.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">
            Warnings ({warnings.length})
          </h3>
          <div className="flex flex-col gap-2">
            {warnings.map((issue, idx) => (
              <ErrorItem key={`${issue.ruleId}-${idx}`} issue={issue} />
            ))}
          </div>
        </section>
      )}

      {infos.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">
            Info ({infos.length})
          </h3>
          <div className="flex flex-col gap-2">
            {infos.map((issue, idx) => (
              <ErrorItem key={`${issue.ruleId}-${idx}`} issue={issue} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
