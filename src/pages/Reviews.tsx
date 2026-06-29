import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Star } from 'lucide-react';
import apiClient from '../api/client';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: '',
    clientName: '',
    clientRole: '',
    clientImage: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/reviews');
      setReviews(res.data);
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
      setFormData({ ...formData, clientImage: data.url });
    } catch (error: any) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      rating: Number(formData.rating),
      reviewText: formData.reviewText,
      clientName: formData.clientName,
      clientRole: formData.clientRole,
      clientImage: formData.clientImage
    };

    try {
      if (editingId) {
        await apiClient.put(`/reviews/${editingId}`, payload);
      } else {
        await apiClient.post('/reviews', payload);
      }
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await apiClient.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleEdit = (review: any) => {
    setEditingId(review._id);
    setFormData({
      rating: review.rating || 5,
      reviewText: review.reviewText || '',
      clientName: review.clientName || '',
      clientRole: review.clientRole || '',
      clientImage: review.clientImage || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      rating: 5, reviewText: '', clientName: '', clientRole: '', clientImage: ''
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {review.clientImage ? (
                      <img src={review.clientImage} alt={review.clientName} className="w-10 h-10 object-cover rounded-full border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                        N/A
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-slate-200">{review.clientName}</div>
                      <div className="text-xs text-blue-400 truncate w-32">{review.clientRole}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-2 w-48 text-xs">{review.reviewText}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" /> {review.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(review)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(review._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition">
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
            <Plus size={18} className="text-blue-500" /> {editingId ? 'Edit Review' : 'Add New Review'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Client Name</label>
              <input type="text" required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Client Role / Company</label>
              <input type="text" required value={formData.clientRole} onChange={e => setFormData({...formData, clientRole: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. CTO, Tech Corp" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Rating (1-5)</label>
              <input type="number" min="1" max="5" required value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Review Text</label>
              <textarea required value={formData.reviewText} onChange={e => setFormData({...formData, reviewText: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 h-28" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Client Photo Upload</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 bg-slate-950 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                  <ImageIcon size={18} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{uploading ? 'Uploading...' : 'Click to Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {formData.clientImage && <img src={formData.clientImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-slate-800" />}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> {editingId ? 'Update' : 'Add'} Review
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
