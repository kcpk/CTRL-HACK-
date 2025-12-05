
import React, { useState } from 'react';
import { X, UserPlus, Shield, Laptop } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface AddEmployeeModalProps {
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose }) => {
  const { addEmployee } = useData();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    systemName: '',
    systemIp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would create a full system object here.
    // The DataContext logic creates the Employee object.
    // For this mock, we are passing the basic data needed.
    
    addEmployee({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      riskScore: 0, 
      status: 'Active',
      authorizedApps: [],
      systems: formData.systemIp ? [{
          id: `SYS-${Date.now()}`,
          name: formData.systemName || 'Workstation',
          ip: formData.systemIp,
          macAddress: '00:00:00:00:00:00',
          os: 'Windows 11',
          status: 'Online',
          lastActive: new Date().toISOString(),
          cpuUsage: 12,
          memoryUsage: 34,
          networkStats: {
              uploadSpeed: 0,
              downloadSpeed: 0,
              activeConnections: 0,
              totalBandwidthToday: '0 GB'
          }
      }] : [],
      authorizedRepos: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Onboard New Employee</h2>
              <p className="text-sm text-slate-400">Define role and register primary device.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
            
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. Jane Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Role / Title</label>
                    <input
                        type="text"
                        required
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. Security Analyst"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                    <select
                        required
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Product">Product</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Security">Security</option>
                        <option value="HR">HR</option>
                        <option value="External">External / Contractor</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-slate-800 my-4" />

            {/* Device Registration */}
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Laptop className="w-4 h-4 text-emerald-400" />
                Primary Device Registration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">System Name / Hostname</label>
                    <input
                        type="text"
                        value={formData.systemName}
                        onChange={e => setFormData({...formData, systemName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. Jane-MacBook-Pro"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Assigned IP Address</label>
                    <input
                        type="text"
                        value={formData.systemIp}
                        onChange={e => setFormData({...formData, systemIp: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        placeholder="e.g. 192.168.1.50"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
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
                    <UserPlus className="w-4 h-4" />
                    Create Profile
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
