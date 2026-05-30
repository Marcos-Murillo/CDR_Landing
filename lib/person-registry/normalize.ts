/** Normaliza cédula/documento: solo dígitos. */
export function normalizeDocument(value: string | undefined | null): string {
  if (!value || typeof value !== 'string') return ''
  return value.replace(/\D/g, '').trim()
}

/** Normaliza código estudiantil: trim + mayúsculas, sin espacios. */
export function normalizeCode(value: string | undefined | null): string {
  if (!value || typeof value !== 'string') return ''
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

export function isValidDocument(doc: string): boolean {
  return doc.length >= 6 && doc.length <= 12
}

export function isValidCode(code: string): boolean {
  return code.length >= 4
}

export function personKeyFromDocument(doc: string): string {
  return `d:${doc}`
}

export function personKeyFromCode(code: string): string {
  return `c:${code}`
}
