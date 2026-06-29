import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';

export default function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image: '',
    skills: '',
    github: '',
    linkedin: '',
    twitter: ''
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await apiClient.get('/team');
      setTeam(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setFormData({ ...formData, image: data.url });
    } catch (error: any) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      role: formData.role,
      description: formData.description,
      image: formData.image,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      socialLinks: {
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter
      }
    };

    try {
      if (editingId) {
        await apiClient.put(`/team/${editingId}`, payload);
      } else {
        await apiClient.post('/team', payload);
      }
      resetForm();
      fetchTeam();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await apiClient.delete(`/team/${id}`);
      fetchTeam();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      description: member.description || '',
      image: member.image || '',
      skills: member.skills?.join(', ') || '',
      github: member.socialLinks?.github || '',
      linkedin: member.socialLinks?.linkedin || '',
      twitter: member.socialLinks?.twitter || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', role: '', description: '', image: '',
      skills: '', github: '', linkedin: '', twitter: ''
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Team</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name & Role</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {team.map((member) => (
                <tr key={member._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <img src={member.image} alt={member.name} className="w-12 h-12 object-cover rounded-full border border-slate-700" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{member.name}</div>
                    <div className="text-xs text-blue-400">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(member)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition">
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
          <h2 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Plus size={18} className="text-blue-500" /> {editingId ? 'Edit Team Member' : 'Add New Member'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description / Bio</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 h-20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Photo Upload</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 bg-slate-950 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                  <ImageIcon size={18} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{uploading ? 'Uploading...' : 'Click to Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded object-cover border border-slate-800" />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Skills (comma separated)</label>
              <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Flutter, React, Strategy" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Social Links</label>
              <div className="space-y-2">
                <input type="text" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none text-sm placeholder:text-slate-600" placeholder="GitHub URL" />
                <input type="text" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none text-sm placeholder:text-slate-600" placeholder="LinkedIn URL" />
                <input type="text" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none text-sm placeholder:text-slate-600" placeholder="Twitter URL" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Member
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
