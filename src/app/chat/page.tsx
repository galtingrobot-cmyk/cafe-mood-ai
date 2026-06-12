"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, Plus, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { MenuItem } from "@/data/menu";

const REQUEST_KEYWORDS = [
  "menu baru", "tambah menu", "tambahkan menu", "request menu", "minta menu",
  "saran menu", "usul menu", "belum ada", "tidak ada", "ga ada", "gak ada",
  "nggak ada", "kenapa tidak ada", "kenapa gak ada", "kenapa ga ada",
  "bisa tambah", "bisakah tambah", "tolong tambah", "pengen ada", "pengen menu",
  "ingin menu", "kapan ada", "harusnya ada", "aku ingin ada", "aku ingin menu",
];

const isMenuRequest = (text: string) => {
  const lower = text.toLowerCase();
  return REQUEST_KEYWORDS.some(k => lower.includes(k));
};

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "/webhook/a9522953-456a-4ef3-a922-eed6c5a0b25f";

const MOODS = ["santai", "fokus", "sedih", "semangat", "romantis", "lelah"];
const TASTES = ["manis", "pahit", "segar", "creamy", "asam"];

const MOOD_EMOJI: Record<string, string> = {
  santai: "😌", fokus: "🎯", sedih: "🌧️", semangat: "🔥", romantis: "💛", lelah: "😴"
};

const TASTE_EMOJI: Record<string, string> = {
  manis: "🍯", pahit: "☕", segar: "🍃", creamy: "🥛", asam: "🍋"
};

const QUICK_PROMPTS = [
  "Butuh kopi buat begadang",
  "Minuman dingin yang enak",
  "Ada promo hari ini?",
  "Rekomendasiin dessert dong",
];

export default function ChatPage() {
  const { menuItems } = useMenu();
  const { addItem } = useCart();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Halo! ☕ Aku **AI Barista**-mu di sini.\n\nCerita aja mood kamu hari ini — aku bakalan cariin minuman yang paling pas buat kamu!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [taste, setTaste] = useState("");
  const [budget, setBudget] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sessionId] = useState(() => "session-" + Math.random().toString(36).substring(2, 15));
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Scroll window to top on initial load
      window.scrollTo(0, 0);
      return;
    }
    // Only scroll to bottom for new messages, not on load
    if (messages.length > 1 || isLoading) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isLoading]);

  const findMentionedItems = (content: string): MenuItem[] => {
    const lower = content.toLowerCase();
    const found: MenuItem[] = [];
    for (const item of menuItems) {
      if (lower.includes(item.name.toLowerCase()) && !found.find(f => f.id === item.id)) {
        found.push(item);
      }
    }
    return found;
  };

  const handleAdd = (item: MenuItem) => {
    addItem(item);
    toast.success(`${item.name} ditambahkan ke keranjang ☕`);
  };

  const sendMessage = async (text: string) => {
    if (!text || isLoading) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages.filter((m, i) => !(m.role === "assistant" && i === 0)), userMsg];

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (process.env.NEXT_PUBLIC_N8N_AUTH_KEY) {
        headers["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_N8N_AUTH_KEY}`;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ sessionId, messages: allMessages }),
      });

      if (resp.status === 429) throw new Error("Terlalu banyak permintaan, coba lagi nanti.");
      if (!resp.ok) throw new Error("Gagal menghubungi AI Barista");

      const contentType = resp.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await resp.json();
        const reply = data.reply || data.output || data.response || data.text || data.message || data.choices?.[0]?.message?.content || JSON.stringify(data);
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } else if (resp.body) {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") break;
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content || parsed.output || parsed.text;
                if (content) {
                  assistantSoFar += content;
                  setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
                      return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                    }
                    return [...prev, { role: "assistant", content: assistantSoFar }];
                  });
                }
              } catch { }
            }
          }
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Maaf, terjadi kesalahan: ${e.message}` }]);
    }
    setIsLoading(false);
  };

  const sendFromInput = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
    inputRef.current?.focus();
  };

  const sendFromForm = () => {
    if (!mood && !taste && !budget) return;
    const parts: string[] = [];
    if (mood) parts.push(`Mood saya **${mood}** ${MOOD_EMOJI[mood] || ""}`);
    if (taste) parts.push(`suka rasa **${taste}** ${TASTE_EMOJI[taste] || ""}`);
    if (budget) parts.push(`budget sekitar **Rp ${Number(budget).toLocaleString("id-ID")}**`);
    const prompt = parts.join(", ") + ". Rekomendasikan minuman & makanan yang cocok ya!";
    sendMessage(prompt);
    setShowFilter(false);
  };

  const hasFilterValue = mood || taste || budget;

  return (
    <>
      <div className="flex flex-col min-h-[calc(100dvh-4rem)] bg-[#FAFAF8]">

        {/* ── Top Bar ── */}
        <div className="border-b border-stone-200 bg-white shrink-0">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-4 py-3 w-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-950 flex items-center justify-center shadow-sm">
                  <span className="text-lg">☕</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-stone-800 text-sm leading-tight">AI Barista</p>
                <p className="text-xs text-emerald-500 font-medium">Online · Siap membantu</p>
              </div>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${hasFilterValue ? "bg-amber-950 text-white border-amber-950" : "bg-white text-stone-600 border-stone-200 hover:border-amber-900 hover:text-amber-900"}`}
            >
              <Sparkles className="w-3 h-3" />
              Preferensi
              {hasFilterValue && <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />}
            </button>
          </div>
        </div>

        {/* ── Filter Panel (collapsible) ── */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-b border-stone-200 bg-stone-50 shrink-0"
            >
              <div className="max-w-3xl mx-auto px-4 py-4 space-y-3 w-full">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Filter Rekomendasi</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-stone-500 mb-1 block">Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger className="h-9 text-xs bg-white border-stone-200">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOODS.map(m => (
                          <SelectItem key={m} value={m} className="text-xs capitalize">
                            {MOOD_EMOJI[m]} {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-stone-500 mb-1 block">Selera Rasa</Label>
                    <Select value={taste} onValueChange={setTaste}>
                      <SelectTrigger className="h-9 text-xs bg-white border-stone-200">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TASTES.map(t => (
                          <SelectItem key={t} value={t} className="text-xs capitalize">
                            {TASTE_EMOJI[t]} {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-stone-500 mb-1 block">Budget (Rp)</Label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      placeholder="50000"
                      className="h-9 text-xs bg-white border-stone-200"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={sendFromForm}
                    disabled={isLoading || (!mood && !taste && !budget)}
                    className="flex-1 h-9 text-xs bg-amber-950 text-white hover:bg-amber-900"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Cari Rekomendasi
                  </Button>
                  {hasFilterValue && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 text-stone-400 border-stone-200"
                      onClick={() => { setMood(""); setTaste(""); setBudget(""); }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Messages ── */}
        <div className="flex-1 pb-32 sm:pb-40">
          <div className="max-w-3xl mx-auto px-4 py-5 space-y-5 w-full">

            {messages.map((m, i) => {
              const isLastAssistant = m.role === "assistant" && i === messages.length - 1 && !isLoading && i > 0;
              const mentioned = isLastAssistant ? findMentionedItems(m.content) : [];
              const isFirst = i === 0 && m.role === "assistant";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Avatar – assistant */}
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="text-sm">☕</span>
                    </div>
                  )}

                  <div className="max-w-[78%] space-y-2">
                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user"
                          ? "bg-amber-950 text-white rounded-tr-sm"
                          : "bg-white text-stone-700 rounded-tl-sm border border-stone-100"
                        }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-p:my-0 prose-headings:text-stone-800 prose-strong:text-stone-800">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{m.content}</p>
                      )}
                    </div>

                    {/* Add-to-cart chips */}
                    {mentioned.length > 0 && (
                      <div className="space-y-1.5 pt-0.5">
                        {mentioned.map(item => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                              <p className="text-xs text-amber-700 font-medium mt-0.5">Rp {item.price.toLocaleString("id-ID")}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAdd(item)}
                              className="h-8 px-3 text-xs bg-amber-950 text-white hover:bg-amber-900 shrink-0 rounded-lg"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Tambah
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Quick prompts after first message */}
                    {isFirst && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {QUICK_PROMPTS.map(q => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="text-xs px-3 py-1.5 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-amber-800 hover:text-amber-900 hover:bg-amber-50 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Avatar – user */}
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-stone-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            <AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5 items-end"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-sm">☕</span>
                  </div>
                  <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={endRef} />
          </div>
        </div>

        {/* ── Input Bar ── */}
        <div className="sticky bottom-4 sm:bottom-6 z-50 shrink-0 px-3 sm:px-4 w-full">
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-2xl sm:rounded-3xl p-3 sm:p-4 max-w-3xl mx-auto w-full transition-all">
            <div className="flex gap-2 items-end w-full">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendFromInput()}
                  placeholder="Cerita mood kamu, atau tanya apa saja..."
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-900/30 focus:border-amber-900/40 transition-all resize-none disabled:opacity-50"
                />
              </div>
              <Button
                onClick={sendFromInput}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="w-11 h-11 rounded-xl sm:rounded-2xl bg-amber-950 text-white hover:bg-amber-900 shrink-0 disabled:opacity-40 transition-all shadow-sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-center text-[10px] text-stone-500 mt-3 font-medium">AI dapat membuat kesalahan. Konfirmasi ketersediaan menu dengan staf kami.</p>
          </div>
        </div>
      </div>
    </>
  );
}