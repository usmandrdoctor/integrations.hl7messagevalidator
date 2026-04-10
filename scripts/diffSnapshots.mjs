/**
 * diffSnapshots.mjs
 * Reads and writes snapshot files in data/snapshots/.
 * Compares fresh content against the stored snapshot to detect doc changes.
 */

import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SNAPSHOTS_DIR = join(__dirname, '..', 'data', 'snapshots')

function snapshotPath(id) {
  return join(SNAPSHOTS_DIR, `${id}.json`)
}

function hash(content) {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Compare fresh content to the stored snapshot.
 * @returns {{ type: 'new'|'changed'|'unchanged', previous: string|null, current: string }}
 */
export function diffSnapshot(source, freshContent) {
  const path = snapshotPath(source.id)

  if (!existsSync(path)) {
    return { type: 'new', previous: null, current: freshContent }
  }

  const stored = JSON.parse(readFileSync(path, 'utf8'))
  const freshHash = hash(freshContent)

  if (stored.contentHash === freshHash) {
    return { type: 'unchanged', previous: stored.content, current: freshContent }
  }

  return {
    type: 'changed',
    previous: stored.content,
    current: freshContent,
    previousFetchedAt: stored.fetchedAt,
  }
}

/**
 * Write (or overwrite) the snapshot file for a source.
 */
export function updateSnapshot(source, content) {
  const snapshot = {
    id: source.id,
    url: source.url,
    fetchedAt: new Date().toISOString(),
    contentHash: hash(content),
    content,
  }
  writeFileSync(snapshotPath(source.id), JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
}
