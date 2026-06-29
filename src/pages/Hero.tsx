import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function Hero() {
  const [heroId, setHeroId] = useState<string | null>(null);
  const [data, setData] = useState({
    badge: 'Software Solutions',
    titles: [] as string[],
    subtitle: '',
    techStack: [] as { name: string; link: string }[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await apiClient.get('/hero');
      if (res.data) {
        setHeroId(res.data._id);
        setData({
          badge: res.data.badge || 'Software Solutions',
          titles: res.data.titles || [],
          subtitle: res.data.subtitle || '',
          techStack: res.data.techStack || []
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (heroId) {
        await apiClient.put(`/hero/${heroId}`, data);
      } else {
        await apiClient.post('/hero', data);
      }
      alert('Saved successfully!');
      fetchHero();
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTitle = () => {
    setData({ ...data, titles: [...data.titles, ''] });
  };

  const handleUpdateTitle = (index: number, value: string) => {
    const newTitles = [...data.titles];
    newTitles[index] = value;
    setData({ ...data, titles: newTitles });
  };

  const handleRemoveTitle = (index: number) => {
    const newTitles = data.titles.filter((_, i) => i !== index);
    setData({ ...data, titles: newTitles });
  };

  const handleAddTech = () => {
    setData({ ...data, techStack: [...data.techStack, { name: '', link: '#' }] });
  };

  const handleUpdateTech = (index: number, field: 'name' | 'link', value: string) => {
    const newTechStack = [...data.techStack];
    newTechStack[index] = { ...newTechStack[index], [field]: value };
    setData({ ...data, techStack: newTechStack });
  };

  const handleRemoveTech = (index: number) => {
    const newTechStack = data.techStack.filter((_, i) => i !== index);
    setData({ ...data, techStack: newTechStack });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Hero Section</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Badge Text</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle</label>
          <textarea
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-400">Typewriter Titles</label>
            <button
              onClick={handleAddTitle}
              className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={14} /> Add Title
            </button>
          </div>
          
          <div className="space-y-3">
            {data.titles.map((title, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleUpdateTitle(index, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Mobile Apps"
                />
                <button
                  onClick={() => handleRemoveTitle(index)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-400">Tech Stack Links</label>
            <button
              onClick={handleAddTech}
              className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={14} /> Add Tech
            </button>
          </div>
          
          <div className="space-y-3">
            {data.techStack.map((tech, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={tech.name}
                  onChange={(e) => handleUpdateTech(index, 'name', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Tech Name (e.g. React)"
                />
                <input
                  type="text"
                  value={tech.link}
                  onChange={(e) => handleUpdateTech(index, 'link', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Link URL"
                />
                <button
                  onClick={() => handleRemoveTech(index)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
