
import React from 'react';
import { X, Globe, Shield, Lock, Laptop, User, ArrowDown, Activity } from 'lucide-react';
import { SecureLink } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { useData } from '../contexts/DataContext';

interface LinkDetailModalProps {
  link: SecureLink;
  onClose: () => void;
}

const LinkDetailModal: React.FC<LinkDetailModalProps> = ({ link, onClose }) => {
  const { updateLinkStatus } = useData();

  // Prepare chart data (traffic volume per log entry for simplicity)
  const chartData = link.accessLogs.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    traffic: log.dataTransferred,
    user: log.userName
  })).reverse();

  // Aggregate stats
  const totalTraffic = link.accessLogs.reduce((acc, curr) => acc + curr.dataTransferred, 0);
  const uniqueSystems = new Set(link.accessLogs.map(l => l.systemName)).size;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center border",
                link.type === 'Repository' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            )}>
              {link.type === 'Repository' ? <Globe className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                {link.name}
                <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold",
                    link.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                )}>
                    {link.status}
                </span>
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-mono truncate max-w-md">{link.url}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-500 text-xs uppercase font-bold">Total Traffic</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-white">{totalTraffic.toFixed(1)}</span>
                        <span className="text-sm text-slate-400 mb-1">MB</span>
                    </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-500 text-xs uppercase font-bold">Total Access Events</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-white">{link.accessCount}</span>
                        <span className="text-sm text-emerald-400 mb-1 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Active
                        </span>
                    </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-500 text-xs uppercase font-bold">Unique Systems</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-white">{uniqueSystems}</span>
                        <span className="text-sm text-slate-400 mb-1">Devices</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Traffic Chart */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Traffic Volume (MB)</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis stroke="#475569" fontSize={12} />
                                <Tooltip 
                                    cursor={{fill: '#1e293b'}}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Bar dataKey="traffic" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System List Summary */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-4">Accessing Systems</h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[200px] custom-scrollbar">
                        {Array.from(new Set(link.accessLogs.map(l => l.systemId))).map(sysId => {
                            const log = link.accessLogs.find(l => l.systemId === sysId);
                            if (!log) return null;
                            return (
                                <div key={sysId} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                                    <div className="p-1.5 bg-slate-800 rounded text-slate-400">
                                        <Laptop className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-200 truncate">{log.systemName}</p>
                                        <p className="text-xs text-slate-500 font-mono">{log.systemIp}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Detailed Log Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Recent Access Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">System / IP</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3 text-right">Traffic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {link.accessLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-900/50">
                                    <td className="px-6 py-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-slate-500" />
                                            <span className="text-slate-200">{log.userName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <Laptop className="w-3 h-3 text-slate-500" />
                                            <span className="text-slate-300">{log.systemName}</span>
                                            <span className="text-slate-600 text-xs">({log.systemIp})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-xs border",
                                            log.action === 'Clone' || log.action === 'Download' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : 
                                            "bg-slate-800 text-slate-400 border-slate-700"
                                        )}>{log.action}</span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono text-slate-400">
                                        {log.dataTransferred} MB
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Close
            </button>
            <button 
                onClick={() => {
                    updateLinkStatus(link.id, link.status === 'Active' ? 'Locked' : 'Active');
                    onClose();
                }}
                className={clsx(
                    "px-4 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2",
                    link.status === 'Active' 
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20" 
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                )}
            >
                <Lock className="w-4 h-4" />
                {link.status === 'Active' ? 'Lock Resource' : 'Unlock Resource'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default LinkDetailModal;
