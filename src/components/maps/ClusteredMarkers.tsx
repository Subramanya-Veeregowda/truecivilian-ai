import React from 'react';
import { Issue } from './types';
import { IssueMarker } from './IssueMarker';

interface ClusteredMarkersProps {
  issues: Issue[];
  onMarkerClick: (issue: Issue) => void;
  selectedIssueId?: string;
}

export const ClusteredMarkers: React.FC<ClusteredMarkersProps> = ({
  issues,
  onMarkerClick,
  selectedIssueId,
}) => {
  return (
    <>
      {issues.map((issue) => (
        <IssueMarker
          key={issue.id}
          issue={issue}
          onClick={onMarkerClick}
          isSelected={selectedIssueId === issue.id}
        />
      ))}
    </>
  );
};
