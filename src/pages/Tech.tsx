import { useState, useEffect } from 'react';
import { Save, Code2 } from 'lucide-react';
import apiClient from '../api/client';

export default function Tech() {
  const [loading, setLoading] = useState(true);
  const [techId, setTechId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    badge: '// technologies we master',
    title: 'Our Tech Arsenal',
    technologies: ''
  });

  useEffect(() => {
    fetchTech();
  }, []);

  const fetchTech = async () => {
    try {
      const res = await apiClient.get('/tech');
      if (res.data) {
        setTechId(res.data._id);
        setFormData({
          badge: res.data.badge || '// technologies we master',
          title: res.data.title || 'Our Tech Arsenal',
          technologies: res.data.technologies?.join(', ') || ''
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      badge: formData.badge,
      title: formData.title,
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (techId) {
        await apiClient.put(`/tech/${techId}`, payload);
      } else {
        await apiClient.post('/tech', payload);
      }
      alert('Saved successfully');
      fetchTech();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Code2 className="text-blue-500" /> Manage Tech Arsenal
      </h1>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Section Badge / Subtitle</label>
            <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="// technologies we master" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Section Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Our Tech Arsenal" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Technologies (comma separated)</label>
            <textarea value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 h-32 leading-relaxed" placeholder="React, Node.js, Next.js, Flutter..." />
            <p className="text-xs text-slate-500 mt-2">Enter technologies separated by commas.</p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition font-medium flex items-center gap-2">
              <Save size={18} /> Save Tech Stack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
