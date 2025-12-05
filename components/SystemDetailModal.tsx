
import React, { useState, useEffect } from 'react';
import { X, Server, Activity, ShieldAlert, Cpu, HardDrive, Wifi, Ban, Power } from 'lucide-react';
import { SystemDevice } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { useData } from '../contexts/DataContext';

interface SystemDetailModalProps {
  system: SystemDevice;
  onClose: () => void;
}

const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose }) => {
  const { blockIp } = useData();
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [currentUpload, setCurrentUpload] = useState(system.networkStats.uploadSpeed);
  const [currentDownload, setCurrentDownload] = useState(system.networkStats.downloadSpeed);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Simulate real-time data flow
  useEffect(() => {
    const generateData = () => {
        const newData = [];
        for (let i = 0; i < 20; i++) {
            newData.push({
                time: `${i}s ago`,
                upload: Math.max(0, system.networkStats.uploadSpeed + (Math.random() * 50 - 25)),
                download: Math.max(0, system.networkStats.downloadSpeed + (Math.random() * 100 - 50)),
            });
        }
        return newData;
    };

    setTrafficData(generateData());

    const interval = setInterval(() => {
        setTrafficData(prev => {
            const nextUpload = Math.max(0, currentUpload + (Math.random() * 20 - 10));
            const nextDownload = Math.max(0, currentDownload + (Math.random() * 40 - 20));
            setCurrentUpload(nextUpload);
            setCurrentDownload(nextDownload);

            const newEntry = {
                time: 'Now',
                upload: nextUpload,
                download: nextDownload
            };
            return [...prev.slice(1), newEntry];
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [system, currentUpload, currentDownload]);

  const handleIsolate = () => {
      setIsProcessingAction(true);
      setTimeout(() => {
          blockIp(system.ip);
          setIsProcessingAction(false);
          onClose();
      }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center border",
                system.status === 'Compromised' ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
            )}>
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {system.name}
                <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold",
                    system.status === 'Online' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    system.status === 'Compromised' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    "bg-slate-700 text-slate-400 border-slate-600"
                )}>
                    {system.status}
                </span>
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-1 font-mono">
                  <span>IP: {system.ip}</span>
                  <span>MAC: {system.macAddress}</span>
                  <span>OS: {system.os}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">CPU Usage</p>
                        <p className="text-2xl font-bold text-white">{system.cpuUsage}%</p>
                        <div className="w-24 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${system.cpuUsage}%` }} />
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Memory Usage</p>
                        <p className="text-2xl font-bold text-white">{system.memoryUsage}%</p>
                        <div className="w-24 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${system.memoryUsage}%` }} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Wifi className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Active Connections</p>
                        <p className="text-2xl font-bold text-white">{Math.floor(currentUpload * 0.8 + 10)}</p>
                        <p className="text-xs text-emerald-400 mt-1">Encrypted (TLS 1.3)</p>
                    </div>
                </div>
            </div>

            {/* Network Traffic Chart */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Live Network Traffic
                    </h3>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-slate-400">Download ({currentDownload.toFixed(1)} Mbps)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500" />
                            <span className="text-slate-400">Upload ({currentUpload.toFixed(1)} Mbps)</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis stroke="#475569" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area type="monotone" dataKey="download" stroke="#10b981" fillOpacity={1} fill="url(#colorDown)" strokeWidth={2} />
                            <Area type="monotone" dataKey="upload" stroke="#6366f1" fillOpacity={1} fill="url(#colorUp)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Security Alerts associated with this system */}
            {system.status === 'Compromised' && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-white">Active Security Threat Detected</h4>
                        <p className="text-slate-300 text-sm mt-1">
                            This device is exhibiting abnormal outbound traffic patterns consistent with data exfiltration.
                            Massive upload spikes detected to unknown external IPs.
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Close Monitor
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2">
                <Power className="w-4 h-4" />
                Restart Service
            </button>
            <button 
                onClick={handleIsolate}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                <Ban className="w-4 h-4" />
                {isProcessingAction ? 'Isolating Device...' : 'Isolate Device'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default SystemDetailModal;
