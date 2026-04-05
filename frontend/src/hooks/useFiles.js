import { useState, useEffect, useCallback } from "react";
import {
  getReports,
  uploadReport,
  deleteReport,
  transferReport,
  validateFile,
} from "../services/fileService";

const useFiles = () => {
  const [reports, setReports]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError]       = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setReports(getReports());
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = refresh();
    return cleanup;
  }, [refresh]);

  const upload = async (file, meta) => {
    const errors = validateFile(file);
    if (errors.length) {
      setUploadError(errors.join(" "));
      return null;
    }
    setUploadError("");
    setUploading(true);
    setUploadProgress(0);
    try {
      const record = await uploadReport(file, meta, setUploadProgress);
      setReports(getReports());
      return record;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const remove = (id) => {
    deleteReport(id);
    setReports(getReports());
  };

  const transfer = (reportId, recipientId) => {
    transferReport(reportId, recipientId);
    setReports(getReports());
  };

  return { reports, loading, uploading, uploadProgress, uploadError, upload, remove, transfer };
};

export default useFiles;
