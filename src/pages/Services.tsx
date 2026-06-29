import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    tags: '',
    highlightIcon: '',
    highlightText: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await apiClient.get('/services');
      setServices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      if (editingId) {
        await apiClient.put(`/services/${editingId}`, payload);
      } else {
        await apiClient.post('/services', payload);
      }
      resetForm();
      fetchServices();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiClient.delete(`/services/${id}`);
      fetchServices();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || '',
      tags: item.tags ? item.tags.join(', ') : '',
      highlightIcon: item.highlightIcon || '',
      highlightText: item.highlightText || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon: '', tags: '', highlightIcon: '', highlightText: '' });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Services</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {services.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-medium text-slate-200">{item.title}</td>
                  <td className="px-6 py-4">{item.tags?.join(', ') || '-'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Main Icon</label>
                <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="e.g. Server" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Highlight Icon</label>
                <input type="text" value={formData.highlightIcon} onChange={e => setFormData({...formData, highlightIcon: e.target.value})} placeholder="e.g. Zap" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags (Comma separated)</label>
              <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="App Store, Play Store" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Highlight Text</label>
              <input type="text" value={formData.highlightText} onChange={e => setFormData({...formData, highlightText: e.target.value})} placeholder="e.g. 100% Approval Rate" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 h-24" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Service
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
