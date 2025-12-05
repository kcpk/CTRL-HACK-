
import React, { useState } from 'react';
import { X, User, Shield, Bell, Save, Key, Mail, Smartphone, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

interface AccountSettingsModalProps {
  onClose: () => void;
}

type Tab = 'general' | 'security' | 'notifications';

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Mock Settings State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    twoFactor: true,
    emailAlerts: true,
    pushNotifications: false,
    marketingEmails: false
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const TabButton = ({ id, icon: Icon, label }: { id: Tab; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={clsx(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
        activeTab === id 
          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
          : "text-slate-400 hover:text-white hover:bg-slate-800"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="text-indigo-500 w-6 h-6" />
            Account Settings
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-2 bg-slate-900/50">
                <TabButton id="general" icon={User} label="Profile & General" />
                <TabButton id="security" icon={Shield} label="Security & Access" />
                <TabButton id="notifications" icon={Bell} label="Notifications" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <img 
                                src={user?.avatar || "https://picsum.photos/200"} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-full border-2 border-slate-700"
                            />
                            <div>
                                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Change Avatar</button>
                                <p className="text-xs text-slate-500 mt-1">Max file size 5MB</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-slate-600 mt-1">Contact admin to change email.</p>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Role</label>
                                <input 
                                    type="text" 
                                    value={user?.role}
                                    disabled
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                         <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-4">
                            <Shield className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-white">Strong Security Active</h3>
                                <p className="text-sm text-slate-400 mt-1">Your account is protected with enterprise-grade encryption. Last password change: 30 days ago.</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-6">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Key className="w-4 h-4 text-emerald-400" /> Password
                            </h3>
                            <button className="text-sm border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-lg transition-colors">
                                Change Password
                            </button>
                        </div>

                         <div className="border-t border-slate-800 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-emerald-400" /> 
                                    Two-Factor Authentication (2FA)
                                </h3>
                                <div 
                                    onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                                    className={clsx("w-12 h-6 rounded-full p-1 cursor-pointer transition-colors", formData.twoFactor ? "bg-emerald-600" : "bg-slate-700")}
                                >
                                    <div className={clsx("w-4 h-4 bg-white rounded-full transition-transform", formData.twoFactor ? "translate-x-6" : "translate-x-0")} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">Secure your account by requiring an extra verification step during login.</p>
                            {formData.twoFactor && (
                                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded max-w-fit">
                                    <CheckCircle className="w-3 h-3" />
                                    Active via Authenticator App
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <div>
                                    <p className="text-sm font-bold text-white">Security Alerts</p>
                                    <p className="text-xs text-slate-500">Receive emails about suspicious login attempts.</p>
                                </div>
                                <div 
                                    onClick={() => setFormData({...formData, emailAlerts: !formData.emailAlerts})}
                                    className={clsx("w-11 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0", formData.emailAlerts ? "bg-indigo-600" : "bg-slate-700")}
                                >
                                    <div className={clsx("w-4 h-4 bg-white rounded-full transition-transform", formData.emailAlerts ? "translate-x-5" : "translate-x-0")} />
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <div>
                                    <p className="text-sm font-bold text-white">Daily Digest</p>
                                    <p className="text-xs text-slate-500">Summary of system health and risks at 9:00 AM.</p>
                                </div>
                                <div 
                                    onClick={() => setFormData({...formData, marketingEmails: !formData.marketingEmails})}
                                    className={clsx("w-11 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0", formData.marketingEmails ? "bg-indigo-600" : "bg-slate-700")}
                                >
                                    <div className={clsx("w-4 h-4 bg-white rounded-full transition-transform", formData.marketingEmails ? "translate-x-5" : "translate-x-0")} />
                                </div>
                            </div>

                             <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <div>
                                    <p className="text-sm font-bold text-white">Browser Push Notifications</p>
                                    <p className="text-xs text-slate-500">Get real-time alerts on your desktop.</p>
                                </div>
                                <div 
                                    onClick={() => setFormData({...formData, pushNotifications: !formData.pushNotifications})}
                                    className={clsx("w-11 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0", formData.pushNotifications ? "bg-indigo-600" : "bg-slate-700")}
                                >
                                    <div className={clsx("w-4 h-4 bg-white rounded-full transition-transform", formData.pushNotifications ? "translate-x-5" : "translate-x-0")} />
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Cancel
            </button>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? (
                    'Saving...'
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Save Changes
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AccountSettingsModal;
