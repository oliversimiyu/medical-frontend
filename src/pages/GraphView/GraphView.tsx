import { useEffect, useState, useRef } from 'react';
import cytoscape, { type Core, type EventObject } from 'cytoscape';
import { mockGraphService } from '../../services/mockServices';
import type { GraphNode } from '../../types';
import './GraphView.css';

const GraphView = () => {
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const cyRef = useRef<Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const { nodes, edges } = await mockGraphService.fetchGraphData();

        if (!containerRef.current) return;

        const cy = cytoscape({
          container: containerRef.current,
          elements: [
            ...nodes.map((node) => ({
              data: node,
            })),
            ...edges.map((edge) => ({
              data: { id: edge.id, source: edge.source, target: edge.target, label: edge.label },
            })),
          ],
          style: [
            {
              selector: 'node',
              style: {
                'background-color': (ele: any) => {
                  if (ele.data('type') === 'patient') return '#3b82f6';
                  if (ele.data('type') === 'provider') return '#10b981';
                  return '#f59e0b';
                },
                'label': 'data(label)',
                'color': '#fff',
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': '12px',
                'width': (ele: any) => (ele.data('suspicious') ? 50 : 40),
                'height': (ele: any) => (ele.data('suspicious') ? 50 : 40),
                'border-width': (ele: any) => (ele.data('suspicious') ? 4 : 0),
                'border-color': '#dc2626',
              },
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#cbd5e0',
                'target-arrow-color': '#cbd5e0',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': '10px',
                'text-rotation': 'autorotate',
              },
            },
          ],
          layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1000,
            nodeRepulsion: 8000,
            idealEdgeLength: 100,
          },
        });

        cy.on('tap', 'node', (evt: EventObject) => {
          const node = evt.target.data() as GraphNode;
          setSelectedNode(node);
        });

        cy.on('tap', (evt: EventObject) => {
          if (evt.target === cy) {
            setSelectedNode(null);
          }
        });

        cyRef.current = cy;
      } catch (error) {
        console.error('Failed to load graph:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGraph();

    return () => {
      cyRef.current?.destroy();
    };
  }, []);

  const handleZoomIn = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  };

  const handleZoomOut = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    cyRef.current?.fit();
  };

  if (loading) {
    return <div className="loading">Loading graph visualization...</div>;
  }

  return (
    <div className="graph-view">
      <div className="graph-header">
        <h1>Relationship Graph</h1>
        <div className="graph-controls">
          <button onClick={handleZoomIn} className="btn-control">🔍+</button>
          <button onClick={handleZoomOut} className="btn-control">🔍-</button>
          <button onClick={handleFit} className="btn-control">⊡ Fit</button>
        </div>
      </div>

      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-dot patient"></span>
          <span>Patient</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot provider"></span>
          <span>Provider</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot claim"></span>
          <span>Claim</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot suspicious"></span>
          <span>Suspicious (Red Border)</span>
        </div>
      </div>

      <div className="graph-container">
        <div ref={containerRef} className="cytoscape-container" />
        
        {selectedNode && (
          <div className="node-info-panel">
            <h3>Node Details</h3>
            <div className="node-info-content">
              <p><strong>Type:</strong> {selectedNode.type}</p>
              <p><strong>ID:</strong> {selectedNode.id}</p>
              <p><strong>Label:</strong> {selectedNode.label}</p>
              <p><strong>Suspicious:</strong> {selectedNode.suspicious ? '⚠️ Yes' : '✅ No'}</p>
              {selectedNode.data && (
                <div className="node-extra-data">
                  <strong>Additional Data:</strong>
                  <pre>{JSON.stringify(selectedNode.data, null, 2)}</pre>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedNode(null)} className="btn-close">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphView;
