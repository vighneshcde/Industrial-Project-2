// knowledgeGraph.js - Interactive Semantic Regulatory Knowledge Graph

import { KNOWLEDGE_GRAPH_DATA } from '../data/mockData.js';

export class KnowledgeGraphVisualizer {
  constructor(appState) {
    this.appState = appState;
    this.nodes = JSON.parse(JSON.stringify(KNOWLEDGE_GRAPH_DATA.nodes));
    this.links = JSON.parse(JSON.stringify(KNOWLEDGE_GRAPH_DATA.links));
    this.selectedNode = null;
    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('view-kg');
    this.render();
    this.initCanvas();
  }

  render() {
    this.container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 24px;">
        <div class="card-panel-header">
          <div class="card-panel-title">
            <span>🕸️</span> Semantic Regulatory Knowledge Graph
          </div>
          <span class="badge-status info">Interactive Topology</span>
        </div>

        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
          Multi-hop semantic mapping between statutory acts, applicable sections, company attributes, and verified payments. Click any node to inspect ontology linkages.
        </p>

        <div style="width: 100%; height: 500px; background: #060911; border: 1px solid var(--border-default); border-radius: var(--radius-lg); position: relative;">
          <canvas id="kg-canvas" style="width: 100%; height: 100%;"></canvas>
        </div>
      </div>
    `;
  }

  initCanvas() {
    const canvas = document.getElementById('kg-canvas');
    if (!canvas) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.nodes.forEach((n, i) => {
      const angle = (i / this.nodes.length) * Math.PI * 2;
      const radius = n.type === 'entity' ? 0 : 160;
      n.x = centerX + Math.cos(angle) * radius;
      n.y = centerY + Math.sin(angle) * (radius * 0.7);
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Links
      this.links.forEach(l => {
        const s = this.nodes.find(n => n.id === l.source);
        const t = this.nodes.find(n => n.id === l.target);
        if (s && t) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // Nodes
      this.nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius || 18, 0, Math.PI * 2);
        ctx.fillStyle = n.type === 'entity' ? '#a855f7' : n.type === 'act' ? '#38bdf8' : n.type === 'obligation' ? '#ec4899' : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + (n.radius || 18) + 14);
      });
    };

    draw();
  }
}
