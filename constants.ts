
import { Employee, LogEntry, RiskLevel, SecureLink, AiAction, BotWhitelistEntry } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Chen',
    role: 'Senior DevOps',
    department: 'Infrastructure',
    riskScore: 12,
    authorizedApps: ['AWS Console', 'Jira'],
    status: 'Active',
    systems: [
      {
        id: 'SYS-001',
        name: 'Workstation Alpha',
        ip: '10.0.4.22',
        macAddress: '00:1B:44:11:3A:B7',
        os: 'Ubuntu 22.04 LTS',
        status: 'Online',
        lastActive: new Date().toISOString(),
        cpuUsage: 45,
        memoryUsage: 62,
        networkStats: {
          uploadSpeed: 12.5,
          downloadSpeed: 45.2,
          activeConnections: 14,
          totalBandwidthToday: '4.5 GB'
        }
      },
      {
        id: 'SYS-002',
        name: 'Dev MacBook',
        ip: '192.168.1.105',
        macAddress: 'A1:B2:C3:D4:E5:F6',
        os: 'macOS Sonoma',
        status: 'Offline',
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        cpuUsage: 0,
        memoryUsage: 0,
        networkStats: {
          uploadSpeed: 0,
          downloadSpeed: 0,
          activeConnections: 0,
          totalBandwidthToday: '0 GB'
        }
      }
    ]
  },
  {
    id: 'EMP-002',
    name: 'Michael Ross',
    role: 'Frontend Engineer',
    department: 'Product',
    riskScore: 45,
    authorizedApps: ['Figma', 'VS Code'],
    status: 'Active',
    systems: [
      {
        id: 'SYS-003',
        name: 'Ross-MBP-Corporate',
        ip: '10.0.4.45',
        macAddress: 'AA:BB:CC:11:22:33',
        os: 'macOS Sonoma',
        status: 'Online',
        lastActive: new Date().toISOString(),
        cpuUsage: 78,
        memoryUsage: 89,
        networkStats: {
          uploadSpeed: 150.2,
          downloadSpeed: 420.5,
          activeConnections: 124,
          totalBandwidthToday: '12.8 GB'
        }
      }
    ]
  },
  {
    id: 'EMP-003',
    name: 'David Kim',
    role: 'Contractor',
    department: 'External',
    riskScore: 88,
    authorizedApps: ['Jira'],
    status: 'Under Review',
    systems: [
      {
        id: 'SYS-004',
        name: 'Unknown-Device-X1',
        ip: '192.168.100.55',
        macAddress: 'DE:AD:BE:EF:CA:FE',
        os: 'Windows 11',
        status: 'Compromised',
        lastActive: new Date().toISOString(),
        cpuUsage: 99,
        memoryUsage: 95,
        networkStats: {
          uploadSpeed: 850.0,
          downloadSpeed: 10.5,
          activeConnections: 5430,
          totalBandwidthToday: '45.2 GB'
        }
      }
    ]
  },
];

export const MOCK_LOGS: LogEntry[] = [
  {
    id: 'LOG-1023',
    timestamp: new Date().toISOString(),
    source: 'Auth',
    event: 'Failed Login Attempt',
    details: '3 failed attempts from IP 192.168.1.5',
    user: 'David Kim',
    ip: '192.168.1.5',
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    id: 'LOG-1022',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    source: 'Git',
    event: 'Repo Cloned',
    details: 'frontend-main cloned via HTTPS',
    user: 'Michael Ross',
    ip: '10.0.0.12',
    riskLevel: RiskLevel.LOW,
  },
  {
    id: 'LOG-1021',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    source: 'BotDetector',
    event: 'Abnormal API Usage',
    details: 'Rate limit exceeded (500 req/s)',
    user: 'Unknown',
    ip: '45.33.22.11',
    riskLevel: RiskLevel.CRITICAL,
  },
];

export const MOCK_LINKS: SecureLink[] = [
  {
    id: 'LNK-01',
    name: 'Production DB Credentials',
    url: 'https://vault.internal/secret/prod-db',
    type: 'Sensitive Doc',
    accessCount: 12,
    lastAccessedBy: 'Sarah Chen',
    lastAccessedAt: new Date().toISOString(),
    status: 'Active',
    accessLogs: [
      {
        id: 'ACC-001',
        timestamp: new Date().toISOString(),
        systemId: 'SYS-001',
        systemName: 'Workstation Alpha',
        systemIp: '10.0.4.22',
        userId: 'EMP-001',
        userName: 'Sarah Chen',
        action: 'View',
        dataTransferred: 0.5
      },
      {
        id: 'ACC-002',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        systemId: 'SYS-003',
        systemName: 'Ross-MBP-Corporate',
        systemIp: '10.0.4.45',
        userId: 'EMP-002',
        userName: 'Michael Ross',
        action: 'View',
        dataTransferred: 0.2
      }
    ]
  },
  {
    id: 'LNK-02',
    name: 'Core Payment Service',
    url: 'github.com/aegis/payment-core',
    type: 'Repository',
    accessCount: 450,
    lastAccessedBy: 'Michael Ross',
    lastAccessedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'Active',
    accessLogs: [
      {
        id: 'ACC-003',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        systemId: 'SYS-003',
        systemName: 'Ross-MBP-Corporate',
        systemIp: '10.0.4.45',
        userId: 'EMP-002',
        userName: 'Michael Ross',
        action: 'Clone',
        dataTransferred: 850
      },
      {
        id: 'ACC-004',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        systemId: 'SYS-001',
        systemName: 'Workstation Alpha',
        systemIp: '10.0.4.22',
        userId: 'EMP-001',
        userName: 'Sarah Chen',
        action: 'Push',
        dataTransferred: 12
      },
       {
        id: 'ACC-005',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        systemId: 'SYS-003',
        systemName: 'Ross-MBP-Corporate',
        systemIp: '10.0.4.45',
        userId: 'EMP-002',
        userName: 'Michael Ross',
        action: 'Download',
        dataTransferred: 45
      }
    ]
  },
];

export const MOCK_AI_ACTIONS: AiAction[] = [
  {
    id: 'ACT-001',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    triggerEvent: 'Suspicious IP Login (Russia)',
    analysis: 'IP 89.1.1.1 is flagged in threat intelligence.',
    actionTaken: 'Account Locked & Session Revoked',
    status: 'Completed',
  },
];

export const MOCK_BOT_WHITELIST: BotWhitelistEntry[] = [
  {
    id: 'BOT-001',
    name: 'UptimeMonitor',
    identifier: 'UptimeRobot/2.0',
    type: 'External',
    addedBy: 'Admin User',
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'BOT-002',
    name: 'CI/CD Deployer',
    identifier: '10.0.0.55',
    type: 'Internal',
    addedBy: 'Sarah Chen',
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];
