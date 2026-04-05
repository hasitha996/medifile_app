import { useState, useEffect, useRef, useCallback } from "react";

const COMMANDS = [
  { pattern: /upload|add file|new file/i,  reply: "Sure! Go to File Upload from the menu to upload a medical document." },
  { pattern: /transfer|send file/i,        reply: "To transfer a file, go to File Transfer from the navigation bar." },
  { pattern: /patients?/i,                 reply: "You can view and manage patients in the Patients section." },
  { pattern: /report|records?/i,           reply: "All medical records are listed in the File Upload section." },
  { pattern: /help|what can you do/i,      reply: "Try asking: 'upload file', 'transfer file', 'patients', 'hello', or 'how are you'." },
  { pattern: /hello|hi|hey/i,              reply: "Hello! I'm MediBot, your medical assistant. How can I help you?" },
  { pattern: /logout|sign out/i,           reply: "Click the Logout button in the top navigation to sign out." },
  { pattern: /how are you/i,               reply: "I'm functioning perfectly — thank you for asking! 😊" },
];

const UNRECOGNIZED = "I didn't catch that. Try: 'upload file', 'transfer file', 'patients', or 'help'.";
const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
const QUICK_CMDS = ["upload file", "transfer file", "patients", "help"];

const MediBotWidget = () => {
  const [open, setOpen]             = useState(false);
  const [messages, setMessages]     = useState([{ from: "bot", text: "Hi! I'm MediBot 🤖 — ask me anything or use the quick commands below." }]);
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput]   = useState("");
  const [unread, setUnread]         = useState(0);
  const recognitionRef              = useRef(null);
  const bottomRef                   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Increment unread badge when a new bot/user message arrives while panel is closed
  useEffect(() => {
    if (!open) setUnread((n) => n + 1);
  }, [messages, open]);

  // Clear unread count when the panel is opened
  useEffect(() => { if (open) setUnread(0); }, [open]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US"; utt.rate = 0.95;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend   = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const handleCommand = useCallback((input) => {
    const userText = input.trim();
    if (!userText) return;
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    const match = COMMANDS.find((c) => c.pattern.test(userText));
    const reply = match ? match.reply : UNRECOGNIZED;
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      speak(reply);
    }, 350);
  }, []);

  const startListening = () => {
    if (!isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 1;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => { setListening(false); setTranscript(""); };
    rec.onerror  = () => setListening(false);
    rec.onresult = (e) => {
      const result = e.results[e.results.length - 1];
      const text   = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) { handleCommand(text); setTranscript(""); }
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening  = () => { recognitionRef.current?.stop(); setListening(false); };
  const handleSubmit   = (e) => { e.preventDefault(); handleCommand(textInput); setTextInput(""); };

  return (
    <>
      {/* Popup panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-white font-semibold text-sm leading-none">MediBot</p>
                <p className="text-indigo-200 text-xs mt-0.5">
                  {listening ? "🔴 Listening…" : isSpeaking ? "Speaking…" : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-indigo-200 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 h-64 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-1.5 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.from === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                )}
                <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  msg.from === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {transcript && (
              <div className="flex items-end gap-1.5 flex-row-reverse">
                <div className="max-w-[82%] px-3 py-2 rounded-2xl text-xs bg-indigo-400 text-white opacity-70 italic rounded-br-none">
                  {transcript}
                </div>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-end gap-1.5">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                <div className="px-3 py-2 rounded-2xl text-xs bg-white border border-gray-100 text-gray-400 italic rounded-bl-none shadow-sm">Speaking…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 px-3 pt-2 pb-1 bg-white border-t border-gray-100">
            {QUICK_CMDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => handleCommand(cmd)}
                className="px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="px-3 pb-3 pt-2 bg-white flex gap-2 items-center">
            {isSupported && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  listening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                }`}
              >
                {listening ? "⏹" : "🎙"}
              </button>
            )}
            <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer ${
          open
            ? "bg-indigo-700 rotate-12 scale-95"
            : "bg-indigo-600 hover:bg-indigo-700 hover:scale-110"
        }`}
        aria-label="Open MediBot"
      >
        {open ? "✕" : "🤖"}
        {!open && unread > 1 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </>
  );
};

export default MediBotWidget;
