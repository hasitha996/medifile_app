import { Outlet } from "react-router-dom";

const FEATURES = [
  { icon: "🔒", title: "End-to-End Encrypted",   desc: "All files are secured in transit and at rest." },
  { icon: "📋", title: "HIPAA Compliant",          desc: "Built to the highest healthcare privacy standards." },
  { icon: "⚡", title: "Instant File Transfer",    desc: "Send records to doctors and nurses in seconds." },
  { icon: "🎙️", title: "Voice Assistant",          desc: "Navigate hands-free with built-in MediBot." },
];

const AuthLayout = () => (
  <div className="min-h-screen flex">
    {/* ── Left branding panel ── */}
    <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
            🏥
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">Medi<span className="text-sky-200">File</span></span>
        </div>
      </div>

      {/* Hero text */}
      <div className="relative z-10 space-y-6">
        <div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Secure medical<br />
            <span className="text-sky-200">records,</span> simplified.
          </h2>
          <p className="mt-4 text-indigo-200 text-lg leading-relaxed max-w-md">
            Upload, manage, and transfer patient files securely — all in one place.
          </p>
        </div>

        {/* Feature list */}
        <div className="grid grid-cols-1 gap-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-lg flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-indigo-200 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="relative z-10 text-indigo-300 text-xs">
        © 2026 MediFile · Trusted by healthcare professionals
      </p>
    </div>

    {/* ── Right form panel ── */}
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xl">🏥</div>
        <span className="text-indigo-700 text-xl font-bold tracking-tight">Medi<span className="text-sky-500">File</span></span>
      </div>

      <div className="w-full max-w-md">
        <Outlet />
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        🔒 Protected by end-to-end encryption · HIPAA compliant
      </p>
    </div>
  </div>
);

export default AuthLayout;

