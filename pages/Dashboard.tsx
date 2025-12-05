
import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { useData } from '../contexts/DataContext';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Users, 
  Server, 
  Zap, 
  Brain, 
  ArrowUpRight, 
  Globe, 
  Wifi, 
  Download, 
  Upload 
} from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

// --- Helper Components ---

const MetricCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-start justify-between hover:border-slate-700 transition-colors group">
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      {subValue && <p className="text-xs text-slate-500 mt-1 font-mono">{subValue}</p>}
      {trend && (
        <div className={clsx("flex items-center gap-1 mt-2 text-xs font-medium", trend > 0 ? "text-emerald-400" : "text-rose-400")}>
           {trend > 0 ? "+" : ""}{trend}% <span className="text-slate-600 font-normal">vs last hour</span>
        </div>
      )}
    </div>
    <div className={clsx("p-3 rounded-lg bg-opacity-10 group-hover:scale-110 transition-transform duration-300", color)}>
      <Icon className={clsx("w-6 h-6", color.replace('bg-', 'text-'))} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { logs, employees, aiActions, links } = useData();
  const navigate = useNavigate();

  // --- Real-time Calculations ---

  const stats = useMemo(() => {
    const activeThreats = logs.filter(l => l.riskLevel === 'Critical' || l.riskLevel === 'High').length;
    const compromisedSystems = employees.flatMap(e => e.systems).filter(s => s.status === 'Compromised').length;
    const totalSystems = employees.flatMap(e => e.systems).length;
    const onlineSystems = employees.flatMap(e => e.systems).filter(s => s.status === 'Online').length;
    
    // Calculate total bandwidth (mock calculation based on employees)
    const totalUpload = employees.flatMap(e => e.systems).reduce((acc, s) => acc + s.networkStats.uploadSpeed, 0);
    const totalDownload = employees.flatMap(e => e.systems).reduce((acc, s) => acc + s.networkStats.downloadSpeed, 0);

    // Calculate Security Score (Simple Algorithm)
    const baseScore = 100;
    const threatPenalty = activeThreats * 5;
    const compSystemPenalty = compromisedSystems * 15;
    const securityScore = Math.max(0, baseScore - threatPenalty - compSystemPenalty);

    return {
      activeThreats,
      compromisedSystems,
      totalSystems,
      onlineSystems,
      totalUpload: totalUpload.toFixed(1),
      totalDownload: totalDownload.toFixed(1),
      securityScore
    };
  }, [logs, employees]);

  // --- Chart Data Preparation ---

  const riskDistributionData = useMemo(() => {
    const distribution = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    logs.forEach(l => {
      // @ts-ignore
      if (distribution[l.riskLevel] !== undefined) distribution[l.riskLevel]++;
    });
    return [
      { name: 'Low', value: distribution.Low, color: '#10b981' },
      { name: 'Medium', value: distribution.Medium, color: '#f59e0b' },
      { name: 'High', value: distribution.High, color: '#f97316' },
      { name: 'Critical', value: distribution.Critical, color: '#f43f5e' },
    ].filter(d => d.value > 0);
  }, [logs]);

  const trafficData = [
    { time: '00:00', in: 400, out: 240 },
    { time: '04:00', in: 300, out: 139 },
    { time: '08:00', in: 900, out: 980 },
    { time: '12:00', in: 1200, out: 890 },
    { time: '16:00', in: 1500, out: 1100 },
    { time: '20:00', in: 800, out: 480 },
    { time: '23:59', in: 500, out: 300 },
  ];

  return (
    <div className="space-y-6 pb-6">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Security Operations Center</h1>
          <p className="text-slate-400 text-sm">System Status: <span className="text-emerald-400 font-bold">Operational</span> • AI Engine: <span className="text-indigo-400 font-bold">Active</span></p>
        </div>
        <div className="flex gap-3">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                <Zap className="w-4 h-4" />
                Run System Scan
            </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Security Score" 
          value={`${stats.securityScore}/100`} 
          subValue="Real-time Assessment"
          icon={ShieldCheck} 
          color={stats.securityScore > 80 ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500"}
          trend={2.5}
        />
        <MetricCard 
          title="Network Load" 
          value={`${(Number(stats.totalDownload) / 1024).toFixed(1)} Gbps`} 
          subValue={`Up: ${stats.totalUpload} Mbps`}
          icon={Activity} 
          color="bg-indigo-500 text-indigo-500" 
          trend={12}
        />
        <MetricCard 
          title="Active Users / Devices" 
          value={employees.filter(e => e.status === 'Active').length} 
          subValue={`${stats.onlineSystems} Devices Online`}
          icon={Users} 
          color="bg-sky-500 text-sky-500" 
        />
        <MetricCard 
          title="Compromised Assets" 
          value={stats.compromisedSystems} 
          subValue={`${stats.activeThreats} Active Alerts`}
          icon={AlertTriangle} 
          color={stats.compromisedSystems > 0 ? "bg-rose-500 text-rose-500" : "bg-slate-500 text-slate-500"} 
        />
      </div>

      {/* Main Grid: Charts & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Traffic & AI Pulse (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Network Traffic Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Network Traffic Volume
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" /> Inbound
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Outbound
                        </div>
                    </div>
                </div>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                            <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area type="monotone" dataKey="in" stroke="#6366f1" fillOpacity={1} fill="url(#colorIn)" strokeWidth={2} />
                            <Area type="monotone" dataKey="out" stroke="#10b981" fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Action Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        AI Neural Pulse
                    </h3>
                    <button onClick={() => navigate('/ai-brain')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        View Brain Logic <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="divide-y divide-slate-800 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {aiActions.length > 0 ? aiActions.map(action => (
                        <div key={action.id} className="p-4 hover:bg-slate-800/50 transition-colors flex gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                <span className="text-xs text-slate-500">{new Date(action.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <div className="h-full w-px bg-slate-800" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-bold text-slate-200">{action.triggerEvent}</span>
                                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">{action.status}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{action.analysis}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> {action.actionTaken}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-500">
                            <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No autonomous actions taken recently.</p>
                            <p className="text-xs">AI is monitoring passively.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>

        {/* Right Column: Risk & System Health (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Risk Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Risk Distribution</h3>
                <div className="h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={riskDistributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {riskDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-white">{logs.length}</span>
                        <span className="text-xs text-slate-500 uppercase">Events</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {riskDistributionData.map(d => (
                        <div key={d.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-sm text-slate-300">{d.name}</span>
                            <span className="text-xs text-slate-500 ml-auto">{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Health Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-500" />
                    System Health
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-emerald-400">Online</span>
                            <span className="text-slate-400">{stats.onlineSystems} / {stats.totalSystems}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500" 
                                style={{ width: `${(stats.onlineSystems / stats.totalSystems) * 100}%` }} 
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-rose-400">Compromised</span>
                            <span className="text-slate-400">{stats.compromisedSystems} / {stats.totalSystems}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-rose-500" 
                                style={{ width: `${(stats.compromisedSystems / stats.totalSystems) * 100}%` }} 
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Offline</span>
                            <span className="text-slate-400">{stats.totalSystems - stats.onlineSystems - stats.compromisedSystems} / {stats.totalSystems}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-slate-600" 
                                style={{ width: `${((stats.totalSystems - stats.onlineSystems - stats.compromisedSystems) / stats.totalSystems) * 100}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Protected Links Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-500" />
                    Secure Links
                </h3>
                <div className="space-y-3">
                    {links.slice(0,3).map(link => (
                        <div key={link.id} className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800">
                             <div className="flex flex-col truncate">
                                 <span className="text-sm font-medium text-slate-200 truncate max-w-[150px]">{link.name}</span>
                                 <span className="text-xs text-slate-500">{link.accessCount} accesses</span>
                             </div>
                             <span className={clsx("text-xs px-2 py-0.5 rounded border", link.status === 'Active' ? "border-emerald-500/30 text-emerald-400" : "border-rose-500/30 text-rose-400")}>
                                 {link.status}
                             </span>
                        </div>
                    ))}
                    <button onClick={() => navigate('/secure-links')} className="w-full text-xs text-center text-slate-500 hover:text-white mt-2">
                        View All Resources
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
