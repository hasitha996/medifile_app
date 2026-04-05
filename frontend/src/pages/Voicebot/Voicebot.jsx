import { useState, useEffect, useRef, useCallback } from "react";

const COMMANDS = [
  { pattern: /upload|add file|new file/i,    reply: "Sure! Go to File Upload from the menu to upload a medical document.", route: "/files" },
  { pattern: /transfer|send file/i,          reply: "To transfer a file, go to File Transfer from the navigation bar.", route: "/files/transfer" },
  { pattern: /patients?/i,                   reply: "You can view and manage patients in the Patients section.", route: "/patients" },
  { pattern: /report|records?/i,             reply: "All medical records are listed in the File Upload section.", route: "/files" },
  { pattern: /help|what can you do/i,        reply: "I can help you navigate the app. Try: 'upload file', 'transfer file', 'patients', or 'logout'." },
  { pattern: /hello|hi|hey/i,                reply: "Hello! I'm MediBot, your medical assistant. How can I help you today?" },
  { pattern: /logout|sign out/i,             reply: "Click the Logout button in the top navigation to sign out." },
  { pattern: /how are you/i,                 reply: "I am functioning perfectly, thank you for asking!" },
];

const UNRECOGNIZED = "I didn't understand that. Try saying: 'upload file', 'transfer file', 'patients', or 'help'.";

const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const QUICK_CMDS = ["upload file", "transfer file", "patients", "help", "hello"];

const Voicebot = () => {
  const [messages, setMessages]     = useState([{ from: "bot", text: "Hello! I'm MediBot. Click 'Start Listening' and speak a command." }]);
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput]   = useState("");
  const recognitionRef              = useRef(null);
  const bottomRef                   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.95;
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
    setTimeout(() => { setMessages((prev) => [...prev, { from: "bot", text: reply }]); speak(reply); }, 400);
  }, []);

  const startListening = () => {
    if (!isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => { setListening(false); setTranscript(""); };
    rec.onerror  = () => { setListening(false); };
    rec.onresult = (e) => {
      const result = e.results[e.results.length - 1];
      const text   = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) { handleCommand(text); setTranscript(""); }
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };
  const handleTextSubmit = (e) => { e.preventDefault(); handleCommand(textInput); setTextInput(""); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">MediBot — Voice Assistant</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Use voice or text to navigate the application.
          {!isSupported && <span className="text-red-500 ml-1">(Voice not supported — use text below)</span>}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ height: "480px" }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">MediBot</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-400">{listening ? "Listening…" : isSpeaking ? "Speaking…" : "Online"}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.from === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {transcript && (
                <div className="flex items-end gap-2 flex-row-reverse">
                  <div className="max-w-[78%] px-4 py-2.5 rounded-2xl text-sm bg-indigo-400/70 text-white italic rounded-br-sm">
                    {transcript}
                  </div>
                </div>
              )}

              {isSpeaking && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    {[0,1,2].map((j) => <span key={j} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Text Input */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-50">
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a command…"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="flex flex-col gap-4">
          {/* Mic Button */}
          {isSupported && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
              <p className="text-sm font-semibold text-gray-700">Voice Control</p>
              <button
                onClick={listening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  listening
                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {listening && (
                  <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
                )}
                <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {listening ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-7a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
              </button>
              <p className={`text-xs font-medium ${ listening ? "text-red-500" : "text-gray-400"}`}>
                {listening ? "Tap to stop" : isSpeaking ? "Speaking…" : "Tap to speak"}
              </p>
            </div>
          )}

          {/* Quick Commands */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Commands</p>
            <div className="flex flex-col gap-2">
              {QUICK_CMDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleCommand(cmd)}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-medium transition-colors capitalize"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voicebot;
