import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFiles from "../../hooks/useFiles";
import { getUsers } from "../../services/userService";
import Button from "../../components/common/Button/Button";
import Loader from "../../components/common/Loader/Loader";
import { FILE_CATEGORIES, MAX_FILE_SIZE_MB } from "../../constants/index";
import { formatFileSize } from "../../services/fileService";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx";

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

const FileUpload = () => {
  const { user } = useContext(AuthContext);
  const { reports, loading, uploading, uploadProgress, uploadError, upload, remove } = useFiles();
  const inputRef = useRef(null);
  const [dragging, setDragging]     = useState(false);
  const [staged, setStaged]         = useState(null);
  const [meta, setMeta]             = useState({ category: FILE_CATEGORIES[0], patientId: "", patientName: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const patients = getUsers().filter((u) => u.role === "patient");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) stageFile(file);
  };

  const stageFile = (file) => { setStaged(file); setSuccessMsg(""); };

  const handlePatientChange = (e) => {
    const patient = patients.find((p) => p.id === Number(e.target.value));
    setMeta((prev) => ({ ...prev, patientId: e.target.value, patientName: patient ? patient.name : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!staged) return;
    const record = await upload(staged, { ...meta, uploadedBy: user?.id, uploadedByName: user?.name });
    if (record) {
      setStaged(null);
      setMeta({ category: FILE_CATEGORIES[0], patientId: "", patientName: "" });
      setSuccessMsg(`"${record.name}" uploaded successfully.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">File Upload</h1>
        <p className="mt-1 text-gray-500">Upload medical documents (max {MAX_FILE_SIZE_MB} MB · PDF, JPEG, PNG, DICOM, DOC)</p>
      </div>

      {/* Alerts */}
      {uploadError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {uploadError}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
          }`}
        >
          <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => e.target.files[0] && stageFile(e.target.files[0])} />
          {staged ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-indigo-700">{staged.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{formatFileSize(staged.size)}</p>
              </div>
              <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-3 py-1 rounded-full">Ready to upload — fill in details below</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Drag & drop a file here, or <span className="text-indigo-600">click to browse</span></p>
                <p className="text-xs text-gray-400 mt-1 text-center">PDF, JPEG, PNG, DICOM, DOC up to {MAX_FILE_SIZE_MB} MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Meta form */}
        {staged && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={meta.category}
                  onChange={(e) => setMeta((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {FILE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient <span className="text-red-500">*</span></label>
                <select
                  value={meta.patientId}
                  onChange={handlePatientChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">— Select patient —</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {uploading && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-150 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={uploading || !meta.patientId}>{uploading ? "Uploading…" : "Upload File"}</Button>
              <Button variant="secondary" type="button" onClick={() => setStaged(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </form>

      {/* Uploaded Records */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Records</h2>
        {loading ? <Loader /> : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
            {reports.length === 0 && (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No files uploaded yet.</p>
              </div>
            )}
            {reports.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileExtBadge name={r.name} />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{r.category}</span>
                      {r.status === "transferred" && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Transferred</span>}
                      <span className="text-xs text-gray-400">{r.patientName} · {formatFileSize(r.size)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => remove(r.id)}>Delete</Button>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
