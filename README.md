# Medical Insurance Fraud Detection Platform (Frontend)

A comprehensive React-based web application for detecting and investigating medical insurance fraud. This frontend provides a complete user interface for uploading claims data, visualizing fraud detection insights, exploring graph relationships, and tracking investigations.

## 🎯 Features

- **Authentication System**: Secure sign-up with email domain validation and login interface
- **Claims Data Upload**: CSV file interface with validation, sample templates, and upload history (15 records per page)
- **Claims Management**: Sortable, filterable table view with search and pagination (15 records per page)
- **Fraud Detection Dashboard**: Summary cards, risk distribution charts, and time-based trends
- **Claim Detail View**: Comprehensive fraud analysis with scores, risk levels, and suspicious indicators
- **Graph Visualization**: Interactive network graph showing relationships between patients, providers, and claims
- **Investigation Tracking**: Mark claims, add notes, and track investigation status (15 records per page)
- **Audit Log**: Timeline view of all system actions with filtering (15 records per page)
- **Privacy-Aware UI**: Masked sensitive data with clear labeling

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

### Sign Up (New User Registration)

New users must register with:
- **Authorized Email Domains**: Only emails from approved organizations are accepted:
  - `hospital.com`
  - `clinic.org`
  - `healthcare.gov`
  - `insurance.com`
- **Organization Code**: Required 6-character code (contact your administrator)
- **Strong Password**: Minimum 8 characters with uppercase, lowercase, and number
- **Personal Information**: First name, last name

**Security Features:**
- Email domain validation prevents random signups
- Organization code verification ensures authorized access only
- Password strength requirements enforce security best practices
- Duplicate email detection

### Login

After registration, use your email and password to log in.

**Demo/Testing:**
The authentication is frontend-only for demo purposes. You can also use any email address and password (minimum 6 characters) to log in without registration.

**Example credentials:**
- Email: `admin@example.com`
- Password: `password123`

## 📊 Technical Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Charts**: Recharts
- **Graph Visualization**: Cytoscape.js
- **CSV Parsing**: PapaParse
- **Notifications**: React Toastify

## 📝 CSV Upload Format

Required columns for CSV upload:
- `claimId`
- `patientId`
- `providerId`
- `claimDate`
- `amount`
- `procedureCode`
- `diagnosis`

Download a sample template from the Upload page.

## 🔒 Privacy Features

- Patient IDs are masked (e.g., `****5432`)
- Provider IDs are partially masked (e.g., `PRV***`)
- Sensitive fields are visually labeled with 🔒 icon

## 🧪 Testing & Linting

```bash
# Run tests
npm run test

# Run linter
npm run lint
```

## 🎯 Future Integration

This frontend is designed to integrate with backend APIs:
- Replace mock services with real API calls
- Add authentication tokens and session management
- Connect to fraud detection model endpoints
- Implement real-time updates via WebSockets

---

**Note**: This is a frontend-only demonstration. All data processing, fraud detection models, and backend APIs are simulated with mock data and services.
