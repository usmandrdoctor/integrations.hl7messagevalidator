/**
 * fetchDocs.mjs
 * Fetches a documentation page and extracts the article body text.
 * Strips nav, header, footer, scripts and styles to avoid noisy diffs.
 */

/**
 * @param {string} url
 * @param {string} [authToken]
 * @returns {Promise<string>} Cleaned article text
 */
export async function fetchDoc(url, authToken = '') {
  const headers = { 'User-Agent': 'hl7-validator-docs-sync/1.0' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  let html
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers, redirect: 'follow' })

    if (res.status === 401 || res.status === 403) {
      throw new Error(`HTTP ${res.status} fetching ${url} — set DOCS_AUTH_TOKEN secret and mark source as auth:true`)
    }
    if (res.status === 404) {
      throw new Error(`HTTP 404 fetching ${url} — remove or update this source in data/doc-sources.json`)
    }
    if (!res.ok) {
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, attempt * 2000))
        continue
      }
      throw new Error(`HTTP ${res.status} fetching ${url} after 3 attempts`)
    }

    html = await res.text()
    break
  }

  // Detect Intercom login redirect (docs site requires auth)
  if (html.includes('intercom-login') || html.includes('action="/auth/login"')) {
    throw new Error(`Login page returned for ${url} — set DOCS_AUTH_TOKEN secret`)
  }

  return extractArticleBody(html)
}

/**
 * Extracts the main article content from HTML.
 * Tries Intercom-specific selectors first, then falls back to stripping all tags.
 */
function extractArticleBody(html) {
  // Remove scripts, styles, and SVGs entirely
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')

  // Try to isolate the article body div (Intercom Help Center structure)
  const articleMatch = text.match(/<div[^>]+class="[^"]*article[^>]*>([\s\S]*?)<\/div>\s*(?:<div|$)/i)
  if (articleMatch) {
    text = articleMatch[1]
  }

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Normalise whitespace — collapse runs of spaces/newlines to single newline
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return text
}
