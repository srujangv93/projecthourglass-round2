'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';

export default function AdminPage() {
  const [settings, setSettings] = useState({ googleFormUrl: '', teamIdFieldId: '', answerFieldId: '', targetWord: '' });
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/settings').then(res => res.json()),
      fetch('/api/admin/puzzles').then(res => res.json())
    ]).then(([settingsData, puzzlesData]) => {
      setSettings(settingsData);
      setPuzzles(puzzlesData || []);
      setLoading(false);
    });
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    alert('Settings saved successfully');
  };

  const savePuzzles = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/puzzles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzles }),
    });
    alert('Puzzles saved successfully');
  };

  const handleClearAnalytics = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to clear ALL team analytics? This cannot be undone.')) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/teams/clear', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('All analytics cleared successfully.');
    } else {
      alert('Failed to clear analytics.');
    }
  };

  const handlePuzzleChange = (index: number, field: string, value: string) => {
    const updated = [...puzzles];
    if (field === 'acceptedAnswers') {
      updated[index][field] = value.split(',').map(s => s.trim());
    } else {
      updated[index][field] = value;
    }
    setPuzzles(updated);
  };

  if (loading) return <div className="p-10 font-mono text-primary animate-pulse">Initializing Admin Connection...</div>;

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-6xl mx-auto font-mono text-green-400">
      <h1 className="text-3xl font-black italic uppercase tracking-widest text-center text-primary glow-text mb-8">
        System Control Console
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-1">
          <Terminal title="SYSTEM_CONFIG">
            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-primary/60 mb-1">Google Form URL</label>
                <input 
                  className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                  value={settings.googleFormUrl} 
                  onChange={e => setSettings({...settings, googleFormUrl: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-primary/60 mb-1">Team ID Field Entry ID</label>
                <input 
                  className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                  value={settings.teamIdFieldId} 
                  onChange={e => setSettings({...settings, teamIdFieldId: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-primary/60 mb-1">Answer Field Entry ID</label>
                <input 
                  className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                  value={settings.answerFieldId} 
                  onChange={e => setSettings({...settings, answerFieldId: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-primary/60 mb-1">Target Override Word (9 letters)</label>
                <input 
                  className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none uppercase font-bold" 
                  value={settings.targetWord || ''} 
                  onChange={e => setSettings({...settings, targetWord: e.target.value})} 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary/10 border border-primary text-primary font-bold uppercase tracking-widest text-xs p-3 hover:bg-primary hover:text-black transition-all"
              >
                Save Settings
              </button>
              
              <div className="mt-8 pt-6 border-t border-primary/20">
                <button 
                  type="button"
                  onClick={handleClearAnalytics}
                  className="w-full bg-red-900/20 border border-red-500 text-red-500 font-bold uppercase tracking-widest text-xs p-3 hover:bg-red-500 hover:text-black transition-all"
                >
                  Clear All Analytics
                </button>
              </div>
            </form>
          </Terminal>
        </div>

        {/* Right Column: Audio Puzzles List */}
        <div className="lg:col-span-2">
          <Terminal title="AUDIO_NODES_CONFIG">
            <form onSubmit={savePuzzles} className="space-y-6">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {puzzles.map((p, index) => (
                  <div key={p._id} className="p-4 border border-primary/10 bg-primary/5 rounded space-y-3">
                    <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                      <span className="text-xs font-bold text-primary">{p._id.toUpperCase()}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary/60">Reward Letter:</span>
                        <input 
                          type="text" 
                          maxLength={1} 
                          className="w-8 bg-black border border-primary/20 text-center text-xs font-bold text-primary focus:border-primary outline-none uppercase" 
                          value={p.rewardLetter || ''} 
                          onChange={e => handlePuzzleChange(index, 'rewardLetter', e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase text-primary/40 mb-1">Display Name</label>
                        <input 
                          type="text" 
                          className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                          value={p.name || ''} 
                          onChange={e => handlePuzzleChange(index, 'name', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase text-primary/40 mb-1">Accepted Answers (comma separated)</label>
                        <input 
                          type="text" 
                          className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                          value={p.acceptedAnswers ? p.acceptedAnswers.join(', ') : ''} 
                          onChange={e => handlePuzzleChange(index, 'acceptedAnswers', e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase text-primary/40 mb-1">Audio URL Path</label>
                        <input 
                          type="text" 
                          className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                          value={p.audioUrl || ''} 
                          onChange={e => handlePuzzleChange(index, 'audioUrl', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase text-primary/40 mb-1">Intel Hint</label>
                        <input 
                          type="text" 
                          className="w-full bg-black border border-primary/20 p-2 text-xs text-primary focus:border-primary outline-none" 
                          value={p.hint1 || ''} 
                          onChange={e => handlePuzzleChange(index, 'hint1', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary/10 border border-primary text-primary font-bold uppercase tracking-widest text-xs p-3 hover:bg-primary hover:text-black transition-all"
              >
                Save Puzzles Configuration
              </button>
            </form>
          </Terminal>
        </div>
      </div>
    </div>
  );
}
