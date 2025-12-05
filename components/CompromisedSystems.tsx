
import React from 'react';
import { useData } from '../contexts/DataContext';
import { SystemDevice } from '../types';
import { ShieldAlert, AlertOctagon, ArrowRight, Activity, User } from 'lucide-react';

interface CompromisedSystemsProps {
  onSelectSystem: (system: SystemDevice) => void;
}

const CompromisedSystems: React.FC<CompromisedSystemsProps> = ({ onSelectSystem }) => {
  const { employees } = useData();

  // Flatten the data structure to find all compromised systems and attach owner info
  const compromisedDevices = employees.flatMap(employee => 
    (employee.systems || [])
      .filter(sys => sys.status === 'Compromised')
      .map(sys => ({
        ...sys,
        ownerName: employee.name,
        ownerRole: employee.role,
        ownerId: employee.id
      }))
  );

  if (compromisedDevices.length === 0) return null;

  return (
    <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-6 mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-500/20 rounded-lg animate-pulse">
            <AlertOctagon className="w-6 h-6 text-rose-500" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">Active Device Threats Detected</h2>
            <p className="text-rose-300/80 text-sm">Immediate attention required for {compromisedDevices.length} compromised system{compromisedDevices.length !== 1 ? 's' : ''}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {compromisedDevices.map((device) => (
          <div 
            key={device.id} 
            className="bg-slate-950 border border-rose-900/50 hover:border-rose-500/50 rounded-lg p-4 transition-all group relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl -mr-10 -mt-10 rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        {device.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-rose-400 font-mono mt-1">
                        <Activity className="w-3 h-3" />
                        {device.ip}
                    </div>
                </div>
                <span className="bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow shadow-rose-500/20">
                    Critical
                </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 border-t border-slate-800/50 pt-3 relative z-10">
                <User className="w-3.5 h-3.5" />
                <span>{device.ownerName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-500">{device.ownerRole}</span>
            </div>

            <button 
                onClick={() => onSelectSystem(device)}
                className="w-full bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-600/20 hover:border-rose-600 rounded-lg py-2 text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-rose-900/20 relative z-10"
            >
                Investigate Threat
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompromisedSystems;
