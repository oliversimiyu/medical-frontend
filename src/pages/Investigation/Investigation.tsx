import { useEffect } from 'react';
import { useStore } from '../../state/store';
import { mockClaimsService } from '../../services/mockServices';
import './Investigation.css';

const Investigation = () => {
  const { claims, setClaims, investigationNotes } = useStore();

  useEffect(() => {
    const loadClaims = async () => {
      const data = await mockClaimsService.fetchClaims();
      setClaims(data);
    };
    if (claims.length === 0) {
      loadClaims();
    }
  }, [claims.length, setClaims]);

  const suspiciousClaims = claims.filter(
    (c) => c.status === 'suspicious' || c.riskLevel === 'high'
  );
  const reviewedClaims = claims.filter((c) => c.status === 'reviewed');
  const clearedClaims = claims.filter((c) => c.status === 'cleared');

  return (
    <div className="investigation-page">
      <h1>Investigation Dashboard</h1>

      <div className="investigation-stats">
        <div className="inv-stat-card suspicious">
          <div className="inv-stat-icon">🚨</div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Suspicious Claims</p>
            <p className="inv-stat-value">{suspiciousClaims.length}</p>
          </div>
        </div>

        <div className="inv-stat-card reviewed">
          <div className="inv-stat-icon">✓</div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Reviewed</p>
            <p className="inv-stat-value">{reviewedClaims.length}</p>
          </div>
        </div>

        <div className="inv-stat-card cleared">
          <div className="inv-stat-icon">✅</div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Cleared</p>
            <p className="inv-stat-value">{clearedClaims.length}</p>
          </div>
        </div>

        <div className="inv-stat-card notes">
          <div className="inv-stat-icon">📝</div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Investigation Notes</p>
            <p className="inv-stat-value">{investigationNotes.length}</p>
          </div>
        </div>
      </div>

      <div className="investigation-grid">
        <div className="investigation-card">
          <h2>Suspicious Claims Requiring Action</h2>
          {suspiciousClaims.length === 0 ? (
            <p className="empty-state">No suspicious claims at this time</p>
          ) : (
            <div className="claims-queue">
              {suspiciousClaims.slice(0, 5).map((claim) => (
                <div key={claim.id} className="queue-item">
                  <div className="queue-header">
                    <span className="queue-id">{claim.id}</span>
                    <span className="queue-score">Score: {claim.fraudScore.toFixed(2)}</span>
                  </div>
                  <p className="queue-diagnosis">{claim.diagnosis}</p>
                  <div className="queue-flags">
                    {claim.flags.map((flag, idx) => (
                      <span key={idx} className="flag-tag">⚠️ {flag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="investigation-card">
          <h2>Recent Investigation Notes</h2>
          {investigationNotes.length === 0 ? (
            <p className="empty-state">No investigation notes yet</p>
          ) : (
            <div className="notes-list">
              {investigationNotes.slice(0, 5).map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-header">
                    <span className="note-claim">{note.claimId}</span>
                    <span className="note-author">{note.author}</span>
                  </div>
                  <p className="note-content">{note.note}</p>
                  <p className="note-time">{new Date(note.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investigation;
