"use client";

import { useState } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { askAssistant, ChatMessage } from "@/shared/lib/api";
import { parseUnknownError } from "@/shared/lib/api-error-handler";

export default function FinancialAssistantChat() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) {
    return null;
  }

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const history = messages;
    const nextMessages: ChatMessage[] = [...history, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const answer = await askAssistant(trimmed, history);
      setMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch (err) {
      parseUnknownError(err);
      setMessages([...nextMessages, { role: "assistant", content: t("common.str_AssistantError") }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 h-[28rem] bg-background border border-border rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("common.str_AiAssistant")}
            </span>
            <button onClick={() => setOpen(false)} aria-label={t("common.close")}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("common.str_AssistantWelcome")}</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm w-fit">
                {t("common.sending")}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t("common.str_AssistantPlaceholder")}
              className="flex-1 text-sm rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="rounded-md bg-primary text-primary-foreground p-2 disabled:opacity-50"
              aria-label={t("common.send")}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={t("common.str_AskAiAssistant")}
      >
        <Sparkles className="h-5 w-5" />
      </button>
    </div>
  );
}
