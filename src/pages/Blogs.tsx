import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    authorName: '',
    authorImage: '',
    readTime: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await apiClient.get('/blogs');
      setBlogs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'authorImage') => {
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
      
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      setFormData({ ...formData, [field]: data.url });
    } catch (error: any) {
      console.error('Upload failed fully:', error);
      alert('Image upload failed: ' + (error.message || 'Unknown error'));
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
      authorName: formData.authorName,
      authorImage: formData.authorImage,
      readTime: formData.readTime
    };

    try {
      if (editingId) {
        await apiClient.put(`/blogs/${editingId}`, payload);
      } else {
        await apiClient.post('/blogs', payload);
      }
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiClient.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || '',
      category: blog.category || '',
      description: blog.description || '',
      image: blog.image || '',
      authorName: blog.authorName || '',
      authorImage: blog.authorImage || '',
      readTime: blog.readTime || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '', category: '', description: '', image: '', authorName: '', authorImage: '', readTime: ''
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* List */}
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Blogs</h1>
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
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <img src={blog.image} alt={blog.title} className="w-16 h-12 object-cover rounded-lg border border-slate-700" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{blog.title}</div>
                    <div className="text-xs text-blue-400">{blog.category}</div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
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
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
          
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
                <label className="block text-sm font-medium text-slate-400 mb-1">Read Time</label>
                <input type="text" value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} placeholder="e.g. 5 min read" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 h-24" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Blog Image</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 bg-slate-950 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                  <ImageIcon size={18} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" disabled={uploading} />
                </label>
                {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded object-cover border border-slate-800" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Author Name</label>
                <input type="text" required value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Author Image</label>
                <label className="flex items-center justify-center gap-2 border border-dashed border-slate-700 bg-slate-950 rounded-lg p-2 cursor-pointer hover:border-blue-500 transition">
                  <ImageIcon size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Upload</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'authorImage')} className="hidden" disabled={uploading} />
                </label>
                {formData.authorImage && <div className="mt-2 text-xs text-blue-400">Image selected</div>}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Blog
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
