import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { analyzeLogEntry } from '../services/geminiService';
import { Brain, Cpu, Play, Terminal, Shield } from 'lucide-react';
import { AiObservation, LogEntry, RiskLevel } from '../types';
import clsx from 'clsx';

const AiAgents: React.FC = () => {
  const { logs, addLog, addAiAction } = useData();
  const [observations, setObservations] = useState<AiObservation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['> AegisLoop Neural Core Initialized...']);
  const endRef = useRef<HTMLDivElement>(null);

  const logToConsole = (text: string) => {
    setConsoleOutput(prev => [...prev.slice(-20), `> ${text}`]);
  };

  const processRandomLog = async () => {
    if (logs.length === 0) return;
    setIsProcessing(true);
    
    // Pick a random log to analyze
    const log = logs[Math.floor(Math.random() * logs.length)];
    
    logToConsole(`Observing event: ${log.event} (${log.id})`);
    
    const analysis = await analyzeLogEntry(log);
    
    logToConsole(`Analysis Complete. Risk: ${analysis.riskAssessment}`);
    
    if (analysis.isThreat || analysis.confidenceScore > 80) {
        logToConsole(`ACTION TRIGGERED: ${analysis.recommendedAction}`);
        addAiAction({
            id: `ACT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            triggerEvent: log.event,
            analysis: analysis.riskAssessment,
            actionTaken: analysis.recommendedAction,
            status: 'Completed'
        });
    }

    const obs: AiObservation = {
        id: Date.now().toString(),
        logId: log.id,
        thoughtProcess: `Analyzed ${log.source} event. Confidence: ${analysis.confidenceScore}%.`,
        decision: analysis.isThreat ? "INTERVENTION REQUIRED" : "SAFE",
        remediation: analysis.recommendedAction
    };

    setObservations(prev => [obs, ...prev]);
    setIsProcessing(false);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Visualizer Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="text-indigo-500" />
                Neural Engine Status
            </h2>
            <button 
                onClick={processRandomLog}
                disabled={isProcessing}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                    isProcessing ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                )}
            >
                <Play className="w-4 h-4" />
                {isProcessing ? 'Thinking...' : 'Trigger Analysis Cycle'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-center">
                <p className="text-xs text-slate-500 mb-1">Active Agents</p>
                <p className="text-2xl font-bold text-emerald-400">12</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-center">
                <p className="text-xs text-slate-500 mb-1">Decisions / Min</p>
                <p className="text-2xl font-bold text-indigo-400">845</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-center">
                <p className="text-xs text-slate-500 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-white">99.9%</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-sm text-green-400 flex-1 overflow-y-auto custom-scrollbar">
            {consoleOutput.map((line, i) => (
                <div key={i} className="mb-1 opacity-90">{line}</div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>

      {/* Decision History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Decision Log
        </h3>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {observations.map((obs) => (
                <div key={obs.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-slate-500">Log ID: {obs.logId}</span>
                        <span className={clsx(
                            "text-xs px-2 py-0.5 rounded uppercase font-bold",
                            obs.decision === "SAFE" ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                        )}>{obs.decision}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{obs.thoughtProcess}</p>
                    {obs.remediation && (
                        <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 p-2 rounded">
                            <Shield className="w-3 h-3" />
                            Action: {obs.remediation}
                        </div>
                    )}
                </div>
            ))}
            {observations.length === 0 && (
                <div className="text-center text-slate-500 mt-10">
                    <p>No active decisions recorded yet.</p>
                    <p className="text-xs">Trigger the analysis cycle to start.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiAgents;