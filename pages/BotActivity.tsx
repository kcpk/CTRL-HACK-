
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Bot, Plus, Trash2, ShieldCheck, Zap, AlertOctagon, AlertCircle, Sparkles, Loader2, Check } from 'lucide-react';
import { BotWhitelistEntry } from '../types';
import { analyzeBotIdentifier, BotAnalysisResult } from '../services/geminiService';
import clsx from 'clsx';

const BotActivity: React.FC = () => {
  const { botWhitelist, addBotToWhitelist, removeBotFromWhitelist } = useData();
  const [newBotName, setNewBotName] = useState('');
  const [newBotIdentifier, setNewBotIdentifier] = useState('');
  const [newBotType, setNewBotType] = useState<BotWhitelistEntry['type']>('Internal');
  const [error, setError] = useState<string | null>(null);
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BotAnalysisResult | null>(null);

  const validateIdentifier = (value: string): string | null => {
    // Robust IPv4 Regex: Matches 0.0.0.0 through 255.255.255.255
    const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
    
    // Robust IPv4 CIDR Regex: Matches IPv4 + /0 through /32
    const cidrRegex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}\/(?:3[0-2]|[12]?\d)$/;
    
    // Check if input strictly mimics an IP structure (only contains digits, dots, and forward slash)
    // This distinguishes "192.168.1.1" (IP) from "Bot/1.0" (User Agent)
    const isIpStructure = /^[\d\./]+$/.test(value);

    if (isIpStructure) {
        if (!ipv4Regex.test(value) && !cidrRegex.test(value)) {
            return "Invalid format. Must be a valid IPv4 address (e.g., 192.168.1.1) or CIDR block (e.g., 10.0.0.0/24).";
        }
    } else {
        // Treat as User Agent string if it contains letters or other characters
        if (value.trim().length < 3) {
            return "User Agent string must be at least 3 characters long.";
        }
    }
    return null;
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!newBotIdentifier) return;
      
      const valError = validateIdentifier(newBotIdentifier);
      if (valError) {
          setError(valError);
          return;
      }
      setError(null);

      setIsAnalyzing(true);
      const result = await analyzeBotIdentifier(newBotIdentifier);
      setAnalysisResult(result);
      if (result.suggestedType) {
          setNewBotType(result.suggestedType);
      }
      setIsAnalyzing(false);
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newBotName || !newBotIdentifier) return;

    const validationError = validateIdentifier(newBotIdentifier);
    if (validationError) {
        setError(validationError);
        return;
    }

    const newBot: BotWhitelistEntry = {
      id: `BOT-${Date.now()}`,
      name: newBotName,
      identifier: newBotIdentifier,
      type: newBotType,
      addedBy: 'Admin User',
      addedAt: new Date().toISOString(),
    };

    addBotToWhitelist(newBot);
    setNewBotName('');
    setNewBotIdentifier('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Bot & Automation Prevention</h1>
        <p className="text-slate-400">Monitor automated traffic, block malicious actors, and manage whitelists.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Blocked Bots (24h)</p>
              <h3 className="text-2xl font-bold text-white mt-1">1,204</h3>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
             <div className="bg-rose-500 h-full w-[70%]" />
          </div>
          <p className="text-xs text-slate-500 mt-2">70% from unknown user agents</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Allowed Traffic</p>
              <h3 className="text-2xl font-bold text-white mt-1">45.2k</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
             <div className="bg-emerald-500 h-full w-[98%]" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Traffic matching whitelist</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Scrapers</p>
              <h3 className="text-2xl font-bold text-white mt-1">12</h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Bot className="w-6 h-6" />
            </div>
          </div>
           <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
             <div className="bg-amber-500 h-full w-[20%]" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Currently being rate-limited</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-indigo-500 w-5 h-5" />
                    Bot Whitelist Management
                </h2>
                <p className="text-sm text-slate-400 mt-1">Define authorized bots, crawlers, and internal scripts.</p>
            </div>
        </div>

        <form onSubmit={handleAdd} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 mb-6 relative">
            <div className="flex flex-col xl:flex-row gap-4 items-start">
                <div className="w-full xl:flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Bot Name</label>
                    <input 
                        type="text" 
                        required
                        value={newBotName}
                        onChange={e => setNewBotName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                        placeholder="e.g. Health Checker"
                    />
                </div>
                
                <div className="w-full xl:flex-[2]">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Identifier (User Agent, IP, or CIDR)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            required
                            value={newBotIdentifier}
                            onChange={e => {
                                setNewBotIdentifier(e.target.value);
                                setError(null);
                                setAnalysisResult(null);
                            }}
                            className={clsx(
                                "w-full bg-slate-900 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-colors font-mono",
                                error 
                                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" 
                                    : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
                            )}
                            placeholder="e.g. 192.168.1.5 or Mozilla/5.0..."
                        />
                        <button 
                            type="button"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !newBotIdentifier}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 px-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                            title="Analyze with AI"
                        >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="w-full xl:w-48">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select 
                        value={newBotType}
                        onChange={e => setNewBotType(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="Internal">Internal Tool</option>
                        <option value="External">External Vendor</option>
                        <option value="Partner">Partner Integration</option>
                    </select>
                </div>
                <div className="w-full xl:w-auto pt-0 xl:pt-6">
                    <button type="submit" className="w-full xl:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        Add to Whitelist
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="flex items-center gap-2 mt-3 text-rose-400 text-sm bg-rose-500/10 p-2 rounded border border-rose-500/20 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Analysis Result Card */}
            {analysisResult && (
                <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-4">
                        <div className={clsx("p-2 rounded-full", 
                            analysisResult.verdict === 'Legitimate' ? 'bg-emerald-500/10 text-emerald-400' : 
                            analysisResult.verdict === 'Malicious' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                        )}>
                            {analysisResult.verdict === 'Legitimate' ? <Check className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                AI Verdict: {analysisResult.verdict}
                                <span className={clsx("text-xs px-2 py-0.5 rounded border", 
                                    analysisResult.riskScore > 70 ? "border-rose-500/30 text-rose-400" : "border-emerald-500/30 text-emerald-400"
                                )}>Risk Score: {analysisResult.riskScore}</span>
                            </h4>
                            <p className="text-sm text-slate-400 mt-1">{analysisResult.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </form>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-950/50">
                    <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Bot Name</th>
                        <th className="px-6 py-4">Identifier</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Added By</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                    {botWhitelist.map(bot => (
                        <tr key={bot.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                                <div className="p-2 rounded bg-slate-800 text-indigo-400">
                                    <Bot className="w-4 h-4" />
                                </div>
                                {bot.name}
                            </td>
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs break-all max-w-[200px]">{bot.identifier}</td>
                            <td className="px-6 py-4">
                                <span className={clsx(
                                    "px-2 py-1 rounded text-xs font-medium border",
                                    bot.type === 'Internal' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                    bot.type === 'External' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                )}>
                                    {bot.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm">
                                <div>{bot.addedBy}</div>
                                <div className="text-xs text-slate-600">{new Date(bot.addedAt).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => removeBotFromWhitelist(bot.id)}
                                    className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                                    title="Revoke Access"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {botWhitelist.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No bots whitelisted.</p>
                                <p className="text-xs">All non-human traffic will be challenged or blocked.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default BotActivity;
