// ─── String helpers ─────────────────────────────────────────────────────────

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const truncate = (str, max = 80) =>
  str && str.length > max ? `${str.slice(0, max)}…` : str;

// ─── Number helpers ─────────────────────────────────────────────────────────

export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

// ─── Date helpers ────────────────────────────────────────────────────────────

export const formatDate = (date, locale = "en-US") =>
  new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(date));

// ─── Array helpers ───────────────────────────────────────────────────────────

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
