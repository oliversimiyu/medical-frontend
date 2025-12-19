import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../state/store';
import { mockClaimsService } from '../../services/mockServices';
import type { Claim } from '../../types';
import { maskPatientId, maskProviderId } from '../../utils/privacy';
import './ClaimsList.css';

const ClaimsList = () => {
  const { claims, setClaims, selectClaim, filters, setFilters } = useStore();
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Claim>('claimDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const data = await mockClaimsService.fetchClaims();
        setClaims(data);
      } catch (error) {
        console.error('Failed to load claims:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, [setClaims]);

  const handleSort = (field: keyof Claim) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (claim: Claim) => {
    selectClaim(claim);
    navigate(`/claims/${claim.id}`);
  };

  // Apply filters
  let filteredClaims = [...claims];
  if (filters.searchTerm) {
    filteredClaims = filteredClaims.filter(
      (c) =>
        c.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        c.diagnosis.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }
  if (filters.riskLevel) {
    filteredClaims = filteredClaims.filter((c) => c.riskLevel === filters.riskLevel);
  }
  if (filters.status) {
    filteredClaims = filteredClaims.filter((c) => c.status === filters.status);
  }

  // Apply sorting
  filteredClaims.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (aVal < bVal) return -1 * modifier;
    if (aVal > bVal) return 1 * modifier;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading claims...</div>;
  }

  return (
    <div className="claims-list">
      <div className="page-header">
        <h1>Claims Management</h1>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by ID or diagnosis..."
          value={filters.searchTerm}
          onChange={(e) => setFilters({ searchTerm: e.target.value })}
          className="search-input"
        />

        <div className="filter-group">
          <label htmlFor="riskLevel">Risk Level:</label>
          <select
            id="riskLevel"
            value={filters.riskLevel}
            onChange={(e) => setFilters({ riskLevel: e.target.value })}
            className="filter-select"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="suspicious">Suspicious</option>
            <option value="cleared">Cleared</option>
          </select>
        </div>

        <button
          className="btn-secondary"
          onClick={() => setFilters({ riskLevel: '', status: '', searchTerm: '' })}
        >
          Clear Filters
        </button>
      </div>

      <div className="table-container">
        <table className="claims-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>Claim ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th>Patient ID</th>
              <th>Provider ID</th>
              <th onClick={() => handleSort('claimDate')}>Date {sortField === 'claimDate' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('amount')}>Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('fraudScore')}>Fraud Score {sortField === 'fraudScore' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th>Risk Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClaims.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">No claims found</td>
              </tr>
            ) : (
              paginatedClaims.map((claim) => (
                <tr key={claim.id} onClick={() => handleRowClick(claim)} className="clickable-row">
                  <td>{claim.id}</td>
                  <td className="sensitive">{maskPatientId(claim.patientId)}</td>
                  <td className="sensitive">{maskProviderId(claim.providerId)}</td>
                  <td>{new Date(claim.claimDate).toLocaleDateString()}</td>
                  <td>${claim.amount.toFixed(2)}</td>
                  <td>
                    <span className={`score ${claim.fraudScore > 0.7 ? 'high' : claim.fraudScore > 0.4 ? 'medium' : 'low'}`}>
                      {claim.fraudScore.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getRiskBadgeClass(claim.riskLevel)}`}>
                      {claim.riskLevel}
                    </span>
                  </td>
                  <td>{claim.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="btn-secondary"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClaimsList;
