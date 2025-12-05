
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Employee, LogEntry, SecureLink, AiAction, RiskLevel, BotWhitelistEntry } from '../types';
import { MOCK_EMPLOYEES, MOCK_LOGS, MOCK_LINKS, MOCK_AI_ACTIONS, MOCK_BOT_WHITELIST } from '../constants';

interface DataContextType {
  employees: Employee[];
  logs: LogEntry[];
  links: SecureLink[];
  aiActions: AiAction[];
  botWhitelist: BotWhitelistEntry[];
  blockedIps: string[];
  addLog: (log: LogEntry) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployeeRisk: (id: string, score: number) => void;
  updateEmployeeStatus: (id: string, status: Employee['status']) => void;
  addAiAction: (action: AiAction) => void;
  updateLinkStatus: (id: string, status: SecureLink['status']) => void;
  addLink: (link: Pick<SecureLink, 'name' | 'url' | 'type'>) => void;
  addBotToWhitelist: (bot: BotWhitelistEntry) => void;
  removeBotFromWhitelist: (id: string) => void;
  blockIp: (ip: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const [links, setLinks] = useState<SecureLink[]>(MOCK_LINKS);
  const [aiActions, setAiActions] = useState<AiAction[]>(MOCK_AI_ACTIONS);
  const [botWhitelist, setBotWhitelist] = useState<BotWhitelistEntry[]>(MOCK_BOT_WHITELIST);
  const [blockedIps, setBlockedIps] = useState<string[]>([]);

  const addLog = useCallback((log: LogEntry) => {
    setLogs(prev => [log, ...prev]);
  }, []);

  const addEmployee = useCallback((employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `EMP-${Date.now()}`,
    };
    setEmployees(prev => [newEmployee, ...prev]);
  }, []);

  const updateEmployeeRisk = useCallback((id: string, score: number) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, riskScore: score } : e));
  }, []);

  const updateEmployeeStatus = useCallback((id: string, status: Employee['status']) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  }, []);

  const addAiAction = useCallback((action: AiAction) => {
    setAiActions(prev => [action, ...prev]);
  }, []);

  const updateLinkStatus = useCallback((id: string, status: SecureLink['status']) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }, []);

  const addLink = useCallback((linkData: Pick<SecureLink, 'name' | 'url' | 'type'>) => {
    const newLink: SecureLink = {
      id: `LNK-${Date.now()}`,
      ...linkData,
      accessCount: 0,
      lastAccessedBy: 'N/A',
      lastAccessedAt: new Date().toISOString(),
      status: 'Active',
      accessLogs: []
    };
    setLinks(prev => [newLink, ...prev]);
  }, []);

  const addBotToWhitelist = useCallback((bot: BotWhitelistEntry) => {
    setBotWhitelist(prev => [bot, ...prev]);
  }, []);

  const removeBotFromWhitelist = useCallback((id: string) => {
    setBotWhitelist(prev => prev.filter(b => b.id !== id));
  }, []);

  const blockIp = useCallback((ip: string) => {
    if (!blockedIps.includes(ip)) {
      setBlockedIps(prev => [...prev, ip]);
    }
  }, [blockedIps]);

  return (
    <DataContext.Provider value={{ 
      employees, 
      logs, 
      links, 
      aiActions, 
      botWhitelist,
      blockedIps,
      addLog, 
      addEmployee,
      updateEmployeeRisk, 
      updateEmployeeStatus,
      addAiAction, 
      updateLinkStatus,
      addLink,
      addBotToWhitelist,
      removeBotFromWhitelist,
      blockIp
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
