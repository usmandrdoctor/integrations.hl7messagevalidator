import { useState } from 'react'
import type { ValidationResult } from './types/validation'
import { validate } from './validation'
import { PageShell } from './components/layout/PageShell'
import { Header } from './components/layout/Header'
import { MessageInput } from './components/input/MessageInput'
import { ResultsPanel } from './components/results/ResultsPanel'

export default function App() {
  const [rawMessage, setRawMessage] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  function handleValidate() {
    const validationResult = validate(rawMessage)
    setResult(validationResult)
  }

  return (
    <PageShell>
      <Header />

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-heading text-sm font-semibold text-brand-primaryDark mb-3 uppercase tracking-wide">
              HL7 Message
            </h2>
            <MessageInput
              value={rawMessage}
              onChange={setRawMessage}
              onValidate={handleValidate}
            />
          </div>

          {/* Right: Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-h-64">
            <h2 className="font-heading text-sm font-semibold text-brand-primaryDark mb-3 uppercase tracking-wide">
              Validation Results
            </h2>

            {result ? (
              <ResultsPanel result={result} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-brand-primaryLight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 font-body">Paste a message and click <strong>Validate</strong></p>
                <p className="text-xs text-gray-300 mt-1 font-kalam">or use Ctrl+Enter</p>
              </div>
            )}
          </div>
        </div>
      </main>

    </PageShell>
  )
}
