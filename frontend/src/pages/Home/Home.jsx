import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getReports } from "../../services/fileService";
import { getUsers } from "../../services/userService";

const CATEGORY_COLORS = {
  Radiology:    "bg-indigo-100 text-indigo-700",
  Cardiology:   "bg-rose-100 text-rose-700",
  Laboratory:   "bg-emerald-100 text-emerald-700",
  Prescription: "bg-amber-100 text-amber-700",
};

const FileExtBadge = ({ name }) => {
  const ext = name?.split(".").pop()?.toUpperCase() ?? "DOC";
  const colors = {
    PDF: "bg-red-100 text-red-600",
    JPG: "bg-amber-100 text-amber-600",
    JPEG: "bg-amber-100 text-amber-600",
    PNG: "bg-sky-100 text-sky-600",
    DCM: "bg-purple-100 text-purple-600",
  };
  return (
    <div className={`w-10 h-10 rounded-xl ${colors[ext] ?? "bg-gray-100 text-gray-600"} flex items-center justify-center flex-shrink-0`}>
      <span className="text-[10px] font-bold leading-none">{ext.slice(0, 3)}</span>
    </div>
  );
};

const StatCard = ({ label, value, gradient, icon, to, sub }) => (
  <Link to={to} className="block group">
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5`}>
      <div className="absolute -top-3 -right-3 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
          {icon}
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-xs font-semibold opacity-90 uppercase tracking-wider mt-1">{label}</p>
        {sub && <p className="text-[11px] opacity-65 mt-0.5">{sub}</p>}
      </div>
    </div>
  </Link>
);

const QUICK_ACTIONS = [
  {
    to: "/files", label: "Upload File", desc: "Add new document", cls: "from-indigo-500 to-indigo-600",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  },
  {
    to: "/files/transfer", label: "Transfer File", desc: "Send to doctor/nurse", cls: "from-sky-500 to-sky-600",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  },
  {
    to: "/voicebot", label: "MediBot", desc: "Voice assistant", cls: "from-violet-500 to-violet-600",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-7a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  },
  {
    to: "/patients", label: "Patients", desc: "Manage records & staff", cls: "from-slate-600 to-slate-700",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const HONORIFICS = new Set(["dr.", "mr.", "mrs.", "ms.", "prof.", "nurse"]);

const getFirstName = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/);
  const first = parts.find((p) => !HONORIFICS.has(p.toLowerCase().replace(",", "")));
  return first ?? parts[0] ?? "there";
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const reports  = getReports();
  const users    = getUsers();
  const patients = users.filter((u) => u.role === "patient").length;
  const doctors  = users.filter((u) => u.role === "doctor" || u.role === "nurse").length;
  const pending  = reports.filter((r) => r.status === "available").length;
  const sent     = reports.filter((r) => r.status === "transferred").length;

  const stats = [
    {
      label: "Total Files", gradient: "from-indigo-500 to-indigo-600", to: "/files",
      value: reports.length, sub: `${pending} pending`,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
    },
    {
      label: "Pending", gradient: "from-amber-400 to-amber-500", to: "/files/transfer",
      value: pending, sub: "awaiting transfer",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Transferred", gradient: "from-emerald-500 to-emerald-600", to: "/files/transfer",
      value: sent, sub: "completed",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Patients", gradient: "from-sky-500 to-sky-600", to: "/patients",
      value: patients, sub: "registered",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    },
    {
      label: "Staff", gradient: "from-violet-500 to-violet-600", to: "/patients",
      value: doctors, sub: "doctors & nurses",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting()}, {getFirstName(user?.name)} 👋</h1>
          <p className="mt-1 text-gray-500 text-sm">Here's what's happening with your medical files today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ to, icon, label, desc, cls }) => (
            <Link key={to} to={to} className={`group relative overflow-hidden bg-gradient-to-br ${cls} text-white rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5`}>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-white/10 rounded-full" />
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  {icon}
                </div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs opacity-75 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Uploads</h2>
          <Link to="/files" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            View all
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {reports.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">No files uploaded yet.</p>
              <Link to="/files" className="inline-block mt-2 text-indigo-600 text-sm font-medium hover:underline">Upload your first file →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reports.slice(-5).reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileExtBadge name={r.name} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[r.category] ?? "bg-gray-100 text-gray-600"}`}>{r.category}</span>
                        <span className="text-xs text-gray-400">{r.patientName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                    <span className="text-xs text-gray-400">{new Date(r.uploadedAt).toLocaleDateString()}</span>
                    {r.status === "transferred" ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Transferred</span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
