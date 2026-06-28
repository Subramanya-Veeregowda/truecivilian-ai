export interface IssueMediaResponse {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO" | "AUDIO";
  caption?: string;
}

export interface IssueResponse {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  locationAddress: string;
  status: "REPORTED" | "AI_ANALYZED" | "VERIFIED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CITIZEN_NOTIFIED" | "DUPLICATE" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  severity: "MINOR" | "MODERATE" | "SEVERE" | "CRITICAL";
  wardCode: string;
  upvoteCount: number;
  downvoteCount: number;
  isAnonymous: boolean;
  category: string;
  hashtags: string[];
  media: IssueMediaResponse[];
  reporterId?: string;
  reporterName?: string;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  estimatedCompletionDate?: string;
  resolutionNotes?: string;
  beforeRepairPhotoUrl?: string;
  afterRepairPhotoUrl?: string;
  slaDeadline?: string;
  isEscalated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityDto {
  id: string;
  description: string;
  timestamp: string;
  type: string;
  reporterName?: string;
  issueTitle?: string;
}

export interface AuthorityDashboardResponse {
  totalAssigned: number;
  openIssues: number;
  urgentIssues: number;
  resolvedIssues: number;
  avgResolutionTimeDays: number;
  pendingApprovals: number;
  recentActivities: ActivityDto[];
}

export interface OfficerWorkloadResponse {
  officerId: string;
  officerName: string;
  officerRole: string;
  activeAssignmentsCount: number;
  completedCount: number;
  efficiencyRating: number;
  assignedIssues: {
    id: string;
    title: string;
    status: string;
    priority: string;
    wardCode: string;
    category: string;
  }[];
}

export interface DepartmentPerformanceResponse {
  departmentId: string;
  departmentName: string;
  activeBacklog: number;
  resolvedCount: number;
  resolutionRate: number;
  averageResolutionTimeHours: number;
  slaComplianceRate: number;
  overdueCount: number;
}
