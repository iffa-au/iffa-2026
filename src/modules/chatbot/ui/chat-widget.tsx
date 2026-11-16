"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { MessageCircle, RotateCcw, SendHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { isAllowedExternalLink, isSiteLink } from "@/modules/chatbot/lib/links";

/**
 * The floating "Ask IFFA" chat. Talks to /api/chat and streams the answer in.
 *
 * The conversation is kept in sessionStorage so it survives moving between
 * pages, and is gone when the tab closes. Nothing is sent anywhere else.
 */

/**
 * `sig` is the server's signature on its own answers. It is sent back with the
 * history so the server can tell real answers from edited ones.
 * `failed` marks an answer that didn't work (busy, timed out, cut off); the
 * widget offers "Try again" for it.
 */
type Message = { role: "user" | "assistant"; content: string; sig?: string; failed?: boolean };

const STORAGE_KEY = "iffa-chat";
const GREETING =
  "Hi! I'm the IFFA Assistant. Ask me about the festival programme, submitting a film, the awards or the Talent Lab.";
/** The server ends each answer with this character followed by JSON ({ sig } or { blocked }). */
const TRAILER = "";
const BLOCKED_REPLY =
  "Sorry, I can't help with that. Ask me about the festival, submitting a film, the awards or the Talent Lab.";
/** The server stops trying after about 30s; don't let the browser wait much longer. */
const GIVE_UP_MS = 45_000;
const SLOW_NOTE_MS = 6_000;
const SUGGESTIONS = [
  "When is the festival?",
  "How do I submit my film?",
  "What are the award categories?",
  "What is the Talent Lab?",
];

/**
 * The history to send. Error messages shown in the chat ("busy", "couldn't
 * connect") have no signature, so they are left out together with the
 * question they failed on; otherwise the server would distrust the history.
 */
function forServer(messages: Message[]): Message[] {
  const out: Message[] = [];
  for (const m of messages) {
    if (m.role === "assistant" && !m.sig) {
      if (out.at(-1)?.role === "user") out.pop();
      continue;
    }
    out.push(m);
  }
  return out;
}

/**
 * Renders the small markdown subset the bot uses: links, **bold** and "- " bullets.
 * Only links the bot is allowed to use (lib/links.ts) become clickable, so a
 * made-up page or outside site shows as plain text instead of a broken link.
 */
function renderInline(text: string, onNavigate: () => void): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href, bold] = match;
    if (bold) {
      parts.push(<strong key={match.index}>{bold}</strong>);
    } else if (isSiteLink(href)) {
      parts.push(
        <Link key={match.index} href={href} onClick={onNavigate} className="text-yellow-400 underline underline-offset-2">
          {label}
        </Link>,
      );
    } else if (isAllowedExternalLink(href)) {
      parts.push(
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline underline-offset-2">
          {label}
        </a>,
      );
    } else {
      parts.push(label);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MessageBody({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const bullet = /^\s*[-*•]\s+/.test(line);
        const content = renderInline(line.replace(/^\s*[-*•]\s+/, ""), onNavigate);
        if (!line.trim()) return <div key={i} className="h-2" />;
        return bullet ? (
          <div key={i} className="flex gap-2 pl-1">
            <span aria-hidden>•</span>
            <span>{content}</span>
          </div>
        ) : (
          <p key={i}>{content.map((c, j) => <Fragment key={j}>{c}</Fragment>)}</p>
        );
      })}
    </>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  // Restored after a page change. Safe for hydration: the panel starts closed,
  // so the messages are not in the server-rendered HTML.
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]") as Message[];
      // Drop an answer that was still empty when the page changed.
      return saved.filter((m) => m.content);
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false); // shown when the answer takes more than a few seconds
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /** `before` is the conversation to add the question to (Try again passes it without the failed turn). */
  async function send(text: string, before: Message[] = messages) {
    const question = text.trim();
    if (!question || busy) return;

    const history: Message[] = [...before, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const setAnswer = (content: string, sig?: string, failed?: boolean) =>
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content, sig, failed }]);

    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const slowTimer = setTimeout(() => setSlow(true), SLOW_NOTE_MS);
    const giveUp = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, GIVE_UP_MS);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: forServer(history).slice(-10) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        // 5xx (busy, unavailable) is worth retrying; 4xx (rate limit, bad input) isn't.
        setAnswer(
          data?.error ?? "Something went wrong. Please try again, or use the [contact page](/contact).",
          undefined,
          res.status >= 500 || !data?.error,
        );
        return;
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let raw = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        raw += value;
        setSlow(false);
        setAnswer(raw.split(TRAILER)[0]);
      }
      const [answer, trailer] = raw.split(TRAILER);
      let meta: { sig?: string; blocked?: boolean } = {};
      try {
        meta = trailer ? JSON.parse(trailer) : {};
      } catch {}
      if (meta.blocked) setAnswer(BLOCKED_REPLY);
      else if (!answer.trim()) setAnswer("Sorry, I couldn't answer that. Please try again.", undefined, true);
      // No signature means the stream stopped before the end (connection or AI dropped out).
      else if (!meta.sig) setAnswer(`${answer.trimEnd()}\n\n(The answer was cut off. Please try again.)`, undefined, true);
      else setAnswer(answer, meta.sig);
    } catch {
      if (timedOut) {
        setAnswer("The assistant took too long to answer. Please try again in a moment.", undefined, true);
      } else if (!controller.signal.aborted) {
        setAnswer("I couldn't connect. Please check your connection and try again.", undefined, true);
      }
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(giveUp);
      setSlow(false);
      setBusy(false);
    }
  }

  /** Asks the last question again, replacing the failed answer. */
  function retry() {
    const question = messages.at(-2);
    if (busy || question?.role !== "user") return;
    send(question.content, messages.slice(0, -2));
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
  }

  const close = () => setOpen(false);

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="IFFA Assistant chat"
          className="fixed inset-x-4 bottom-24 z-[60] flex h-[min(560px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] text-sm text-white shadow-2xl sm:left-auto sm:right-6 sm:w-[380px]"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
            <div>
              <p className="font-semibold text-yellow-400">IFFA Assistant</p>
              <p className="text-xs text-white/50">Automated answers from the IFFA website</p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button onClick={reset} className="rounded px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white">
                  New chat
                </button>
              )}
              <button onClick={close} aria-label="Close chat" className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 leading-relaxed">
              {GREETING}
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-yellow-400/40 px-3 py-1 text-xs text-yellow-400 transition-colors hover:bg-yellow-400/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] space-y-1 rounded-2xl px-3 py-2 leading-relaxed",
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-yellow-400 text-black"
                    : "rounded-tl-sm bg-white/[0.06]",
                )}
              >
                {m.content ? (
                  m.role === "user" ? m.content : <MessageBody text={m.content} onNavigate={close} />
                ) : (
                  <span className="inline-flex gap-1 py-1" aria-label="Typing">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="size-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                )}
              </div>
            ))}

            {!busy && messages.at(-1)?.failed && (
              <button
                onClick={retry}
                className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/40 px-3 py-1 text-xs text-yellow-400 transition-colors hover:bg-yellow-400/10"
              >
                <RotateCcw className="size-3" /> Try again
              </button>
            )}

            {busy && slow && (
              <p className="text-xs text-white/50">Still thinking… the free AI service can be slow at busy times.</p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/10 p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={1000}
                placeholder="Ask a question…"
                aria-label="Your question"
                className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-yellow-400/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black transition-opacity disabled:opacity-40"
              >
                <SendHorizontal className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-white/40">
              AI answers can be wrong. Please check the linked page. Don&apos;t share personal details here.
            </p>
          </form>
        </section>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close IFFA Assistant" : "Open IFFA Assistant"}
        aria-expanded={open}
        className="fixed bottom-6 right-4 z-[60] flex size-14 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg shadow-black/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
