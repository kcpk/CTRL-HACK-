import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { useData } from '../contexts/DataContext';
import { AlertTriangle, ShieldCheck, Activity, Users } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={clsx("p-2 rounded-lg bg-opacity-10", color)}>
        <Icon className={clsx("w-6 h-6", color.replace('bg-', 'text-'))} />
      </div>
    </div>
    <div className="flex items-center text-xs">
      <span className={clsx("font-medium", trend.includes('+') ? "text-emerald-400" : "text-rose-400")}>
        {trend}
      </span>
      <span className="text-slate-500 ml-2">vs last week</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { logs, employees } = useData();

  const chartData = [
    { name: 'Mon', threats: 4, normal: 240 },
    { name: 'Tue', threats: 3, normal: 139 },
    { name: 'Wed', threats: 9, normal: 980 },
    { name: 'Thu', threats: 2, normal: 390 },
    { name: 'Fri', threats: 6, normal: 480 },
    { name: 'Sat', threats: 2, normal: 380 },
    { name: 'Sun', threats: 1, normal: 430 },
  ];

  const highRiskEmployees = employees.filter(e => e.riskScore > 70).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Security Overview</h1>
        <p className="text-slate-400">Real-time threat monitoring and system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Threats" 
          value={logs.filter(l => l.riskLevel === 'Critical' || l.riskLevel === 'High').length} 
          trend="+12%" 
          icon={AlertTriangle} 
          color="bg-rose-500 text-rose-500" 
        />
        <StatCard 
          title="System Health" 
          value="98.9%" 
          trend="+0.1%" 
          icon={ShieldCheck} 
          color="bg-emerald-500 text-emerald-500" 
        />
        <StatCard 
          title="High Risk Users" 
          value={highRiskEmployees} 
          trend="-2%" 
          icon={Users} 
          color="bg-amber-500 text-amber-500" 
        />
        <StatCard 
          title="Events Processed" 
          value="24.5k" 
          trend="+8%" 
          icon={Activity} 
          color="bg-indigo-500 text-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Threat Detection Traffic</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChartComponent data={chartData} />
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent Critical Alerts</h3>
          <div className="space-y-4">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className={clsx(
                  "w-2 h-2 mt-2 rounded-full",
                  log.riskLevel === 'Critical' ? "bg-rose-500" : 
                  log.riskLevel === 'High' ? "bg-amber-500" : "bg-emerald-500"
                )} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{log.event}</p>
                  <p className="text-xs text-slate-400">{log.details}</p>
                </div>
                <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AreaChartComponent = ({ data }: { data: any[] }) => (
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
    <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
    <YAxis stroke="#64748b" tick={{fontSize: 12}} />
    <Tooltip 
      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
      itemStyle={{ color: '#e2e8f0' }}
    />
    <Line type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={2} dot={false} />
    <Line type="monotone" dataKey="normal" stroke="#10b981" strokeWidth={2} dot={false} />
  </LineChart>
);

export default Dashboard;