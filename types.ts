
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Manager' | 'Employee';
  avatar?: string;
}

export interface SystemDevice {
  id: string;
  name: string; // e.g., "MacBook Pro M1"
  ip: string;
  macAddress: string;
  os: string;
  status: 'Online' | 'Offline' | 'Compromised' | 'Isolating';
  lastActive: string;
  cpuUsage: number; // 0-100
  memoryUsage: number; // 0-100
  networkStats: {
    uploadSpeed: number; // Mbps
    downloadSpeed: number; // Mbps
    activeConnections: number;
    totalBandwidthToday: string; // e.g. "1.2 GB"
  };
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  riskScore: number;
  systems: SystemDevice[]; // Replaces generic authorized strings
  authorizedApps: string[]; // Kept for context
  status: 'Active' | 'Suspended' | 'Under Review';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'System' | 'Firewall' | 'Git' | 'Auth' | 'BotDetector';
  event: string;
  details: string;
  user?: string;
  ip?: string;
  riskLevel: RiskLevel;
}

export interface LinkAccessLog {
  id: string;
  timestamp: string;
  systemId: string;
  systemName: string;
  systemIp: string;
  userId: string;
  userName: string;
  action: 'Clone' | 'View' | 'Download' | 'Push';
  dataTransferred: number; // in MB
}

export interface SecureLink {
  id: string;
  name: string;
  url: string;
  type: 'Repository' | 'Internal Tool' | 'Sensitive Doc';
  accessCount: number;
  lastAccessedBy: string;
  lastAccessedAt: string;
  status: 'Active' | 'Locked' | 'Compromised';
  accessLogs: LinkAccessLog[]; // New: Detailed access history
}

export interface AiAction {
  id: string;
  timestamp: string;
  triggerEvent: string;
  analysis: string;
  actionTaken: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface AiObservation {
  id: string;
  logId: string;
  thoughtProcess: string;
  decision: string;
  remediation?: string;
}

export interface BotWhitelistEntry {
  id: string;
  name: string;
  identifier: string; // User Agent or IP
  type: 'Internal' | 'External' | 'Partner';
  addedBy: string;
  addedAt: string;
}
