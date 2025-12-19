# Sample Dataset Documentation

This directory contains sample CSV files that demonstrate the structure of the Medical Insurance Fraud Detection Platform dataset.

## Dataset Files

### 1. patients.csv (15 records)
**29 Features** representing patient demographics, chronic conditions, and utilization patterns:
- **Demographics**: PatientID, Gender, Race, State, County, DateOfBirth, DateOfDeath, Age
- **Part Coverage**: NoOfMonths_PartACov, NoOfMonths_PartBCov
- **Chronic Conditions** (12 binary flags): Alzheimers, Heartfailure, KidneyDisease, Cancer, ObstructivePulmonary, Depression, Diabetes, IschemicHeart, Osteoporasis, rheumatoidarthritis, stroke
- **Financial Metrics**: IPAnnualReimbursementAmt, IPAnnualDeductibleAmt, OPAnnualReimbursementAmt, OPAnnualDeductibleAmt
- **Derived Features**: ChronicConditionCount, IPClaimCount, OPClaimCount, TotalClaimCount, AvgClaimAmount

### 2. inpatient-claims.csv (15 records)
**30 Features** for hospital admission claims:
- **Identifiers**: ClaimID, PatientID, ProviderID, InsuranceAgentID
- **Dates**: ClaimStartDate, ClaimEndDate, AdmissionDate, DischargeDate
- **Medical Staff**: AttendingPhysician, OperatingPhysician, OtherPhysician
- **Diagnosis Codes**: ClmDiagnosisCode_1 through ClmDiagnosisCode_5, ClmAdmitDiagnosisCode
- **Procedure Codes**: ClmProcedureCode_1 through ClmProcedureCode_5
- **Financial**: DeductibleAmtPaid, InscClaimAmtReimbursed, TotalClaimAmount
- **Clinical Metrics**: DiagnosisRelatedGroup, NumberOfProcedures, LengthOfStay
- **Outcome**: ClaimApproved, PotentialFraud

### 3. outpatient-claims.csv (20 records)
**27 Features** for outpatient/ambulatory care claims:
- **Identifiers**: ClaimID, PatientID, ProviderID, InsuranceAgentID
- **Dates**: ClaimStartDate, ClaimEndDate, ServiceDate
- **Medical Staff**: AttendingPhysician, OperatingPhysician, OtherPhysician
- **Diagnosis Codes**: ClmDiagnosisCode_1 through ClmDiagnosisCode_5
- **Procedure Codes**: ClmProcedureCode_1 through ClmProcedureCode_3
- **Financial**: DeductibleAmtPaid, InscClaimAmtReimbursed, TotalClaimAmount
- **Clinical Metrics**: NumberOfProcedures
- **Outcome**: ClaimApproved, PotentialFraud

### 4. providers.csv (15 records)
**12 Features** describing healthcare providers:
- ProviderID, ProviderName, ProviderType, State, City, Specialty
- YearsOfExperience, TotalPatients, TotalClaims
- AvgClaimAmount, HighRiskProcedureCount
- **FraudLabel** (0 = legitimate, 1 = fraudulent)

### 5. insurance-agents.csv (15 records)
**5 Features** for insurance claim agents:
- AgentID, AgentName, AgentEmail, Region, YearsOfService

## Data Characteristics

### Fraud Indicators
The sample data includes both legitimate and potentially fraudulent records:
- **Patient PT0003**: Deceased patient with high claim count (suspicious activity after death)
- **Provider PRV006**: Riverside Healthcare - flagged for fraud (unusually high procedure counts)
- **Provider PRV007**: Advanced Surgical Associates - flagged for fraud (extremely high average claim amounts)
- **Provider PRV009**: Elite Cancer Treatment Center - flagged for fraud (suspicious billing patterns)
- **Inpatient Claim CLM-IP-007**: Long stay duration (25 days) with high reimbursement
- **Inpatient Claim CLM-IP-009**: Extended stay (28 days) at flagged provider PRV007
- **Outpatient Claim CLM-OP-015**: High-cost outpatient procedure at cancer center (PRV009)

### Common Diagnosis Codes (ICD-10)
- **I10**: Essential hypertension
- **E119**: Type 2 diabetes mellitus without complications
- **I2510**: Atherosclerotic heart disease
- **I509**: Heart failure
- **G309**: Alzheimer's disease
- **N183**: Chronic kidney disease
- **C509**: Malignant neoplasm (cancer)
- **J449**: COPD
- **M7990**: Rheumatism

### Common Procedure Codes (CPT)
- **4019**: Routine office visit
- **3722**: Coronary artery bypass
- **8154**: Kidney dialysis
- **9904**: Blood transfusion
- **8872**: Chemotherapy administration
- **9390**: Brain imaging/scan
- **0270**: Heart valve replacement
- **0180**: Brain surgery

## Usage Instructions

### Upload to Application
1. Navigate to the **Upload** page in the application
2. Select the appropriate claim type (Inpatient/Outpatient/Unified)
3. Choose the corresponding CSV file
4. Click "Upload CSV" to process

### Expected Validations
- **Inpatient claims** must have 30 columns
- **Outpatient claims** must have 27 columns
- All ClaimIDs must be unique
- PatientIDs, ProviderIDs, and InsuranceAgentIDs should reference existing entities
- Dates must be in YYYY-MM-DD format
- Financial amounts must be non-negative numbers

### Fraud Detection Features
When uploaded, the application will:
1. **Risk Scoring**: Calculate fraud risk scores based on:
   - Provider fraud labels
   - Unusual claim amounts
   - High procedure counts
   - Extended length of stay
   - Deceased patient activity
   
2. **Pattern Analysis**: Identify suspicious patterns:
   - Duplicate procedures across claims
   - Outlier billing amounts
   - Provider-patient relationship anomalies
   
3. **Network Visualization**: Generate provider-patient-agent relationship graphs highlighting:
   - Fraudulent providers (red nodes)
   - High-risk claim connections
   - Unusual billing patterns

## Full Dataset Scale

This sample represents a tiny fraction of the complete dataset:
- **Patients**: 15 samples (full dataset: 138,556)
- **Inpatient Claims**: 15 samples (full dataset: 40,474)
- **Outpatient Claims**: 20 samples (full dataset: 557,835)
- **Providers**: 15 samples (full dataset: 5,410)
- **Insurance Agents**: 15 samples (full dataset: 1,000)

**Total Sample Records**: 80  
**Total Full Dataset Records**: 743,275

## Data Quality Notes
- All dates are within 2024 for consistency
- Financial amounts are realistic for US healthcare costs
- Chronic condition counts match individual flags
- Claim counts aggregate inpatient + outpatient totals
- Provider fraud labels correlate with suspicious claim patterns
