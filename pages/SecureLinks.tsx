
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ExternalLink, GitBranch, Lock, Eye, Plus, Shield } from 'lucide-react';
import clsx from 'clsx';
import AddLinkModal from '../components/AddLinkModal';
import LinkDetailModal from '../components/LinkDetailModal';
import { SecureLink } from '../types';

const SecureLinks: React.FC = () => {
  const { links } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SecureLink | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Secure Links & Repositories</h1>
            <p className="text-slate-400">Track and audit access to sensitive internal resources.</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
            <Plus className="w-4 h-4" />
            Add Resource
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resource Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Access Stats</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {links.map((link) => (
                <tr 
                    key={link.id} 
                    onClick={() => setSelectedLink(link)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                        {link.type === 'Repository' ? <GitBranch className="w-4 h-4" /> : link.type === 'Internal Tool' ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{link.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{link.url}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{link.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-300">{link.accessCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                        <p className="text-sm text-slate-300">{link.lastAccessedBy}</p>
                        <p className="text-xs text-slate-500">{new Date(link.lastAccessedAt).toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        link.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        link.status === 'Locked' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {link.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 hover:bg-indigo-500/10 rounded">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <Lock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No secure links or repos being monitored.</p>
                        <p className="text-xs">Add a resource to start tracking access.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddLinkModal onClose={() => setShowAddModal(false)} />}
      
      {selectedLink && (
          <LinkDetailModal 
            link={selectedLink} 
            onClose={() => setSelectedLink(null)} 
          />
      )}
    </div>
  );
};

export default SecureLinks;
