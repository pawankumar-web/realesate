export interface PropertyMeta {
  rera?: string | null
  possession?: string | null
  builder?: string | null
}

export function parsePropertyMeta(metaDescription?: string | null): PropertyMeta {
  if (!metaDescription) return {}
  try {
    const parsed = JSON.parse(metaDescription)
    return {
      rera: parsed.rera || null,
      possession: parsed.possession || null,
      builder: parsed.builder || null,
    }
  } catch {
    return {}
  }
}
