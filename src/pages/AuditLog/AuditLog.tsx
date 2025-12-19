import { useEffect, useState } from 'react';
import { useStore } from '../../state/store';
import { mockAuditService } from '../../services/mockServices';
import type { AuditLogEntry } from '../../types';
import './AuditLog.css';

const AuditLog = () => {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAuditLog = async () => {
      try {
        const data = await mockAuditService.fetchAuditLog();
        setAuditLog([...data, ...useStore.getState().auditLog]);
      } catch (error) {
        console.error('Failed to load audit log:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuditLog();
  }, []);

  let filteredLog = [...auditLog];

  if (filterAction) {
    filteredLog = filteredLog.filter((entry) => entry.action === filterAction);
  }

  if (searchTerm) {
    filteredLog = filteredLog.filter(
      (entry) =>
        entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.claimId && entry.claimId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CSV Upload':
        return '📤';
      case 'Claim Review':
        return '🔍';
      case 'Status Change':
        return '🔄';
      default:
        return '📋';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CSV Upload':
        return '#10b981';
      case 'Claim Review':
        return '#3b82f6';
      case 'Status Change':
        return '#f59e0b';
      default:
        return '#718096';
    }
  };

  if (loading) {
    return <div className="loading">Loading audit log...</div>;
  }

  return (
    <div className="audit-log-page">
      <h1>Audit & Activity Log</h1>

      <div className="audit-filters">
        <input
          type="text"
          placeholder="Search by user, details, or claim ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="filter-select"
        >
          <option value="">All Actions</option>
          <option value="CSV Upload">CSV Upload</option>
          <option value="Claim Review">Claim Review</option>
          <option value="Status Change">Status Change</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterAction('');
          }}
          className="btn-secondary"
        >
          Clear Filters
        </button>
      </div>

      <div className="timeline-container">
        {filteredLog.length === 0 ? (
          <p className="empty-state">No audit entries found</p>
        ) : (
          <div className="timeline">
            {filteredLog.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div
                  className="timeline-marker"
                  style={{ background: getActionColor(entry.action) }}
                >
                  {getActionIcon(entry.action)}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-action">{entry.action}</span>
                    <span className="timeline-time">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="timeline-details">{entry.details}</p>
                  <div className="timeline-footer">
                    <span className="timeline-user">👤 {entry.user}</span>
                    {entry.claimId && (
                      <span className="timeline-claim">🔗 {entry.claimId}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
