import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface RoutePolylineProps {
  path: { lat: number; lng: number }[];
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ path }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || path.length < 2) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      return;
    }

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Draw new polyline with elegant dashed animations or indigo highlight colors
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#6366f1', // Indigo-500
      strokeOpacity: 0.85,
      strokeWeight: 4,
    });

    polyline.setMap(map);
    polylineRef.current = polyline;

    // Zoom the map to fit the route bounds
    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, 80); // padding

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, path]);

  return null;
};
