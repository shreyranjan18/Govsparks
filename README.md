# 🚀 GovSpark Connect - Enterprise GovTech Platform

A production-ready platform connecting **Government Organizations** and **Entrepreneurs** to collaborate, pilot innovations, and solve real-world public sector challenges.

![GovSpark Connect](https://i.imgur.com/example-banner.png) <!-- Replace with actual screenshot if available -->

## ✨ Key Features

- **For Government:**
  - 📊 **Smart Dashboard:** Real-time analytics, heatmaps, and trend charts.
  - 🎯 **Challenge Management:** Create and manage problem statements.
  - 🏆 **Idea Evaluation:** 5-star quality rating, pilot request workflow, and status timeline (6 stages).
  - 🔒 **Trust Layer:** Verification badges, NDA/IP compliance tracking.

- **For Entrepreneurs:**
  - 🚀 **Innovation Hub:** Browse and submit solutions to government challenges.
  - 📈 **Progress Tracking:** Visual timelines (Submitted → Pilot → Approved).
  - 💬 **Direct Communication:** Formal messaging channel with government officials.
  - 📂 **Secure Uploads:** Drag-and-drop document management (PDF, PPT).

- **Enterprise Tech Stack:**
  - **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts.
  - **Backend:** Node.js, Express, MongoDB, Cloudinary (File Storage).
  - **Design:** Premium Glassmorphism UI, Dark Mode, Responsive.

---

## 🛠️ Prerequisites for Running

Before starting, ask your friend to install these two things:

1.  **Node.js** (v18 or higher) - [Download Here](https://nodejs.org/)
2.  **MongoDB** (Community Server) - [Download Here](https://www.mongodb.com/try/download/community)
    *   *Alternatively, they can use a MongoDB Atlas cloud URL.*

---

## 🚀 How to Run the Project (Step-by-Step)

### 1. Unzip and Open
Extract the project folder and open it in VS Code (or any terminal).

### 2. Install Dependencies
Run this **one command** in the root folder to install everything (client + server):

```bash
npm install && npm install --prefix client && npm install --prefix server
```

### 3. Configure Variables (.env)
Go to the `server/` folder and look for `.env`. If it doesn't exist, create it:

**File:** `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/govspark
JWT_SECRET=any_secret_key_you_want

# (Optional) For File Uploads to work:
# Sign up for free at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
*Note: The app works without Cloudinary, but file uploads will fail.*

### 4. Start the App 🏁
Run this command from the **root** folder:

```bash
npm run dev
```

This will magically start both the Backend and Frontend at once! 🪄

- **Frontend:** http://localhost:5173 (or 8080 depending on availability)
- **Backend:** http://localhost:5000

---

## 🏗️ Project Structure

- `client/`: React Frontend
  - `src/pages/`: Dashboards, Auth, Landing Page
  - `src/components/`: Reusable UI elements (Charts, Timeline, etc.)
- `server/`: Express Backend
  - `src/models/`: Database Schemas (User, Idea, Challenge)
  - `src/controllers/`: Business Logic
  - `src/routes/`: API Endpoints

## 🤝 Troubleshooting

- **"MongoDB connection error"**: Make sure MongoDB Compass/Service is running.
- **"Upload failed"**: Check if Cloudinary credentials in `.env` are correct.
- **"Module not found"**: Try running `npm install` inside both `client/` and `server/` folders manually.
