// Mock service for simulating API calls
import type { Claim, AuditLogEntry, GraphNode, GraphEdge } from '../types';
import claimsData from '../mock/claims.json';
import auditData from '../mock/audit.json';
import graphData from '../mock/graph.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockClaimsService = {
  async fetchClaims(): Promise<Claim[]> {
    await delay(800);
    return claimsData as Claim[];
  },

  async fetchClaimById(id: string): Promise<Claim | null> {
    await delay(500);
    const claim = claimsData.find((c) => c.id === id);
    return claim ? (claim as Claim) : null;
  },

  async uploadClaims(): Promise<{ success: boolean; count: number; errors: string[] }> {
    await delay(2000);
    // Simulate processing
    return {
      success: Math.random() > 0.1, // 90% success rate
      count: Math.floor(Math.random() * 100) + 50,
      errors: Math.random() > 0.8 ? ['Sample error: Invalid date format in row 5'] : []
    };
  }
};

export const mockAuditService = {
  async fetchAuditLog(): Promise<AuditLogEntry[]> {
    await delay(600);
    return auditData as AuditLogEntry[];
  }
};

export const mockGraphService = {
  async fetchGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    await delay(1000);
    return {
      nodes: graphData.nodes as GraphNode[],
      edges: graphData.edges as GraphEdge[]
    };
  }
};

export const mockStatsService = {
  async fetchDashboardStats() {
    await delay(700);
    return {
      totalClaims: 150,
      flaggedClaims: 42,
      highRiskClaims: 18,
      avgFraudScore: 0.38,
      riskDistribution: [
        { name: 'Low', value: 85 },
        { name: 'Medium', value: 47 },
        { name: 'High', value: 18 }
      ],
      trends: [
        { date: '2024-11-01', count: 12, flagged: 3 },
        { date: '2024-11-05', count: 18, flagged: 5 },
        { date: '2024-11-10', count: 25, flagged: 8 },
        { date: '2024-11-15', count: 30, flagged: 12 },
        { date: '2024-11-20', count: 35, flagged: 14 }
      ]
    };
  }
};
