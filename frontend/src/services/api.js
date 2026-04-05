// Central fetch wrapper (no external dependency).
// Replace BASE_URL with your real API endpoint when ready.
const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(method, endpoint, body) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Upload a file using multipart/form-data with optional progress tracking.
 * @param {string} endpoint
 * @param {File} file
 * @param {Record<string,string>} [fields]  extra form fields
 * @param {(pct: number) => void} [onProgress]
 */
export function uploadFile(endpoint, file, fields = {}, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v));

    const xhr = new XMLHttpRequest();
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
    }
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { resolve(xhr.responseText); }
      } else {
        reject(new Error(`Upload failed: HTTP ${xhr.status}`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.open("POST", `${BASE_URL}${endpoint}`);
    xhr.send(formData);
  });
}

export const api = {
  get:    (endpoint)       => request("GET",    endpoint),
  post:   (endpoint, data) => request("POST",   endpoint, data),
  put:    (endpoint, data) => request("PUT",    endpoint, data),
  delete: (endpoint)       => request("DELETE", endpoint),
  upload: uploadFile,
};

export default api;
