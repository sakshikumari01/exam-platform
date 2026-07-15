<div align="center">

# 🎓 ProctorEd — Online Exam Platform

### A secure, full-stack examination system with AI-powered proctoring

*Built on the MERN stack, featuring facial recognition, ID verification, and real-time anti-cheating enforcement.*

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-Educational-blue?style=flat-square)
![Roles](https://img.shields.io/badge/roles-Admin%20%7C%20Teacher%20%7C%20Student-orange?style=flat-square)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [Security & Anti-Cheating](#-security--anti-cheating-architecture)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🧭 Overview

**ProctorEd** is a full-stack online examination platform designed to replicate the core capabilities of enterprise proctoring solutions (e.g. Mettl, ProctorU) at a smaller scale. It handles the complete lifecycle of a digital exam — from identity verification and live monitoring, to auto-grading and result delivery — while enforcing academic integrity through browser-level and camera-based checks.

The system is built around **three distinct roles**, each with isolated dashboards and permissions, backed by a JWT-secured REST API.

---

## 🚀 Key Features

<table>
<tr>
<td width="33%" valign="top">

### 👑 Admin
- Platform-wide analytics dashboard
- User lifecycle management
- Global exam oversight & moderation
- Role-restricted access (provisioned, not self-registered)

</td>
<td width="33%" valign="top">

### 👨‍🏫 Teacher
- Exam builder with MCQ + negative marking
- Reusable question bank
- Per-exam result analytics
- Leaderboard generation

</td>
<td width="33%" valign="top">

### 🎓 Student
- OCR-based ID card verification
- Real-time face detection during exam
- Enforced full-screen + tab-switch detection
- Auto-scored results with email delivery

</td>
</tr>
</table>

---

## 🏗 System Architecture

```
┌─────────────┐        HTTPS/JWT        ┌──────────────┐
│   React     │  ─────────────────────▶ │   Express    │
│   Frontend  │ ◀───────────────────── │   REST API    │
└─────────────┘        JSON             └──────┬───────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────┐
                     ▼                           ▼                       ▼
             ┌───────────────┐         ┌──────────────────┐   ┌──────────────────┐
             │  MongoDB Atlas │         │  Google Vision   │   │     SendGrid      │
             │  (Mongoose)    │         │  API (OCR / ID)  │   │  (Result Emails)  │
             └───────────────┘         └──────────────────┘   └──────────────────┘
```

**Request flow:** Client → Axios (JWT attached via interceptor) → Express middleware (`auth` → `adminAuth` where applicable) → Controller logic → MongoDB → JSON response.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router DOM, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JSON Web Tokens (JWT), bcrypt.js |
| **Proctoring / OCR** | Google Cloud Vision API, browser Face Detection |
| **Transactional Email** | SendGrid |
| **Dev Tooling** | Nodemon, Vite |

---

## 📂 Project Structure

```
exam-platform/
├── backend/
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── adminAuth.js         # Admin-only route guard
│   ├── models/
│   │   ├── User.js              # student | teacher | admin
│   │   ├── Exam.js              # embedded question schema
│   │   ├── Result.js
│   │   └── QuestionBank.js
│   ├── routes/
│   │   ├── auth.js              # register / login
│   │   ├── exam.js              # create / fetch / verify-password
│   │   ├── result.js            # submit / score / email / leaderboard
│   │   ├── verify.js            # ID OCR verification
│   │   ├── questionbank.js
│   │   └── admin.js             # stats / users / exams management
│   ├── server.js
│   └── .env
│
└── frontend/
    └── src/
        ├── api/axios.js         # centralized instance + JWT interceptor
        ├── context/AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx · Register.jsx
        │   ├── Dashboard.jsx · ExamList.jsx
        │   ├── IDVerification.jsx · ExamRoom.jsx
        │   ├── Result.jsx · Leaderboard.jsx
        │   ├── CreateExam.jsx · TeacherDashboard.jsx · ExamAnalytics.jsx · QuestionBank.jsx
        │   └── AdminDashboard.jsx · AdminUsers.jsx · AdminExams.jsx
        └── App.jsx               # route definitions
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js `v18+`
- A MongoDB Atlas cluster (or local MongoDB instance)
- API keys: SendGrid, Google Cloud Vision

### 1 — Clone the repository
```bash
git clone https://github.com/<your-username>/exam-platform.git
cd exam-platform
```

### 2 — Backend
```bash
cd backend
npm install
npm run dev
```
> Runs on `http://localhost:5000`

### 3 — Frontend
```bash
cd frontend
npm install
npm run dev
```
> Runs on `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_verified_sender_email
GOOGLE_VISION_API_KEY=your_google_vision_api_key
```

> ⚠️ `.env` is excluded via `.gitignore` and must never be committed.

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate & receive JWT |
| `POST` | `/api/exam/create` | Teacher | Create a new exam |
| `GET` | `/api/exam/all` | Teacher | List exams for logged-in teacher |
| `GET` | `/api/exam/:id` | Auth | Fetch a single exam |
| `POST` | `/api/exam/verify-password/:id` | Auth | Verify exam-entry password |
| `POST` | `/api/verify/id-verify` | Student | OCR-based ID card verification |
| `POST` | `/api/result/submit` | Student | Submit exam & trigger auto-scoring |
| `GET` | `/api/result/my-results` | Student | View own result history |
| `GET` | `/api/result/leaderboard/:examId` | Auth | Exam-wise leaderboard |
| `POST` | `/api/questionbank/add` | Teacher | Add question to reusable bank |
| `GET` | `/api/questionbank/my-questions` | Teacher | List own question bank |
| `GET` | `/api/admin/stats` | Admin | Platform-wide statistics |
| `GET` | `/api/admin/users` | Admin | List all users |
| `DELETE` | `/api/admin/users/:id` | Admin | Remove a user |
| `GET` | `/api/admin/exams` | Admin | List all exams |
| `DELETE` | `/api/admin/exams/:id` | Admin | Remove an exam |

> All protected routes require an `Authorization: Bearer <token>` header, automatically attached via the Axios interceptor on the client.

---

## 🔐 Role-Based Access Control

| Role | Post-Login Route | Permissions |
|---|---|---|
| **Admin** | `/admin-dashboard` | Full platform visibility, user & exam moderation |
| **Teacher** | `/teacher-dashboard` | Exam authoring, question bank, result analytics |
| **Student** | `/dashboard` | Exam participation, results, leaderboard |

> Admin accounts are provisioned directly at the database level and are intentionally excluded from public self-registration — a standard practice to prevent privilege escalation via the signup flow.

---

## 🛡 Security & Anti-Cheating Architecture

- **Password hashing** — bcrypt with salted hashes, never stored in plaintext
- **Stateless auth** — JWT signed tokens, validated on every protected request via middleware
- **Identity gate** — exam access is blocked until ID card OCR verification succeeds
- **Continuous monitoring** — live face detection runs for the duration of the exam session
- **Environment lockdown** — full-screen mode is enforced; exiting triggers a warning and forced re-entry
- **Behavioral logging** — tab switches are detected, timestamped, and counted; repeated violations trigger auto-submission
- **Audit trail** — all flagged activity is attached to the result record for teacher review

---

## 🗺 Roadmap

- [ ] Real-time proctoring feed for teachers (live student activity stream)
- [ ] Per-student question randomization
- [ ] Bulk question import (CSV/Excel)
- [ ] Forgot-password / email-based recovery flow
- [ ] Mobile-responsive layout pass
- [ ] Exportable result reports (PDF/Excel)

---

## 👩‍💻 Author

Designed and built as an independent full-stack project to explore secure authentication, role-based systems, and browser-based proctoring mechanics end-to-end.

---

<div align="center">

**⭐ If you found this project interesting, a star would mean a lot.**

</div>
