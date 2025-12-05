import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { LogEntry, RiskLevel } from '../types';
import LogAnalysisModal from '../components/LogAnalysisModal';

const LiveLogs: React.FC = () => {
  const { logs, addLog } = useData();
  const [filter, setFilter] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Simulation of incoming logs
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new log every 3s
        const sources: LogEntry['source'][] = ['System', 'Firewall', 'BotDetector', 'Auth'];
        const levels: RiskLevel[] = [RiskLevel.LOW, RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH];
        
        const newLog: LogEntry = {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: sources[Math.floor(Math.random() * sources.length)],
          event: 'Automated System Check',
          details: 'Routine verification passed',
          riskLevel: levels[Math.floor(Math.random() * levels.length)],
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`
        };
        addLog(newLog);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, addLog]);

  const filteredLogs = logs.filter(log => 
    log.event.toLowerCase().includes(filter.toLowerCase()) || 
    log.source.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Live System Logs</h1>
            <p className="text-slate-400">Real-time stream of all system activities. Click a log to analyze.</p>
          </div>
          <div className="flex gap-4">
              <button 
                  onClick={() => setIsLive(!isLive)}
                  className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors", isLive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400")}
              >
                  <RefreshCw className={clsx("w-4 h-4", isLive && "animate-spin")} />
                  {isLive ? 'Live Stream On' : 'Paused'}
              </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter logs..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-sm relative">
          <div className="absolute inset-0 overflow-y-auto p-4 space-y-2">
              {filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="group flex gap-4 p-2 hover:bg-slate-900 rounded border-l-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer items-center"
                  >
                      <span className="text-slate-500 w-24 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={clsx(
                          "w-20 shrink-0 font-bold",
                          log.riskLevel === 'Critical' ? "text-rose-500" :
                          log.riskLevel === 'High' ? "text-amber-500" :
                          log.riskLevel === 'Medium' ? "text-yellow-500" : "text-emerald-500"
                      )}>{log.riskLevel}</span>
                      <span className="text-indigo-400 w-32 shrink-0">{log.source}</span>
                      <span className="text-slate-300 flex-1">{log.event} <span className="text-slate-600">- {log.details}</span></span>
                      {log.ip && <span className="text-slate-500">{log.ip}</span>}
                      
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all ml-2" title="Analyze with AI">
                        <Sparkles className="w-4 h-4" />
                      </button>
                  </div>
              ))}
          </div>
        </div>
      </div>

      <LogAnalysisModal 
        log={selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />
    </>
  );
};

export default LiveLogs;