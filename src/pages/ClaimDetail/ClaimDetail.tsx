import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../state/store';
import type { Claim } from '../../types';
import { maskPatientId, maskProviderId } from '../../utils/privacy';
import { toast } from 'react-toastify';
import './ClaimDetail.css';

const ClaimDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedClaim, updateClaimStatus, claims } = useStore();
  const [claim, setClaim] = useState<Claim | null>(selectedClaim);
  const [note, setNote] = useState('');
  const addNote = useStore((state) => state.addNote);

  useEffect(() => {
    if (!selectedClaim && id) {
      const foundClaim = claims.find((c) => c.id === id);
      if (foundClaim) {
        setClaim(foundClaim);
      } else {
        toast.error('Claim not found');
        navigate('/claims');
      }
    }
  }, [selectedClaim, id, claims, navigate]);

  if (!claim) {
    return <div className="loading">Loading claim details...</div>;
  }

  const handleStatusChange = (newStatus: Claim['status']) => {
    updateClaimStatus(claim.id, newStatus);
    setClaim({ ...claim, status: newStatus });
    toast.success(`Claim status updated to ${newStatus}`);
  };

  const handleAddNote = () => {
    if (note.trim()) {
      addNote({
        claimId: claim.id,
        note: note.trim(),
        author: 'Current User',
      });
      setNote('');
      toast.success('Note added successfully');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#718096';
    }
  };

  return (
    <div className="claim-detail">
      <div className="detail-header">
        <button onClick={() => navigate('/claims')} className="btn-back">
          ← Back to Claims
        </button>
        <h1>Claim Details: {claim.id}</h1>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h2>Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Claim ID:</label>
              <span>{claim.id}</span>
            </div>
            <div className="info-item sensitive-field">
              <label>Patient ID: 🔒</label>
              <span>{maskPatientId(claim.patientId)}</span>
            </div>
            <div className="info-item sensitive-field">
              <label>Provider ID: 🔒</label>
              <span>{maskProviderId(claim.providerId)}</span>
            </div>
            <div className="info-item">
              <label>Claim Date:</label>
              <span>{new Date(claim.claimDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Amount:</label>
              <span className="amount">${claim.amount.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <label>Procedure Code:</label>
              <span>{claim.procedureCode}</span>
            </div>
            <div className="info-item">
              <label>Diagnosis:</label>
              <span>{claim.diagnosis}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h2>Fraud Analysis</h2>
          <div className="fraud-score-container">
            <div className="score-display">
              <div className="score-circle" style={{ borderColor: getRiskColor(claim.riskLevel) }}>
                <span className="score-value">{(claim.fraudScore * 100).toFixed(0)}%</span>
                <span className="score-label">Fraud Score</span>
              </div>
            </div>
            <div className="risk-badge" style={{ background: getRiskColor(claim.riskLevel), color: 'white' }}>
              {claim.riskLevel.toUpperCase()} RISK
            </div>
          </div>

          {claim.flags.length > 0 && (
            <div className="flags-section">
              <h3>Suspicious Indicators</h3>
              <ul className="flags-list">
                {claim.flags.map((flag, idx) => (
                  <li key={idx}>
                    <span className="flag-icon">⚠️</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="detail-card">
          <h2>Investigation Status</h2>
          <div className="status-section">
            <p className="current-status">Current Status: <strong>{claim.status}</strong></p>
            <div className="status-actions">
              <button
                className="btn-status pending"
                onClick={() => handleStatusChange('pending')}
                disabled={claim.status === 'pending'}
              >
                Mark Pending
              </button>
              <button
                className="btn-status reviewed"
                onClick={() => handleStatusChange('reviewed')}
                disabled={claim.status === 'reviewed'}
              >
                Mark Reviewed
              </button>
              <button
                className="btn-status suspicious"
                onClick={() => handleStatusChange('suspicious')}
                disabled={claim.status === 'suspicious'}
              >
                Mark Suspicious
              </button>
              <button
                className="btn-status cleared"
                onClick={() => handleStatusChange('cleared')}
                disabled={claim.status === 'cleared'}
              >
                Clear Claim
              </button>
            </div>
          </div>

          <div className="notes-section">
            <h3>Add Investigation Note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter investigation notes..."
              rows={4}
            />
            <button onClick={handleAddNote} className="btn-primary" disabled={!note.trim()}>
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
