export interface Issue {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  locationAddress: string;
  status: 'REPORTED' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED' | 'DUPLICATE' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CATASTROPHIC';
  category: string;
  wardCode: string;
  upvoteCount: number;
  downvoteCount: number;
  isAnonymous: boolean;
  hashtags: string[];
  media: { id: string; mediaUrl: string; mediaType: string; caption?: string }[];
  reporterId?: string;
  reporterName?: string;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MapFilters {
  category: string;
  status: string;
  severity: string;
  priority: string;
  departmentId: string;
  distanceKm: number;
}

export interface GeocodingResult {
  address: string;
  latitude: number;
  longitude: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
}

export interface OptimizedRoute {
  optimizedWaypoints: Issue[];
  totalDistanceKm: number;
  totalDurationMin: number;
  pathCoordinates: { lat: number; lng: number }[];
  navigationInstructions: string[];
}
