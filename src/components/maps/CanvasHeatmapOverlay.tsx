import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { HeatmapPoint } from './types';

interface CanvasHeatmapOverlayProps {
  points: HeatmapPoint[];
}

export const CanvasHeatmapOverlay: React.FC<CanvasHeatmapOverlayProps> = ({ points }) => {
  const map = useMap();
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!map || !divRef.current || !canvasRef.current) return;

    class HeatmapOverlay extends google.maps.OverlayView {
      private container: HTMLDivElement;
      private canvas: HTMLCanvasElement;
      private pts: HeatmapPoint[];

      constructor(container: HTMLDivElement, canvas: HTMLCanvasElement, pts: HeatmapPoint[]) {
        super();
        this.container = container;
        this.canvas = canvas;
        this.pts = pts;
      }

      override onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayLayer.appendChild(this.container);
        }
      }

      override draw() {
        const projection = this.getProjection();
        if (!projection || !map) return;

        const zoom = map.getZoom() || 12;
        const radius = Math.max(15, zoom * 2.5);

        const width = map.getDiv().offsetWidth;
        const height = map.getDiv().offsetHeight;
        this.canvas.width = width;
        this.canvas.height = height;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        this.pts.forEach((p) => {
          const latLng = new google.maps.LatLng(p.latitude, p.longitude);
          const pos = projection.fromLatLngToContainerPixel(latLng);
          if (pos) {
            // Radial gradient for smooth glowing blur effect
            const radGrad = ctx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, radius);
            const intensity = p.weight; // typically 1.0 to 5.0
            const alpha = Math.min(0.65, intensity * 0.18);

            radGrad.addColorStop(0, `rgba(239, 68, 68, ${alpha})`); // Red center
            radGrad.addColorStop(0.35, `rgba(249, 115, 22, ${alpha * 0.55})`); // Orange middle
            radGrad.addColorStop(0.7, `rgba(234, 179, 8, ${alpha * 0.15})`); // Yellow edge
            radGrad.addColorStop(1, 'rgba(234, 179, 8, 0)'); // Transparent outside

            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }

      override onRemove() {
        if (this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
      }
    }

    const container = divRef.current;
    const canvas = canvasRef.current;
    const overlay = new HeatmapOverlay(container, canvas, points);
    overlay.setMap(map);

    // Forces a redraw when map bounds change
    const listener = map.addListener('bounds_changed', () => {
      overlay.draw();
    });

    return () => {
      listener.remove();
      overlay.setMap(null);
    };
  }, [map, points]);

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};
