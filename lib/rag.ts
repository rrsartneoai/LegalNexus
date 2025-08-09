import legalDocs from "@/data/legal-knowledge.json"

export type LegalDoc = {
  id: string
  title: string
  content: string
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
}

function termFreq(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const t of tokens) map.set(t, (map.get(t) || 0) + 1)
  return map
}

function score(query: string, doc: LegalDoc): number {
  // Lightweight lexical similarity (BM25-like without IDF for simplicity)
  const qTokens = tokenize(query)
  const dTokens = tokenize(doc.content + " " + doc.title)
  const dFreq = termFreq(dTokens)
  let s = 0
  for (const q of qTokens) {
    const f = dFreq.get(q) || 0
    if (f > 0) s += 1 + Math.log(1 + f)
    else {
      // partial match for Polish inflections (rudimentary)
      for (const [term, f2] of dFreq) {
        if (term.startsWith(q) || q.startsWith(term)) {
          s += 0.25 * (1 + Math.log(1 + f2))
          break
        }
      }
    }
  }
  // length normalization
  return s / Math.sqrt(1 + dTokens.length / 200)
}

export function retrieveTopK(query: string, k = 3): LegalDoc[] {
  const ranked = (legalDocs as LegalDoc[])
    .map((d) => ({ d, s: score(query, d) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.d)
  return ranked
}

export function buildSystemPrompt(language: "pl" | "en", contexts: LegalDoc[]): string {
  const contextBlock =
    contexts.length > 0
      ? contexts
          .map(
            (c, i) =>
              `[#${i + 1}] ${c.title}\nFragment (nie traktuj jako porady prawnej, lecz materiał kontekstowy):\n${c.content}`,
          )
          .join("\n\n")
      : "Brak dopasowanego kontekstu – odpowiedz ogólnie i wskaż konieczność konsultacji z prawnikiem."

  if (language === "pl") {
    return `Jesteś profesjonalnym asystentem prawnym AI dla polskiego systemu prawnego. 
Udzielaj rzetelnych, rzeczowych odpowiedzi w języku polskim, a na końcu dodawaj krótkie zastrzeżenie o konieczności weryfikacji przez prawnika.
Jeśli kontekst nie wystarcza, odpowiedz co możesz i wskaż czego brakuje.

Kontekst (RAG):
${contextBlock}`
  }
  return `You are a professional legal AI assistant. 
Provide accurate, concise answers in English, and include a short disclaimer that a qualified lawyer should verify the response.
If the context is insufficient, say what is missing.

Context (RAG):
${contextBlock}`
}
