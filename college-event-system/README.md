# 🎓 Accurate Group of Institutions - College Event Registration System

A modern, responsive, and full-featured web-based platform for campus event discovery, online student registrations, digital entry pass issuance, and event organizer administration.

---

## 🌟 Key Features

1. **Campus Event Discovery (`index.html`)**:
   - Live category filter tabs: *All Events*, *Technical*, *Gaming & Esports (Free Fire, etc.)*, *Cultural*, *Management*.
   - Instant search bar filtering by event title, venue, or keywords.
   - Event cards with cash prize tags, dates, formats, and coordinator contacts.
   - Interactive modal popup with complete competition rules and guidelines.

2. **Online Registration & Instant Pass Generation (`registration.html`)**:
   - Pre-fills selected event automatically when clicking "Register" on any event card.
   - Captures Student Name, University Roll Number, Branch/Dept, Year, Email, and WhatsApp number.
   - Supports both **Solo** and **Team / Squad** registrations (e.g. Free Fire Squads or Hackathon teams).
   - Real-time client-side validation (10-digit Indian phone number, valid email, duplicate check).
   - Generates an official **Digital Event Entry Pass** with unique Registration ID (e.g. `AGI-2026-XXXXX`), simulated QR code badge, and a **"Print / Save PDF"** button.

3. **Student Pass Lookup & Status Verification (`status.html`)**:
   - Allows registered students to look up and reprint their event pass anytime by entering their **Roll Number** or **Registration ID**.

4. **Organizer & Admin Control Center (`admin.html`)**:
   - Password-protected organizer portal (Default demo passcode: `admin123`).
   - Real-time participation metrics (Total Registrations, Active Events, Most Popular Event).
   - Live searchable and filterable participant roster table.
   - **One-Click Export to CSV / Excel** to take physical attendance during event day.
   - **Publish New Campus Event** form to dynamically add events to the platform.

5. **Dual Operation (Client-Side & Node.js Backend)**:
   - **Option A (Instant)**: Works immediately just by opening `index.html` in Chrome/Edge.
   - **Option B (Full Stack Node.js)**: Run `node server.js` to serve the website and provide REST APIs matching the project presentation slides.

---

## 🚀 How to Run the Website

### Method 1: Instant Browser Opening (No Setup Required)
Simply double-click `index.html` in Windows File Explorer or open it in any web browser:
```text
C:\Users\LENOVO\.gemini\antigravity\scratch\college-event-system\index.html
```

### Method 2: Run with Node.js Server (Recommended for Presentation)
Open PowerShell or Command Prompt in the project folder and run:
```powershell
cd C:\Users\LENOVO\.gemini\antigravity\scratch\college-event-system
node server.js
```
Then visit:
```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
college-event-system/
├── index.html            # Campus home & event discovery
├── registration.html     # Registration form & entry pass badge
├── status.html           # Student registration lookup & print pass
├── admin.html            # Organizer dashboard, roster & CSV export
├── css/
│   └── style.css         # College-themed responsive stylesheet
├── js/
│   ├── data.js           # Default events catalog & local persistence
│   ├── app.js            # Registration logic, modal & QR pass generator
│   └── admin.js          # Admin metrics, CSV exporter & event publisher
├── server.js             # Built-in Node.js server with REST API
├── package.json          # Project manifest
└── README.md             # Project documentation
```

---

## 🛡️ Default Credentials
- **Admin / Organizer Passcode**: `admin123` (or leave blank and click "Unlock Dashboard")
