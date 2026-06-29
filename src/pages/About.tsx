import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aboutId, setAboutId] = useState<string | null>(null);

  const [data, setData] = useState({
    badge: 'Who We Are',
    title: '',
    subtitle: '',
    image: '',
    imageBadge: '',
    imageStats: [] as { value: string; label: string }[],
    storyTitle: '// our story',
    storyDescription: '',
    mission: '',
    features: [] as { icon: string; title: string; description: string }[]
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await apiClient.get('/about');
      if (res.data) {
        setAboutId(res.data._id);
        setData({
          badge: res.data.badge || 'Who We Are',
          title: res.data.title || '',
          subtitle: res.data.subtitle || '',
          image: res.data.image || '',
          imageBadge: res.data.imageBadge || '',
          imageStats: res.data.imageStats || [],
          storyTitle: res.data.storyTitle || '// our story',
          storyDescription: res.data.storyDescription || '',
          mission: res.data.mission || '',
          features: res.data.features || []
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
      if (aboutId) {
        await apiClient.put(`/about/${aboutId}`, data);
      } else {
        const res = await apiClient.post('/about', data);
        setAboutId(res.data._id);
      }
      alert('Saved successfully!');
    } catch (error: any) {
      console.error(error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
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
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Upload failed');
      setData({ ...data, image: resData.url });
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handlers for dynamic arrays
  const addStat = () => setData({ ...data, imageStats: [...data.imageStats, { value: '', label: '' }] });
  const updateStat = (index: number, key: 'value'|'label', val: string) => {
    const newStats = [...data.imageStats];
    newStats[index][key] = val;
    setData({ ...data, imageStats: newStats });
  };
  const removeStat = (index: number) => setData({ ...data, imageStats: data.imageStats.filter((_, i) => i !== index) });

  const addFeature = () => setData({ ...data, features: [...data.features, { icon: '', title: '', description: '' }] });
  const updateFeature = (index: number, key: 'icon'|'title'|'description', val: string) => {
    const newFeatures = [...data.features];
    newFeatures[index][key] = val;
    setData({ ...data, features: newFeatures });
  };
  const removeFeature = (index: number) => setData({ ...data, features: data.features.filter((_, i) => i !== index) });

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/80 backdrop-blur-md py-4 z-10">
        <h1 className="text-2xl font-bold">About Section Data</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition font-medium"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Header Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">Header Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Top Badge</label>
              <input type="text" value={data.badge} onChange={e => setData({...data, badge: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title (HTML allowed)</label>
              <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">Subtitle</label>
              <textarea value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none h-20" />
            </div>
          </div>
        </div>

        {/* Image & Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-purple-400 mb-4">Left Image & Floating Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Main Image</label>
              <div className="flex gap-4 items-center">
                <input type="text" value={data.image} onChange={e => setData({...data, image: e.target.value})} placeholder="Image URL" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm">
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              {data.image && <img src={data.image} alt="Preview" className="mt-4 h-32 rounded-lg object-cover border border-slate-800" />}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Image Corner Badge</label>
              <input type="text" value={data.imageBadge} onChange={e => setData({...data, imageBadge: e.target.value})} placeholder="e.g. Top Agency 2025" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none mb-4" />

              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-400">Floating Stats</label>
                <button onClick={addStat} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={14}/> Add Stat</button>
              </div>
              <div className="space-y-3">
                {data.imageStats.map((stat, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" placeholder="Value (50+)" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none" />
                    <input type="text" placeholder="Label (Projects)" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none" />
                    <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Story Text */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4">Right Side Text (Our Story & Mission)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Story Tagline</label>
              <input type="text" value={data.storyTitle} onChange={e => setData({...data, storyTitle: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Story Description</label>
              <textarea value={data.storyDescription} onChange={e => setData({...data, storyDescription: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none h-24" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Mission Text</label>
              <textarea value={data.mission} onChange={e => setData({...data, mission: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none h-20" />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-pink-400">Feature Cards (The 4 grid items)</h2>
            <button onClick={addFeature} className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition"><Plus size={16}/> Add Feature</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.features.map((feature, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-xl relative">
                <button onClick={() => removeFeature(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Icon (target, lightning, users, globe)</label>
                    <input type="text" value={feature.icon} onChange={e => updateFeature(i, 'icon', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Title</label>
                    <input type="text" value={feature.title} onChange={e => updateFeature(i, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Description</label>
                    <textarea value={feature.description} onChange={e => updateFeature(i, 'description', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-white outline-none h-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
