import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUserById, createUser, updateUser } from "../../services/userService";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";

const EMPTY_FORM = { name: "", email: "", role: "patient", speciality: "" };

const ROLE_CONFIG = {
  patient: { color: "bg-emerald-100 text-emerald-700 ring-emerald-200", label: "Patient" },
  doctor:  { color: "bg-indigo-100 text-indigo-700 ring-indigo-200",   label: "Doctor" },
  nurse:   { color: "bg-sky-100 text-sky-700 ring-sky-200",            label: "Nurse" },
  admin:   { color: "bg-gray-100 text-gray-700 ring-gray-200",         label: "Admin" },
};

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const found = getUserById(Number(id));
      if (found) setForm({ name: found.name, email: found.email, role: found.role, speciality: found.speciality || "" });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEdit) updateUser(Number(id), form);
    else createUser(form);
    setTimeout(() => { setLoading(false); navigate("/patients"); }, 400);
  };

  const roleConf = ROLE_CONFIG[form.role] ?? ROLE_CONFIG.patient;

  return (
    <div className="max-w-lg space-y-6">
      {/* Back link */}
      <Link to="/patients" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Patients &amp; Staff
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-2 ${roleConf.color}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Record" : "New Patient / Staff"}</h1>
          <p className="text-gray-500 text-sm">{isEdit ? "Update the details below." : "Fill in the details to add a new person."}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Smith" required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@medifile.com" required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {Object.entries(ROLE_CONFIG).map(([value, { label, color }]) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    form.role === value
                      ? `ring-2 ${color} border-transparent`
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input type="radio" name="role" value={value} checked={form.role === value} onChange={handleChange} className="sr-only" />
                  <span className={`w-2 h-2 rounded-full ${form.role === value ? "bg-current" : "bg-gray-300"}`} />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {(form.role === "doctor" || form.role === "nurse") && (
            <Input label="Speciality" name="speciality" value={form.speciality} onChange={handleChange} placeholder="e.g. Cardiology" />
          )}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : isEdit ? "Save Changes" : "Add Person"}</Button>
            <Button variant="secondary" type="button" onClick={() => navigate("/patients")}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
