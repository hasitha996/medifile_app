import { useState } from "react";
import useFiles from "../../hooks/useFiles";
import { getUsers } from "../../services/userService";
import { formatFileSize } from "../../services/fileService";
import Button from "../../components/common/Button/Button";
import Loader from "../../components/common/Loader/Loader";

const FileTransfer = () => {
  const { reports, loading, transfer } = useFiles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [recipientId, setRecipientId]   = useState("");
  const [successMsg, setSuccessMsg]     = useState("");
  const [errorMsg, setErrorMsg]         = useState("");

  const recipients = getUsers().filter((u) => u.role === "doctor" || u.role === "nurse");
  const available  = reports.filter((r) => r.status === "available");
  const transferred = reports.filter((r) => r.status === "transferred");

  const handleTransfer = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!selectedFile) { setErrorMsg("Please select a file."); return; }
    if (!recipientId)  { setErrorMsg("Please select a recipient."); return; }
    transfer(selectedFile.id, Number(recipientId));
    const recipient = recipients.find((r) => r.id === Number(recipientId));
    setSuccessMsg(`"${selectedFile.name}" transferred to ${recipient?.name}.`);
    setSelectedFile(null);
    setRecipientId("");
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">File Transfer</h1>
        <p className="mt-1 text-gray-500 text-sm">Send a medical file securely to a doctor or nurse.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {["Select File", "Choose Recipient", "Confirm"].map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              i === 0 && selectedFile ? "bg-indigo-600 text-white" :
              i === 1 && selectedFile ? "bg-indigo-600 text-white" :
              i === 2 ? "bg-gray-100 text-gray-400" :
              i === 0 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
              {step}
            </div>
            {i < 2 && <div className={`w-8 h-0.5 mx-1 rounded ${ i === 0 && selectedFile ? "bg-indigo-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Transfer Form */}
      <form onSubmit={handleTransfer} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* File Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select File</label>
          {available.length === 0 ? (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-amber-800">No files available for transfer</p>
              <a href="/files" className="inline-block mt-1 text-sm text-amber-600 underline font-medium">Upload files first →</a>
            </div>
          ) : (
            <div className="space-y-2">
              {available.map((r) => (
                <label key={r.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  selectedFile?.id === r.id
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}>
                  <input type="radio" name="file" className="mt-1" onChange={() => setSelectedFile(r)} checked={selectedFile?.id === r.id} />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{r.category}</span>
                      <span className="text-xs text-gray-400">Patient: {r.patientName} · {formatFileSize(r.size)}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Recipient</label>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">— Select doctor / nurse —</option>
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>{r.name}{r.speciality ? ` (${r.speciality})` : ""}</option>
            ))}
          </select>
        </div>

        {errorMsg   && <p className="text-sm text-red-600">{errorMsg}</p>}
        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || !recipientId}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Transfer File
        </button>
      </form>

      {/* Transfer History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Transfer History</h2>
        {transferred.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No transfers yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {transferred.map((r, idx) => {
              const recipient = recipients.find((u) => u.id === r.transferredTo);
              return (
                <div key={r.id} className={`relative flex gap-4 px-5 py-4 hover:bg-emerald-50/30 transition-colors ${ idx !== transferred.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {idx !== transferred.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800 text-sm">{r.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{r.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Transferred</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Patient: {r.patientName} &middot; Sent to: <strong className="text-gray-600">{recipient?.name ?? `User #${r.transferredTo}`}</strong> &middot; {formatFileSize(r.size)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTransfer;
