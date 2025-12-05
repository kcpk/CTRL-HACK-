import React, { useEffect, useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, Brain, Activity, Play } from 'lucide-react';
import { LogEntry } from '../types';
import { analyzeLogEntry, AnalysisResult } from '../services/geminiService';
import { useData } from '../contexts/DataContext';
import clsx from 'clsx';

interface LogAnalysisModalProps {
  log: LogEntry | null;
  onClose: () => void;
}

const LogAnalysisModal: React.FC<LogAnalysisModalProps> = ({ log, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionExecuted, setActionExecuted] = useState(false);
  const { employees, updateEmployeeStatus, blockIp, addAiAction } = useData();

  useEffect(() => {
    if (log) {
      setLoading(true);
      setActionExecuted(false);
      analyzeLogEntry(log).then(result => {
        setAnalysis(result);
        setLoading(false);
      });
    } else {
        setAnalysis(null);
    }
  }, [log]);

  const handleRemediation = () => {
    if (!analysis || !log) return;

    let actionDescription = analysis.recommendedAction;
    let success = false;

    if (analysis.actionType === 'SUSPEND_USER' && log.user) {
        const employee = employees.find(e => e.name === log.user);
        if (employee) {
            updateEmployeeStatus(employee.id, 'Suspended');
            actionDescription = `Suspended user account: ${employee.name}`;
            success = true;
        } else {
             actionDescription = `Could not find user ${log.user} to suspend.`;
        }
    } else if (analysis.actionType === 'BLOCK_IP' && log.ip) {
        blockIp(log.ip);
        actionDescription = `Blocked IP Address: ${log.ip}`;
        success = true;
    } else if (analysis.actionType === 'NONE') {
        actionDescription = "No automated action required.";
        success = true;
    }

    if (success) {
        addAiAction({
            id: `ACT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            triggerEvent: log.event,
            analysis: analysis.riskAssessment,
            actionTaken: actionDescription,
            status: 'Completed'
        });
        setActionExecuted(true);
    }
  };

  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Log Investigation</h2>
              <p className="text-sm text-slate-400">Analysis ID: {log.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Log Context */}
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-sm">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>{log.timestamp}</span>
                <span>{log.source}</span>
            </div>
            <p className="text-slate-200 font-semibold">{log.event}</p>
            <p className="text-slate-400 mt-1">{log.details}</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
               <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
               <p className="text-sm text-slate-400 animate-pulse">Consulting Neural Engine...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Risk Assessment */}
                <div className={clsx(
                    "p-4 rounded-xl border flex gap-4",
                    analysis.isThreat 
                        ? "bg-rose-500/10 border-rose-500/20" 
                        : "bg-emerald-500/10 border-emerald-500/20"
                )}>
                    {analysis.isThreat ? (
                        <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                    ) : (
                        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    )}
                    <div>
                        <h3 className={clsx("font-bold", analysis.isThreat ? "text-rose-400" : "text-emerald-400")}>
                            {analysis.isThreat ? "Security Threat Detected" : "Low Risk Activity"}
                        </h3>
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{analysis.riskAssessment}</p>
                    </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
                    <span className="text-sm text-slate-400">AI Confidence Score</span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ width: `${analysis.confidenceScore}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-white">{analysis.confidenceScore}%</span>
                    </div>
                </div>

                {/* Recommendation */}
                <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Recommended Action</h4>
                    <div className="flex items-start gap-3 p-4 bg-slate-800 rounded-lg">
                        <Shield className="w-5 h-5 text-indigo-400 mt-0.5" />
                        <div className="flex-1">
                             <p className="text-sm text-white font-medium">{analysis.recommendedAction}</p>
                             {analysis.actionType !== 'NONE' && (
                                 <span className="text-xs text-indigo-400 font-mono mt-1 block">
                                     ACTION_TYPE: {analysis.actionType}
                                 </span>
                             )}
                        </div>
                    </div>
                </div>

                {actionExecuted && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-sm font-medium animate-in fade-in zoom-in">
                        <CheckCircle className="w-4 h-4" />
                        Remediation executed successfully.
                    </div>
                )}

            </div>
          ) : (
            <p className="text-center text-rose-400">Analysis Failed.</p>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Close
            </button>
            {!loading && analysis?.isThreat && !actionExecuted && (
                <button 
                    onClick={handleRemediation}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2"
                >
                    <Play className="w-4 h-4" />
                    Execute Remediation
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default LogAnalysisModal;