// Medical file service — in-memory store backed by reports.json seed data.
// Swap functions for real api.js calls when a backend is ready.
import seedReports from "../data/reports.json";
import { MAX_FILE_SIZE_MB, ACCEPTED_FILE_TYPES } from "../constants/index";

let reports = [...seedReports];
let nextId = reports.length + 1;

// ─── Validation ──────────────────────────────────────────────────────────────

export const validateFile = (file) => {
  const errors = [];
  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

  if (file.size > maxBytes) {
    errors.push(`File exceeds maximum size of ${MAX_FILE_SIZE_MB} MB.`);
  }

  const isTypeAllowed =
    ACCEPTED_FILE_TYPES.includes(file.type) ||
    ACCEPTED_FILE_TYPES.some((ext) => ext.startsWith(".") && file.name.toLowerCase().endsWith(ext));

  if (!isTypeAllowed) {
    errors.push("File type not allowed. Accepted: PDF, JPEG, PNG, DICOM, DOC, DOCX.");
  }

  return errors;
};

// ─── CRUD ────────────────────────────────────────────────────────────────────

export const getReports = () => [...reports];

export const getReportById = (id) => reports.find((r) => r.id === id) || null;

export const getReportsByPatient = (patientId) =>
  reports.filter((r) => r.patientId === patientId);

/**
 * Simulate uploading a file.
 * In production, call: await api.upload("/medical-files", file, { category, patientId }, onProgress)
 */
export const uploadReport = (file, { category, patientId, patientName, uploadedBy, uploadedByName }, onProgress) => {
  return new Promise((resolve) => {
    // Simulate progress every 100ms up to 100%
    let pct = 0;
    const interval = setInterval(() => {
      pct = Math.min(pct + 20, 100);
      if (onProgress) onProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        const record = {
          id: nextId++,
          name: file.name,
          category: category || "Other",
          patientId: Number(patientId),
          patientName,
          uploadedBy,
          uploadedByName,
          uploadedAt: new Date().toISOString(),
          size: file.size,
          status: "available",
          transferredTo: null,
        };
        reports.push(record);
        resolve(record);
      }
    }, 150);
  });
};

export const deleteReport = (id) => {
  reports = reports.filter((r) => r.id !== id);
};

// ─── Transfer ────────────────────────────────────────────────────────────────

export const transferReport = (reportId, recipientId) => {
  reports = reports.map((r) =>
    r.id === reportId
      ? { ...r, status: "transferred", transferredTo: recipientId }
      : r
  );
  return getReportById(reportId);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const formatFileSize = (bytes) => {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};
