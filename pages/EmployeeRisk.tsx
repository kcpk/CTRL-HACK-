
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { AlertTriangle, RotateCw, Ban, Plus, Monitor, Laptop, Server, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import AddEmployeeModal from '../components/AddEmployeeModal';
import SystemDetailModal from '../components/SystemDetailModal';
import CompromisedSystems from '../components/CompromisedSystems';
import { SystemDevice } from '../types';

const EmployeeRisk: React.FC = () => {
  const { employees, updateEmployeeRisk, updateEmployeeStatus } = useData();
  const [isAuditing, setIsAuditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<SystemDevice | null>(null);

  const handleAudit = () => {
      setIsAuditing(true);
      setTimeout(() => {
          employees.forEach(emp => {
              const fluctuation = Math.floor(Math.random() * 20) - 10;
              const newScore = Math.min(100, Math.max(0, emp.riskScore + fluctuation));
              updateEmployeeRisk(emp.id, newScore);
          });
          setIsAuditing(false);
      }, 2000);
  };

  const handleRevoke = (id: string) => {
      if(confirm('Are you sure you want to revoke all access and suspend this employee?')) {
          updateEmployeeStatus(id, 'Suspended');
      }
  }

  const getSystemIcon = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes('mobile') || lower.includes('iphone') || lower.includes('android')) return Smartphone;
      if (lower.includes('server') || lower.includes('ubuntu') || lower.includes('linux')) return Server;
      return Laptop;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Employee Access & Risk</h1>
          <p className="text-slate-400">Monitor employee devices, network traffic, and risk scores.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={() => setShowAddModal(true)}
                className="flex-1 md:flex-none justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">Add Employee</span>
            </button>
            <button 
                onClick={handleAudit}
                disabled={isAuditing}
                className="flex-1 md:flex-none justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                <RotateCw className={clsx("w-4 h-4", isAuditing && "animate-spin")} />
                <span className="whitespace-nowrap">{isAuditing ? 'Auditing...' : 'Audit Permissions'}</span>
            </button>
        </div>
      </div>

      {/* Compromised Systems Alert Section */}
      <CompromisedSystems onSelectSystem={setSelectedSystem} />

      <div className="grid grid-cols-1 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className={clsx(
              "border rounded-xl p-4 md:p-6 flex flex-col lg:flex-row gap-6 transition-colors",
              employee.status === 'Suspended' ? "bg-slate-950 border-slate-800 opacity-75" : "bg-slate-900 border-slate-800"
          )}>
            
            {/* Employee Info */}
            <div className="flex items-start gap-4 lg:w-1/4">
              <div className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0",
                  employee.status === 'Suspended' ? "bg-slate-800 text-slate-500" : "bg-slate-800 text-indigo-400"
              )}>
                {employee.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2 flex-wrap">
                    {employee.name}
                    {employee.status === 'Suspended' && <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Suspended</span>}
                </h3>
                <p className="text-sm text-slate-400">{employee.role}</p>
                <p className="text-xs text-slate-500 mt-1">{employee.department}</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="flex flex-col justify-center lg:w-1/4">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Risk Score</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={clsx("h-full rounded-full transition-all duration-500", 
                      employee.riskScore > 70 ? "bg-rose-500" : employee.riskScore > 30 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${employee.riskScore}%` }}
                  />
                </div>
                <span className={clsx("text-lg font-bold", 
                   employee.riskScore > 70 ? "text-rose-400" : employee.riskScore > 30 ? "text-amber-400" : "text-emerald-400"
                )}>{employee.riskScore}</span>
              </div>
              {employee.riskScore > 50 && (
                 <div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
                   <AlertTriangle className="w-3 h-3" />
                   <span>Anomalous login pattern detected</span>
                 </div>
              )}
            </div>

            {/* Registered Systems (Access) */}
            <div className="flex-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Registered Systems</span>
              <div className="flex flex-col gap-2">
                {employee.systems && employee.systems.length > 0 ? (
                  employee.systems.map(system => {
                      const Icon = getSystemIcon(system.name);
                      return (
                        <button 
                            key={system.id} 
                            onClick={() => setSelectedSystem(system)}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 transition-all group text-left"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{system.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{system.ip}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={clsx(
                                    "text-xs px-2 py-0.5 rounded-full border",
                                    system.status === 'Online' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                    system.status === 'Compromised' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                    "bg-slate-800 text-slate-500 border-slate-700"
                                )}>
                                    {system.status}
                                </span>
                                <Monitor className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                            </div>
                        </button>
                      );
                  })
                ) : (
                    <span className="text-xs text-slate-600 italic">No devices registered.</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row lg:flex-col justify-center gap-2 lg:w-32">
                <button className="flex-1 lg:flex-none text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded px-3 py-2 transition-colors">
                    View Logs
                </button>
                {employee.status !== 'Suspended' && (
                    <button 
                        onClick={() => handleRevoke(employee.id)}
                        className="flex-1 lg:flex-none text-xs font-medium text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:border-rose-800 bg-rose-950/20 rounded px-3 py-2 transition-colors flex items-center justify-center gap-1"
                    >
                        <Ban className="w-3 h-3" />
                        Revoke All
                    </button>
                )}
            </div>

          </div>
        ))}
      </div>

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
      
      {selectedSystem && (
          <SystemDetailModal 
            system={selectedSystem} 
            onClose={() => setSelectedSystem(null)} 
          />
      )}
    </div>
  );
};

export default EmployeeRisk;
