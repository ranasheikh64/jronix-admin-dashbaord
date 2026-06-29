import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    link: '#',
    githubLink: '#',
    techStack: '',
    typeBadge: '',
    isFeatured: false,
    statsUsers: '',
    statsRating: '',
    statsYear: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get('/projects');
      setProjects(res.data);
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
      // Use raw fetch or a separate axios call to avoid the global JSON content-type interfering with the multipart boundary
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      console.log('Upload success:', data);
      setFormData({ ...formData, image: data.url });
    } catch (error: any) {
      console.error('Upload failed fully:', error);
      const errorMessage = error.message || 'Unknown error';
      console.error('Error message:', errorMessage);
      alert('Image upload failed: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      link: formData.link,
      githubLink: formData.githubLink,
      typeBadge: formData.typeBadge,
      isFeatured: formData.isFeatured,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      stats: {
        users: formData.statsUsers,
        rating: formData.statsRating,
        year: formData.statsYear
      }
    };

    try {
      if (editingId) {
        await apiClient.put(`/projects/${editingId}`, payload);
      } else {
        await apiClient.post('/projects', payload);
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await apiClient.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      category: project.category || '',
      description: project.description || '',
      image: project.image || '',
      link: project.link || '#',
      githubLink: project.githubLink || '#',
      typeBadge: project.typeBadge || '',
      isFeatured: project.isFeatured || false,
      techStack: project.techStack?.join(', ') || '',
      statsUsers: project.stats?.users || '',
      statsRating: project.stats?.rating || '',
      statsYear: project.stats?.year || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '', category: '', description: '', image: '', link: '#', githubLink: '#',
      techStack: '', typeBadge: '', isFeatured: false,
      statsUsers: '', statsRating: '', statsYear: ''
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* List */}
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title & Category</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((proj) => (
                <tr key={proj._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <img src={proj.image} alt={proj.title} className="w-16 h-12 object-cover rounded-lg border border-slate-700" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{proj.title}</div>
                    <div className="text-xs text-blue-400">{proj.category}</div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(proj)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(proj._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Badge</label>
                <input type="text" value={formData.typeBadge} onChange={e => setFormData({...formData, typeBadge: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 h-20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Image Upload</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 bg-slate-950 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                  <ImageIcon size={18} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{uploading ? 'Uploading...' : 'Click to Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded object-cover border border-slate-800" />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tech Stack (comma separated)</label>
              <input type="text" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="React, Node, MongoDB" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Live Link</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">GitHub Link</label>
                <input type="text" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Users Stat</label>
                <input type="text" value={formData.statsUsers} onChange={e => setFormData({...formData, statsUsers: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Rating Stat</label>
                <input type="text" value={formData.statsRating} onChange={e => setFormData({...formData, statsRating: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Year Stat</label>
                <input type="text" value={formData.statsYear} onChange={e => setFormData({...formData, statsYear: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="rounded bg-slate-900 border-slate-700 text-blue-500" />
              <span className="text-sm text-slate-300">Featured Project</span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Project
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
