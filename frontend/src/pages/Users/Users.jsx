import { useState } from "react";
import { Link } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import Loader from "../../components/common/Loader/Loader";
import Button from "../../components/common/Button/Button";

const ROLE_BADGE = {
  admin:   "bg-gray-100 text-gray-700 ring-1 ring-gray-300",
  doctor:  "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  nurse:   "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  patient: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

const AVATAR_BG = {
  admin:   "bg-gray-200 text-gray-600",
  doctor:  "bg-indigo-100 text-indigo-700",
  nurse:   "bg-sky-100 text-sky-700",
  patient: "bg-emerald-100 text-emerald-700",
};

const ROLE_FILTERS = ["all", "doctor", "nurse", "patient", "admin"];

const Users = () => {
  const { users, loading, deleteUser } = useUsers();
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const countByRole = (role) => users.filter((u) => u.role === role).length;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients & Staff</h1>
          <p className="mt-0.5 text-gray-500 text-sm">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link to="/patients/new">
          <Button>+ Add Person</Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { role: "doctor",  label: "Doctors",  color: "text-indigo-700", bg: "bg-indigo-50",  border: "border-indigo-100" },
          { role: "nurse",   label: "Nurses",   color: "text-sky-700",    bg: "bg-sky-50",     border: "border-sky-100" },
          { role: "patient", label: "Patients", color: "text-emerald-700",bg: "bg-emerald-50", border: "border-emerald-100" },
          { role: "admin",   label: "Admins",   color: "text-gray-700",   bg: "bg-gray-50",    border: "border-gray-200" },
        ].map(({ role, label, color, bg, border }) => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
            className={`rounded-xl border px-4 py-3 text-left transition-all hover:shadow-sm ${
              roleFilter === role ? `${bg} ${border} ring-2 ring-offset-1 ring-indigo-300` : `bg-white border-gray-100`
            }`}
          >
            <p className={`text-2xl font-bold ${color}`}>{countByRole(role)}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Search + Role Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                roleFilter === r
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-400 text-sm">No records found.</p>
          </div>
        )}
        <div className="divide-y divide-gray-50">
          {filtered.map((user) => {
            const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={user.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center flex-shrink-0 ${AVATAR_BG[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_BADGE[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                      {user.speciality && <span className="text-xs text-gray-400 hidden sm:inline">· {user.speciality}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <Link to={`/patients/${user.id}/edit`}>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => deleteUser(user.id)}>Delete</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Users;
