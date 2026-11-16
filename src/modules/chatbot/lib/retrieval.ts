import "server-only";

/**
 * Keyword search over the bot's knowledge (BM25, the ranking classic search
 * engines use). Runs inside the server: no extra API call, no vector database,
 * nothing to pay for.
 *
 * Why not embeddings? The content is a few hundred short, well-titled pieces,
 * and visitors mostly ask with the same words the site uses ("Talent Lab",
 * "submit", a film's title). Keyword search handles that well. If questions
 * start missing because people use different words, add embeddings then; the
 * rest of the bot doesn't change.
 */

export type Chunk = {
  /** Short id for logs, e.g. "faq:3" or "film:the-river". */
  id: string;
  /** Searched with extra weight. */
  title: string;
  /** What the model sees. */
  text: string;
};

const STOPWORDS = new Set(
  (
    "a an and are as at be but by can could do does did for from has have how i if in into is it its me my " +
    "of on or our so than that the their them then there these they this to us was we were what when where " +
    "which who why will with would you your about any some tell please much many get iffa"
  ).split(" "),
);

/** Words visitors use that the site says differently. Both sides are searched. */
const SYNONYMS: Record<string, string[]> = {
  cost: ["fee", "price", "ticket"],
  price: ["fee", "cost", "ticket"],
  fee: ["cost", "price"],
  enter: ["submit", "submission"],
  apply: ["submit", "submission", "register", "application"],
  send: ["submit"],
  movie: ["film"],
  kid: ["child", "family"],
  child: ["kid", "family"],
  award: ["category", "trophy", "winner"],
  prize: ["award", "trophy", "winner"],
  venue: ["location", "cinema", "theatre"],
  where: ["venue", "location"],
  date: ["when", "schedule"],
  schedule: ["programme", "program", "session"],
  programme: ["program", "schedule", "session"],
  show: ["screening", "session"],
  screening: ["session", "film"],
  mentor: ["mentorship", "coach"],
  course: ["workshop", "masterclass", "training", "program"],
  workshop: ["masterclass", "course"],
};

/** Very small stemmer: "screenings" -> "screening", "mentors" -> "mentor", "applied" -> "appli". */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

function expand(terms: string[]): string[] {
  const out = new Set(terms);
  for (const t of terms) for (const s of SYNONYMS[t] ?? []) out.add(stem(s));
  return [...out];
}

const K1 = 1.2;
const B = 0.75;
const TITLE_WEIGHT = 3; // a word in the title counts like three in the text

export type Index = {
  chunks: Chunk[];
  docs: Map<string, number>[];
  lengths: number[];
  avgLength: number;
  docFreq: Map<string, number>;
};

export function buildIndex(chunks: Chunk[]): Index {
  const docs = chunks.map((c) => {
    const tf = new Map<string, number>();
    for (const t of tokenize(c.title)) tf.set(t, (tf.get(t) ?? 0) + TITLE_WEIGHT);
    for (const t of tokenize(c.text)) tf.set(t, (tf.get(t) ?? 0) + 1);
    return tf;
  });
  const lengths = docs.map((tf) => [...tf.values()].reduce((a, b) => a + b, 0));
  const docFreq = new Map<string, number>();
  for (const tf of docs) for (const t of tf.keys()) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
  return {
    chunks,
    docs,
    lengths,
    avgLength: lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length),
    docFreq,
  };
}

function scoreAll(index: Index, query: string): number[] {
  const terms = expand(tokenize(query));
  const n = index.chunks.length;
  return index.docs.map((tf, i) => {
    let score = 0;
    for (const t of terms) {
      const f = tf.get(t);
      if (!f) continue;
      const df = index.docFreq.get(t) ?? 0;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      score += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * index.lengths[i]) / index.avgLength));
    }
    return score;
  });
}

/**
 * The best chunks for a question, within a size budget.
 *
 * `previous` is the visitor's earlier question, so a follow-up like "who is it
 * for?" still finds the Talent Lab chunks; it counts half as much.
 */
export function search(
  index: Index,
  question: string,
  previous = "",
  // 6 chunks / 5000 chars (~1,250 tokens) covers a question; more is mostly noise and costs tokens.
  { maxChunks = 6, maxChars = 5000 } = {},
): { chunk: Chunk; score: number }[] {
  const now = scoreAll(index, question);
  const before = previous ? scoreAll(index, previous) : null;
  const ranked = now
    .map((s, i) => ({ chunk: index.chunks[i], score: s + (before ? before[i] * 0.5 : 0) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) return [];

  // Drop weak matches: anything far below the best one is usually noise.
  const floor = ranked[0].score * 0.35;
  const picked: { chunk: Chunk; score: number }[] = [];
  let chars = 0;
  for (const r of ranked) {
    if (r.score < floor || picked.length >= maxChunks) break;
    if (chars + r.chunk.text.length > maxChars && picked.length) continue;
    picked.push(r);
    chars += r.chunk.text.length;
  }
  return picked;
}
