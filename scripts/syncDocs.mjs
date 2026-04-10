/**
 * syncDocs.mjs — Main orchestrator for the monthly documentation sync.
 *
 * Flow:
 *  1. Load all doc sources from data/doc-sources.json
 *  2. Fetch each doc page
 *  3. Compare to stored snapshot
 *  4. For changed/new sources, call GitHub Models (GPT-4o) to analyse the diff
 *  5. Collect all actionable proposals and open a single PR
 *
 * Required environment variables:
 *  - GITHUB_TOKEN  GitHub Actions built-in token — used for GitHub Models AI calls
 *  - GH_TOKEN      Fine-grained PAT with contents+pull-requests write — used to create the PR
 *
 * Optional:
 *  - DOCS_AUTH_TOKEN  Bearer token if any doc source requires authentication
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fetchDoc } from './fetchDocs.mjs'
import { diffSnapshot } from './diffSnapshots.mjs'
import { callGitHubModel } from './callGitHubModel.mjs'
import { createPR } from './createPR.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')

function loadSources() {
  const raw = readFileSync(join(REPO_ROOT, 'data', 'doc-sources.json'), 'utf8')
  return JSON.parse(raw).sources
}

async function main() {
  const githubToken = process.env.GITHUB_TOKEN
  const ghToken = process.env.GH_TOKEN
  const docsAuthToken = process.env.DOCS_AUTH_TOKEN ?? ''

  if (!githubToken) {
    console.error('ERROR: GITHUB_TOKEN is not set. This is required for GitHub Models AI calls.')
    process.exit(1)
  }
  if (!ghToken) {
    console.error('ERROR: GH_TOKEN is not set. This is required to create pull requests.')
    process.exit(1)
  }

  const sources = loadSources()
  console.log(`Loaded ${sources.length} doc sources.\n`)

  const changedSources = []
  const errors = []

  for (const source of sources) {
    process.stdout.write(`[${source.id}] Fetching... `)

    let freshContent
    try {
      freshContent = await fetchDoc(source.url, source.auth ? docsAuthToken : '')
      console.log('OK')
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
      errors.push({ source: source.id, stage: 'fetch', error: err.message })
      continue
    }

    const diff = diffSnapshot(source, freshContent)

    if (diff.type === 'unchanged') {
      console.log(`[${source.id}] Unchanged — skipping.`)
      continue
    }

    console.log(`[${source.id}] ${diff.type === 'new' ? 'NEW (first-time snapshot)' : 'CHANGED'} — calling GitHub Models...`)

    // Throttle: wait 5s between AI calls to stay within the 24 req/min rate limit
    if (changedSources.length > 0 || errors.some(e => e.stage === 'ai')) {
      await new Promise(r => setTimeout(r, 5000))
    }

    let proposal
    try {
      proposal = await callGitHubModel(source, diff, githubToken)
    } catch (err) {
      console.log(`[${source.id}] AI call FAILED: ${err.message}`)
      errors.push({ source: source.id, stage: 'ai', error: err.message })
      continue
    }

    if (proposal.noActionNeeded) {
      console.log(`[${source.id}] No code changes needed (confidence: ${proposal.confidence}). Updating snapshot.`)
      // Still update the snapshot so we don't re-analyse the same content next run
      const { updateSnapshot } = await import('./diffSnapshots.mjs')
      updateSnapshot(source, freshContent)
      continue
    }

    console.log(`[${source.id}] ${proposal.changes.length} patch(es) proposed (confidence: ${proposal.confidence}).`)
    changedSources.push({ source, diff, proposal })
  }

  console.log('\n--- Summary ---')

  if (errors.length > 0) {
    console.warn(`Errors (${errors.length}):`)
    errors.forEach(e => console.warn(`  [${e.source}] ${e.stage}: ${e.error}`))
  }

  if (changedSources.length === 0) {
    console.log('No actionable changes found. No PR will be opened.')
    if (errors.length > 0) process.exit(1)
    process.exit(0)
  }

  console.log(`Actionable changes: ${changedSources.map(c => c.source.id).join(', ')}`)
  console.log('Creating PR...\n')

  try {
    await createPR(changedSources, ghToken)
  } catch (err) {
    console.error(`Failed to create PR: ${err.message}`)
    process.exit(1)
  }

  if (errors.length > 0) {
    console.warn('\nCompleted with errors — check the summary above.')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
