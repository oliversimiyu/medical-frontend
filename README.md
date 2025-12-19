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

## 📝 Dataset Specification

The platform is designed to work with comprehensive healthcare fraud detection data:

### Dataset Components

| Component | Records | Features | Description |
|-----------|---------|----------|-------------|
| **Patients Data** | 138,556 | 29 | Patient demographics, health status, utilization behavior, temporal patterns, network attributes, and derived fraud features |
| **Inpatient Claims** | 40,474 | 30 | Hospital admission records with diagnosis, procedures, and claim amounts |
| **Outpatient Claims** | 557,835 | 27 | Service records with procedures and provider information |
| **Provider Data** | 5,410 | 12 | Fraud classification with facility details and performance metrics |
| **Insurance Agents** | 1,000 | 5 | Claim verification and approval records |
| **Total** | 743,275 | - | Combined healthcare transactions linked by Provider ID and Beneficiary ID |

### CSV Upload Format

#### Inpatient Claims (30 features)
Required columns:
- `claimId`, `patientId`, `providerId`
- `admissionDate`, `dischargeDate`
- `diagnosisCode` (ICD-10), `procedureId`, `numberOfProcedures`
- `doctorName`, `diagnosisRelatedGroup`, `claimAmount`

#### Outpatient Claims (27 features)
Required columns:
- `claimId`, `patientId`, `providerId`
- `serviceDate`, `procedureId`, `doctorName`, `claimAmount`

#### Unified Claims Upload
Minimum required columns:
- `claimId`, `patientId`, `providerId`, `claimDate`
- `claimAmount`, `procedureId`, `diagnosisCode`
- `claimType` (inpatient/outpatient)

### Patient Data Features (29 attributes)

1. **Demographics (7)**: Age, Gender, County, Residence Type, Marital Status, Employment Status, Income Category
2. **Health Status (5)**: Chronic Conditions (ICD-10), Disease Severity Index, Comorbidities, Risk Category
3. **Utilization Behavior (7)**: Claim counts, amounts, visit frequency, provider count, referrals
4. **Temporal Patterns (3)**: Seasonality, time between visits, time since last claim
5. **Network Attributes (3)**: Linked providers, insurance agents, provider-agent pairs
6. **Derived Features (4)**: Fraud Propensity Score, Treatment Diversity Index, Cost per Condition, Claim-to-Diagnosis Ratio

### Provider Data Features (12 attributes)

Facility Name, Type (Clinic/Hospital/Pharmacy), Location (County/Town), Ownership Type (Private/Public), Claims Submitted, Average Claim Amount, Claim Frequency, Unique Patients/Agents, Rejection Rate, **Fraud Label** (Binary Classification)

Download sample templates from the Upload page.

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
