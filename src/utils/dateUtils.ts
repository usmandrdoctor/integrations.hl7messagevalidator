const MIN_YEAR = 1900

/**
 * Validate an HL7 date string (YYYYMMDD).
 * Returns null if valid, or an error message string if invalid.
 */
export function validateHL7Date(value: string, allowEmpty = false): string | null {
  if (!value) return allowEmpty ? null : 'Value is required'
  if (!/^\d{8}$/.test(value)) return `Invalid date format — expected YYYYMMDD, got "${value}"`

  const year = parseInt(value.substring(0, 4), 10)
  const month = parseInt(value.substring(4, 6), 10)
  const day = parseInt(value.substring(6, 8), 10)

  if (year < MIN_YEAR) return `Date must not be before 01-01-${MIN_YEAR} (got ${value})`
  if (month < 1 || month > 12) return `Invalid month ${month} in date "${value}"`

  const daysInMonth = new Date(year, month, 0).getDate()
  if (day < 1 || day > daysInMonth) return `Invalid day ${day} for month ${month} in date "${value}"`

  return null
}

/**
 * Validate an HL7 datetime string (YYYYMMDDHHMMSS).
 * Returns null if valid, or an error message string if invalid.
 */
export function validateHL7DateTime(value: string, allowEmpty = false): string | null {
  if (!value) return allowEmpty ? null : 'Value is required'
  // Accept YYYYMMDDHHMMSS (14 chars) or YYYYMMDDHHMM (12 chars)
  if (!/^\d{12,14}$/.test(value)) {
    return `Invalid datetime format — expected YYYYMMDDHHMMSS, got "${value}"`
  }

  const datePart = value.substring(0, 8)
  const dateError = validateHL7Date(datePart)
  if (dateError) return dateError

  const hours = parseInt(value.substring(8, 10), 10)
  const minutes = parseInt(value.substring(10, 12), 10)
  const seconds = value.length >= 14 ? parseInt(value.substring(12, 14), 10) : 0

  if (hours < 0 || hours > 23) return `Invalid hours ${hours} in datetime "${value}"`
  if (minutes < 0 || minutes > 59) return `Invalid minutes ${minutes} in datetime "${value}"`
  if (seconds < 0 || seconds > 59) return `Invalid seconds ${seconds} in datetime "${value}"`

  return null
}

/**
 * Normalise an HL7 datetime string to 14 chars for comparison.
 * Pads with zeros if needed.
 */
export function normaliseDateTime(value: string): string {
  return value.substring(0, 14).padEnd(14, '0')
}
