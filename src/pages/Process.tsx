import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function Process() {
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    stepNumber: 1,
    title: '',
    description: '',
    icon: 'Settings'
  });

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const res = await apiClient.get('/processes');
      setProcesses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      stepNumber: Number(formData.stepNumber),
      title: formData.title,
      description: formData.description,
      icon: formData.icon
    };

    try {
      if (editingId) {
        await apiClient.put(`/processes/${editingId}`, payload);
      } else {
        await apiClient.post('/processes', payload);
      }
      resetForm();
      fetchProcesses();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this process step?')) return;
    try {
      await apiClient.delete(`/processes/${id}`);
      fetchProcesses();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleEdit = (process: any) => {
    setEditingId(process._id);
    setFormData({
      stepNumber: process.stepNumber,
      title: process.title || '',
      description: process.description || '',
      icon: process.icon || 'Settings'
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      stepNumber: processes.length > 0 ? Math.max(...processes.map(p => p.stepNumber)) + 1 : 1,
      title: '',
      description: '',
      icon: 'Settings'
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* List */}
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Work Process Steps</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Step</th>
                <th className="px-6 py-4">Title & Description</th>
                <th className="px-6 py-4">Icon Name</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {processes.map((process) => (
                <tr key={process._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 text-white font-bold">{process.stepNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{process.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{process.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs bg-slate-800 px-2 py-1 rounded inline-block text-blue-400">{process.icon}</div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(process)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(process._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {processes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No process steps found. Add one on the right.
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
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Step' : 'Add New Step'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Step Number</label>
              <input type="number" required value={formData.stepNumber} onChange={e => setFormData({...formData, stepNumber: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Discover Planning" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe this step..." rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Icon Name (lucide-react)</label>
              <input type="text" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="e.g. Network, Cpu, Settings" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              <p className="text-xs text-slate-500 mt-1">Check lucide.dev for valid icon names with Capitalized Initials.</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Step
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
