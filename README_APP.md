# Medical Insurance Fraud Detection Platform (Frontend)

A comprehensive React-based web application for detecting and investigating medical insurance fraud. This frontend provides a complete user interface for uploading claims data, visualizing fraud detection insights, exploring graph relationships, and tracking investigations.

## 🎯 Features

### Core Capabilities
- **Authentication UI**: Login/logout interface with session state management (frontend-only)
- **Claims Data Upload**: CSV file interface with validation, sample templates, and upload history
- **Claims Management**: Sortable, filterable table view with search and pagination
- **Fraud Detection Dashboard**: Summary cards, risk distribution charts, and time-based trends
- **Claim Detail View**: Comprehensive fraud analysis with scores, risk levels, and suspicious indicators
- **Graph Visualization**: Interactive network graph showing relationships between patients, providers, and claims
- **Investigation Tracking**: Mark claims, add notes, and track investigation status
- **Audit Log**: Timeline view of all system actions with filtering
- **Privacy-Aware UI**: Masked sensitive data with clear labeling

### Technical Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: Zustand
- **Charts**: Recharts
- **Graph Visualization**: Cytoscape.js
- **CSV Parsing**: PapaParse
- **Notifications**: React Toastify

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

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout/        # Header, Sidebar, Footer
│   └── Notifications/ # Toast notifications
├── pages/             # Route pages
│   ├── Login/         # User login
│   ├── SignUp/        # New user registration
│   ├── Dashboard/
│   ├── ClaimsList/
│   ├── ClaimDetail/
│   ├── Upload/
│   ├── GraphView/
│   ├── Investigation/
│   └── AuditLog/
├── state/             # Zustand store
├── services/          # Mock API services
├── utils/             # Utilities (CSV, privacy)
├── mock/              # Mock JSON data
├── types/             # TypeScript types
└── App.tsx            # Main app with routing
```

## 🎨 Key Pages

### Dashboard
Summary statistics, risk distribution pie chart, and claims trend line chart.

### Claims List
Sortable table with filtering by risk level and status, search functionality, and pagination.

### Claim Detail
Detailed fraud analysis with fraud score, risk indicators, status management, and investigation notes.

### CSV Upload
File upload interface with structure validation, sample template download, and upload history.

### Graph View
Interactive network visualization showing relationships between patients, providers, and claims with suspicious node highlighting.

### Investigation
Dashboard for tracking suspicious claims and investigation notes.

### Audit Log
Chronological timeline of all system actions with filtering and search.

## 📊 Mock Data

The application uses static JSON mock data located in `src/mock/`:
- `claims.json` - Sample claims with fraud scores
- `graph.json` - Graph nodes and edges
- `audit.json` - Audit log entries

Mock services in `src/services/mockServices.ts` simulate API calls with delays.

## 🔒 Privacy Features

- Patient IDs are masked (e.g., `****5432`)
- Provider IDs are partially masked (e.g., `PRV***`)
- Sensitive fields are visually labeled with 🔒 icon
- Utility functions in `src/utils/privacy.ts`

## 🧪 Testing

```bash
npm run test
```

## 🧹 Linting

```bash
npm run lint
```

## 📦 Dependencies

### Production
- react & react-dom
- react-router-dom
- zustand
- recharts
- cytoscape & react-cytoscapejs
- papaparse
- react-toastify

### Development
- TypeScript
- Vite
- ESLint
- @vitejs/plugin-react

## 🎯 Future Integration

This frontend is designed to integrate with backend APIs:
- Replace mock services with real API calls
- Add authentication tokens and session management
- Connect to fraud detection model endpoints
- Implement real-time updates via WebSockets

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

## 🤝 Contributing

This is a demo application for fraud detection visualization. Contributions are welcome for UI/UX improvements and additional features.

## 📄 License

MIT

---

**Note**: This is a frontend-only demonstration. All data processing, fraud detection models, and backend APIs are simulated with mock data and services.
