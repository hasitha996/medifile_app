// App-wide static constants

export const APP_NAME = "MediFile";

export const ROLES = {
  ADMIN:   "admin",
  DOCTOR:  "doctor",
  NURSE:   "nurse",
  PATIENT: "patient",
};

export const ROUTES = {
  HOME:           "/",
  FILES:          "/files",
  FILE_TRANSFER:  "/files/transfer",
  PATIENTS:       "/patients",
  PATIENT_NEW:    "/patients/new",
  PATIENT_EDIT:   (id) => `/patients/${id}/edit`,
  VOICEBOT:       "/voicebot",
  LOGIN:          "/login",
  REGISTER:       "/register",
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Allowed medical file MIME types and extensions
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/dicom",
  ".dcm",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE_MB = 50;

export const FILE_CATEGORIES = ["Lab Report", "X-Ray", "MRI Scan", "CT Scan", "Prescription", "Discharge Summary", "Other"];
