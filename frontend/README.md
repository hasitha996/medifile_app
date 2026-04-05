# MediFile — Secure Medical File Portal

A modern, elegant medical file management web application built with **React 19** and **Vite 8**. Upload, manage, and transfer patient records securely, with a built-in AI voice assistant (MediBot).

---

## Features

- **File Upload** — Drag-and-drop medical documents (PDF, JPEG, PNG, DICOM, DOC) with progress tracking
- **File Transfer** — Securely send patient records to doctors and nurses
- **MediBot** — Floating voice and text assistant available on every page
- **Patients & Staff** — Manage patients, doctors, nurses, and admins
- **Auth** — Session-based login with role-aware access control
- **Modern UI** — Fully built with Tailwind CSS v4, responsive and elegant

---

## Getting Started

### Prerequisites
- Node.js >= 18

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Login

- Email: `alice@medifile.com`
- Password: `password123`

---

## Tech Stack

- **React** 19.2
- **Vite** 8
- **Tailwind CSS** v4 (`@tailwindcss/vite`)
- **React Router** v6
- **Web Speech API** (voice recognition and synthesis)

---

## User Roles

- `doctor` — Upload, transfer, view all records
- `nurse` — Upload, transfer, view all records
- `patient` — View own records
- `admin` — Full access including user management

---

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

> **Note:** This app uses in-memory demo data. Swap the service functions in `src/services/` for real API calls when a backend is ready.
