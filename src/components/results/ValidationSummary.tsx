import type { ValidationResult } from '../../types/validation'

interface ValidationSummaryProps {
  result: ValidationResult
}

export function ValidationSummary({ result }: ValidationSummaryProps) {
  const errorCount = result.issues.filter(i => i.severity === 'error').length
  const warningCount = result.issues.filter(i => i.severity === 'warning').length

  const isPass = result.isValid && errorCount === 0

  return (
    <div
      className={`rounded-xl p-5 border-2 ${
        isPass
          ? 'bg-green-50 border-green-300'
          : 'bg-red-50 border-red-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isPass ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isPass ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-lg ${isPass ? 'text-green-800' : 'text-red-800'}`}>
            {isPass ? 'Message is valid' : 'Validation failed'}
          </p>

          <div className="mt-1 flex flex-wrap gap-3 text-sm">
            {result.messageType && result.triggerEvent && (
              <span className={`font-mono font-medium ${isPass ? 'text-green-700' : 'text-red-700'}`}>
                {result.messageType}^{result.triggerEvent}
              </span>
            )}

            {!isPass && (
              <>
                {errorCount > 0 && (
                  <span className="text-red-700">
                    <strong>{errorCount}</strong> error{errorCount !== 1 ? 's' : ''}
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-amber-700">
                    <strong>{warningCount}</strong> warning{warningCount !== 1 ? 's' : ''}
                  </span>
                )}
              </>
            )}

            {isPass && warningCount > 0 && (
              <span className="text-amber-700">
                {warningCount} warning{warningCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
