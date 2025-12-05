import React, { useState } from 'react';
import { X, Link as LinkIcon, Shield, Globe, Lock, GitBranch } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { SecureLink } from '../types';

interface AddLinkModalProps {
  onClose: () => void;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ onClose }) => {
  const { addLink } = useData();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'Repository' as SecureLink['type']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLink(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Protect New Resource</h2>
              <p className="text-sm text-slate-400">Register a repository or tool for monitoring.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Resource Name</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Core Payment Service"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL / Connection String</label>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        required
                        value={formData.url}
                        onChange={e => setFormData({...formData, url: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                        placeholder="e.g. https://github.com/org/repo"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Resource Type</label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'Repository'})}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${formData.type === 'Repository' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                        <GitBranch className="w-5 h-5" />
                        <span className="text-xs font-medium">Repository</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'Internal Tool'})}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${formData.type === 'Internal Tool' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                        <Shield className="w-5 h-5" />
                        <span className="text-xs font-medium">Internal Tool</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'Sensitive Doc'})}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${formData.type === 'Sensitive Doc' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                        <Lock className="w-5 h-5" />
                        <span className="text-xs font-medium">Sensitive Doc</span>
                    </button>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                    <Shield className="w-4 h-4" />
                    Register Resource
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;