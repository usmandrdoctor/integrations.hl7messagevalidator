/**
 * callGitHubModel.mjs
 * Calls GitHub Models (GPT-4o) to interpret documentation changes and
 * propose TypeScript code patches.
 *
 * Uses the GITHUB_TOKEN available in GitHub Actions — no extra API key needed.
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const GITHUB_MODELS_URL = 'https://models.inference.ai.azure.com/chat/completions'

const SYSTEM_PROMPT = `You are an expert TypeScript developer maintaining an HL7 message validator.

The validator has these key files you may need to update:
1. src/constants/referenceData.ts — Set and Record constants for valid code values
2. src/validation/rules/*.ts — Segment validation functions
3. src/validation/messageTypeRules.ts — Required/optional segment configs per message type

When a documentation page changes, you analyse what changed and propose minimal code patches.

CRITICAL RULES:
- "currentCode" must be an EXACT verbatim substring of the current file (copy-paste it)
- Only propose changes that are directly caused by the doc change
- Do NOT refactor, reformat, or improve unrelated code
- If the change is cosmetic (rewording only, no structural impact), set noActionNeeded: true
- If you are uncertain about a change, set confidence to "low" rather than guessing

You MUST respond with ONLY valid JSON matching this schema (no extra text):
{
  "summary": "plain English summary of what changed and why",
  "confidence": "high" | "medium" | "low",
  "noActionNeeded": boolean,
  "changes": [
    {
      "file": "src/constants/referenceData.ts",
      "currentCode": "<exact verbatim substring from the file>",
      "proposedCode": "<replacement string>",
      "rationale": "why this specific change is needed"
    }
  ]
}`

/**
 * Load the current contents of all rule files affected by a source.
 */
function loadAffectedFileContents(source) {
  const files = [
    ...source.affects.ruleFiles,
    'src/constants/referenceData.ts',
    'src/validation/messageTypeRules.ts',
  ]
  const uniqueFiles = [...new Set(files)]

  return uniqueFiles
    .filter(f => existsSync(join(REPO_ROOT, f)))
    .map(f => {
      const content = readFileSync(join(REPO_ROOT, f), 'utf8')
      return `### ${f}\n\`\`\`typescript\n${content}\n\`\`\``
    })
    .join('\n\n')
}

/**
 * Call GitHub Models (GPT-4o) to analyse the doc change and propose patches.
 *
 * @param {object} source - Entry from doc-sources.json
 * @param {{ type: string, previous: string|null, current: string }} diff
 * @param {string} githubToken - GITHUB_TOKEN from Actions environment
 * @returns {Promise<{ summary: string, confidence: string, noActionNeeded: boolean, changes: Array }>}
 */
export async function callGitHubModel(source, diff, githubToken) {
  const fileContents = loadAffectedFileContents(source)

  const changeDescription = diff.type === 'new'
    ? `This is a NEW documentation source being monitored for the first time.\n\nDoc content:\n${diff.current}`
    : `Doc content CHANGED.\n\nPREVIOUS content:\n${diff.previous}\n\n---\n\nNEW content:\n${diff.current}`

  const userPrompt = `
## Documentation Source
- ID: ${source.id}
- URL: ${source.url}
- Description: ${source.description}
- Type: ${source.type}
- Affected rule files: ${source.affects.ruleFiles.join(', ')}
- Relevant referenceData keys: ${source.affects.referenceDataKeys.join(', ') || 'none'}
- Affected message type configs: ${source.affects.messageTypeConfigs.join(', ') || 'none'}

## Change
${changeDescription}

## Current Source Files
${fileContents}

## Task
${diff.type === 'new'
    ? 'This doc is being monitored for the first time. Compare the doc content to the current source files and identify any gaps or discrepancies. If the code already matches the docs correctly, set noActionNeeded: true.'
    : 'Analyse what changed between the previous and new doc content. Propose the minimal set of TypeScript code patches needed to keep the validator in sync with the docs.'}

Respond with ONLY the JSON object.`

  let lastError
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(GITHUB_MODELS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 4096,
        }),
      })

      if (res.status === 429) {
        const body = await res.text()
        // Parse wait time from error message e.g. "Please wait 4 seconds before retrying"
        const waitMatch = body.match(/wait (\d+) seconds?/i)
        const waitSecs = waitMatch ? parseInt(waitMatch[1], 10) + 2 : 15
        console.warn(`  Rate limited — waiting ${waitSecs}s before retry (attempt ${attempt}/5)...`)
        await new Promise(r => setTimeout(r, waitSecs * 1000))
        continue
      }

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`GitHub Models API returned ${res.status}: ${body}`)
      }

      const data = await res.json()
      const raw = data.choices?.[0]?.message?.content

      if (!raw) throw new Error('Empty response from GitHub Models API')

      const proposal = JSON.parse(raw)

      // Validate required fields
      if (typeof proposal.noActionNeeded !== 'boolean') {
        throw new Error('Response missing noActionNeeded field')
      }
      if (!Array.isArray(proposal.changes)) {
        throw new Error('Response missing changes array')
      }

      return proposal
    } catch (err) {
      lastError = err
      if (attempt < 5) {
        console.warn(`[${source.id}] GitHub Models attempt ${attempt} failed: ${err.message} — retrying...`)
        await new Promise(r => setTimeout(r, 5000))
      }
    }
  }

  throw new Error(`[${source.id}] GitHub Models call failed after 5 attempts: ${lastError.message}`)
}
