import React from 'react';
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Issue } from './types';

interface IssueMarkerProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
  isSelected?: boolean;
}

export const IssueMarker: React.FC<IssueMarkerProps> = ({
  issue,
  onClick,
  isSelected = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return '#3b82f6'; // Blue
      case 'VERIFIED':
        return '#10b981'; // Emerald
      case 'IN_PROGRESS':
        return '#f59e0b'; // Amber
      case 'RESOLVED':
        return '#6b7280'; // Slate Gray
      case 'DUPLICATE':
        return '#8b5cf6'; // Violet
      case 'REJECTED':
        return '#ef4444'; // Rose Red
      default:
        return '#71717a'; // Zinc
    }
  };

  const getStatusGlyph = (category: string) => {
    const norm = category.toLowerCase();
    if (norm.includes('road') || norm.includes('pothole')) return '🚧';
    if (norm.includes('water') || norm.includes('drain')) return '💧';
    if (norm.includes('sewage') || norm.includes('leak')) return '🚽';
    if (norm.includes('waste') || norm.includes('garbage')) return '🗑️';
    if (norm.includes('power') || norm.includes('electric')) return '⚡';
    if (norm.includes('public_space') || norm.includes('park')) return '🌳';
    return '📍';
  };

  const pinColor = getStatusColor(issue.status);

  return (
    <AdvancedMarker
      position={{ lat: issue.latitude, lng: issue.longitude }}
      onClick={() => onClick(issue)}
      title={issue.title}
    >
      <Pin
        background={pinColor}
        borderColor={isSelected ? '#ffffff' : pinColor}
        glyphColor="#ffffff"
        scale={isSelected ? 1.25 : 1.0}
        glyph={getStatusGlyph(issue.category || 'other')}
      />
    </AdvancedMarker>
  );
};
