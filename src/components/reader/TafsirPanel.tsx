"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
  surah: number;
  ayah: number;
  verseKey: string;
  arabicText: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function TafsirPanel({
  isOpen,
  onClose,
  surah,
  ayah,
  verseKey,
  arabicText,
}: TafsirPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Reset messages when verse changes
  useEffect(() => {
    setMessages([]);
    setInput("");
    setIsStreaming(false);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [verseKey]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const sendMessage = useCallback(async () => {
    const question = input.trim();
    if (!question || isStreaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsStreaming(true);

    // Add an empty assistant message that we will stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("tqg-token")
          : null;

      const res = await fetch("/api/tafsir/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          surah,
          ayah,
          verseKey,
          arabicText,
          question,
          history: messages,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "An error occurred. Please try again.",
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setIsStreaming(false);
        return;
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.content || parsed.text || "";
              if (chunk) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + chunk,
                  };
                  return updated;
                });
              }
            } catch {
              // If it's plain text SSE (not JSON), append directly
              if (data && data !== "[DONE]") {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + data,
                  };
                  return updated;
                });
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // User cancelled — no action needed
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            const last = updated[updated.length - 1];
            if (last.role === "assistant" && !last.content) {
              updated[updated.length - 1] = {
                role: "assistant",
                content: "Connection failed. Please try again.",
              };
            }
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, surah, ayah, verseKey, arabicText, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
  };

  return (
    <>
      <style>{`
        .tfp-overlay {
          position: fixed; inset: 0; z-index: 998;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .tfp-overlay.open { opacity: 1; pointer-events: auto; }

        .tfp-panel {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 999;
          width: 420px; max-width: 100vw;
          background: #1E1A13;
          border-left: 1px solid rgba(212, 180, 74, 0.12);
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.4);
        }
        .tfp-panel.open { transform: translateX(0); }

        .tfp-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(212, 180, 74, 0.10);
          flex-shrink: 0;
        }
        .tfp-header-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .tfp-title {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 20px; font-weight: 500;
          color: #D4B44A;
        }
        .tfp-close {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(212, 180, 74, 0.15);
          border-radius: 8px; background: none;
          color: rgba(212, 180, 74, 0.50);
          cursor: pointer; transition: all 0.2s;
        }
        .tfp-close:hover {
          border-color: rgba(212, 180, 74, 0.35);
          color: #D4B44A;
          background: rgba(212, 180, 74, 0.08);
        }

        .tfp-verse-box {
          background: rgba(212, 180, 74, 0.04);
          border: 1px solid rgba(212, 180, 74, 0.10);
          border-radius: 8px; padding: 14px 16px;
        }
        .tfp-verse-arabic {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          font-size: 22px; line-height: 2;
          color: #F5E8B0; direction: rtl;
          text-align: right; margin-bottom: 8px;
        }
        .tfp-verse-ref {
          font-family: 'EB Garamond', serif;
          font-size: 12px; color: rgba(212, 180, 74, 0.40);
          letter-spacing: 0.06em;
        }

        .tfp-chat {
          flex: 1; overflow-y: auto;
          padding: 20px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .tfp-chat::-webkit-scrollbar { width: 4px; }
        .tfp-chat::-webkit-scrollbar-track { background: transparent; }
        .tfp-chat::-webkit-scrollbar-thumb {
          background: rgba(212, 180, 74, 0.15);
          border-radius: 2px;
        }

        .tfp-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 40px 20px;
        }
        .tfp-empty-icon {
          width: 48px; height: 48px;
          border: 1px solid rgba(212, 180, 74, 0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .tfp-empty-text {
          font-family: 'EB Garamond', serif;
          font-size: 15px; color: rgba(212, 180, 74, 0.35);
          line-height: 1.6;
        }

        .tfp-msg {
          max-width: 90%;
        }
        .tfp-msg-user {
          align-self: flex-end;
          background: rgba(212, 180, 74, 0.10);
          border: 1px solid rgba(212, 180, 74, 0.15);
          border-radius: 14px 14px 4px 14px;
          padding: 10px 16px;
        }
        .tfp-msg-assistant {
          align-self: flex-start;
          background: rgba(212, 180, 74, 0.04);
          border: 1px solid rgba(212, 180, 74, 0.08);
          border-radius: 14px 14px 14px 4px;
          padding: 12px 16px;
        }
        .tfp-msg-text {
          font-family: 'EB Garamond', serif;
          font-size: 15px; line-height: 1.7;
          color: #F0DFA0; white-space: pre-wrap;
          word-wrap: break-word;
        }
        .tfp-msg-user .tfp-msg-text {
          color: #D4B44A;
        }
        .tfp-msg-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px; letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(212, 180, 74, 0.30);
          margin-bottom: 4px;
        }

        @keyframes tfp-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .tfp-cursor {
          display: inline-block; width: 2px; height: 14px;
          background: #D4B44A; margin-left: 2px;
          vertical-align: text-bottom;
          animation: tfp-cursor-blink 0.8s ease-in-out infinite;
        }

        .tfp-input-area {
          padding: 16px 24px 20px;
          border-top: 1px solid rgba(212, 180, 74, 0.10);
          flex-shrink: 0;
        }
        .tfp-input-wrap {
          display: flex; align-items: center; gap: 8px;
          background: rgba(212, 180, 74, 0.05);
          border: 1px solid rgba(212, 180, 74, 0.15);
          border-radius: 12px; padding: 4px 4px 4px 16px;
          transition: border-color 0.2s;
        }
        .tfp-input-wrap:focus-within {
          border-color: rgba(212, 180, 74, 0.35);
        }
        .tfp-input {
          flex: 1; background: none; border: none; outline: none;
          font-family: 'EB Garamond', serif;
          font-size: 15px; color: #F0DFA0;
          padding: 8px 0;
        }
        .tfp-input::placeholder {
          color: rgba(212, 180, 74, 0.30);
        }
        .tfp-send {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; border: none;
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #1E1A13; cursor: pointer;
          transition: all 0.2s; flex-shrink: 0;
        }
        .tfp-send:hover {
          box-shadow: 0 0 16px rgba(212, 180, 74, 0.25);
          transform: translateY(-1px);
        }
        .tfp-send:disabled {
          opacity: 0.35; cursor: not-allowed;
          transform: none; box-shadow: none;
        }
        .tfp-stop {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px;
          border: 1px solid rgba(212, 180, 74, 0.30);
          background: rgba(212, 180, 74, 0.08);
          color: #D4B44A; cursor: pointer;
          transition: all 0.2s; flex-shrink: 0;
        }
        .tfp-stop:hover {
          border-color: rgba(212, 180, 74, 0.50);
          background: rgba(212, 180, 74, 0.15);
        }

        @media (max-width: 480px) {
          .tfp-panel { width: 100vw; }
        }
      `}</style>

      {/* Backdrop overlay */}
      <div
        className={`tfp-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`tfp-panel ${isOpen ? "open" : ""}`}>
        {/* Header with verse info */}
        <div className="tfp-header">
          <div className="tfp-header-top">
            <span className="tfp-title">Tafsir &amp; AI</span>
            <button className="tfp-close" onClick={onClose} aria-label="Close tafsir panel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="tfp-verse-box">
            <div className="tfp-verse-arabic">{arabicText}</div>
            <div className="tfp-verse-ref">
              Surah {surah} &middot; Ayah {ayah} &middot; {verseKey}
            </div>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="tfp-chat">
          {messages.length === 0 ? (
            <div className="tfp-empty">
              <div className="tfp-empty-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(212,180,74,0.35)" strokeWidth="1.5">
                  <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
                  <path d="M10 21h4" />
                </svg>
              </div>
              <p className="tfp-empty-text">
                Ask a question about this ayah.<br />
                Answers are grounded in classical tafsir.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`tfp-msg ${
                  msg.role === "user" ? "tfp-msg-user" : "tfp-msg-assistant"
                }`}
              >
                <div className="tfp-msg-label">
                  {msg.role === "user" ? "You" : "Tafsir AI"}
                </div>
                <div className="tfp-msg-text">
                  {msg.content}
                  {isStreaming &&
                    i === messages.length - 1 &&
                    msg.role === "assistant" && (
                      <span className="tfp-cursor" />
                    )}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="tfp-input-area">
          <div className="tfp-input-wrap">
            <input
              ref={inputRef}
              type="text"
              className="tfp-input"
              placeholder="Ask about this ayah..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            {isStreaming ? (
              <button className="tfp-stop" onClick={stopStreaming} aria-label="Stop streaming">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1" y="1" width="10" height="10" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                className="tfp-send"
                onClick={sendMessage}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
