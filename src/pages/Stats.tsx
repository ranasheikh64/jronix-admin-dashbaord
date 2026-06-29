import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function Stats() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    icon: 'check-circle',
    value: '',
    label: ''
  });

  const availableIcons = [
    { value: 'check-circle', label: 'Check Circle' },
    { value: 'users', label: 'Users' },
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'calendar', label: 'Calendar' }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/stats');
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      icon: formData.icon,
      value: formData.value,
      label: formData.label
    };

    try {
      if (editingId) {
        await apiClient.put(`/stats/${editingId}`, payload);
      } else {
        await apiClient.post('/stats', payload);
      }
      resetForm();
      fetchStats();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    try {
      await apiClient.delete(`/stats/${id}`);
      fetchStats();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleEdit = (stat: any) => {
    setEditingId(stat._id);
    setFormData({
      icon: stat.icon || 'check-circle',
      value: stat.value || '',
      label: stat.label || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      icon: 'check-circle',
      value: '',
      label: ''
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* List */}
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Stats</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">Icon Type</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats.map((stat) => (
                <tr key={stat._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-bold text-lg text-white">
                    {stat.value}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{stat.label}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-blue-400">
                    {stat.icon}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(stat)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(stat._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No stats found. Add one on the right.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Stat' : 'Add New Stat'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Stat Value</label>
              <input type="text" required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="e.g. 50+" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 font-bold" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Label</label>
              <input type="text" required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="e.g. Projects Completed" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Icon</label>
              <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500">
                {availableIcons.map(icon => (
                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Stat
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
