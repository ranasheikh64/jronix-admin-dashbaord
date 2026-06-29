import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function Careers() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    location: '',
    applyLink: '#',
    isActive: true
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get('/jobs/all'); // Using /all to get both active and inactive
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      title: formData.title,
      type: formData.type,
      location: formData.location,
      applyLink: formData.applyLink,
      isActive: formData.isActive
    };

    try {
      if (editingId) {
        await apiClient.put(`/jobs/${editingId}`, payload);
      } else {
        await apiClient.post('/jobs', payload);
      }
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job position?')) return;
    try {
      await apiClient.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleEdit = (job: any) => {
    setEditingId(job._id);
    setFormData({
      title: job.title || '',
      type: job.type || 'Full-time',
      location: job.location || '',
      applyLink: job.applyLink || '#',
      isActive: job.isActive !== undefined ? job.isActive : true
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      type: 'Full-time',
      location: '',
      applyLink: '#',
      isActive: true
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* List */}
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Open Positions</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{job.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-blue-400">{job.type}</div>
                    <div className="text-xs text-slate-500">{job.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${job.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(job)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No open positions found. Add one on the right.
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
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Position' : 'Add New Position'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Flutter Developer" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Job Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Apply Link</label>
              <input type="text" value={formData.applyLink} onChange={e => setFormData({...formData, applyLink: e.target.value})} placeholder="e.g. https://forms.google.com/..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              <p className="text-xs text-slate-500 mt-1">Leave as '#' for internal modal apply.</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-4 p-3 border border-slate-800 rounded-lg bg-slate-950/50">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded bg-slate-900 border-slate-700 text-blue-500" />
              <span className="text-sm text-slate-300">Active (Visible on Website)</span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Position
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
