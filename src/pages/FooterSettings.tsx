import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import apiClient from '../api/client';

export default function FooterSettings() {
  const [footerId, setFooterId] = useState<string | null>(null);
  const [data, setData] = useState({
    description: '',
    socialLinks: [] as { platform: string; url: string }[],
    quickLinks: [] as { name: string; url: string }[],
    bottomLinks: [] as { name: string; url: string }[],
    copyrightText: '© 2025 Jronix. All rights reserved.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await apiClient.get('/footer');
      if (res.data) {
        setFooterId(res.data._id);
        setData({
          description: res.data.description || '',
          socialLinks: res.data.socialLinks || [],
          quickLinks: res.data.quickLinks || [],
          bottomLinks: res.data.bottomLinks || [],
          copyrightText: res.data.copyrightText || '© 2025 Jronix. All rights reserved.'
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
      if (footerId) {
        await apiClient.put(`/footer/${footerId}`, data);
      } else {
        await apiClient.post('/footer', data);
      }
      alert('Saved successfully!');
      fetchFooter();
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => setData({ ...data, socialLinks: [...data.socialLinks, { platform: 'github', url: '#' }] });
  const updateSocial = (idx: number, field: string, val: string) => {
    const arr = [...data.socialLinks];
    arr[idx] = { ...arr[idx], [field]: val };
    setData({ ...data, socialLinks: arr });
  };
  const removeSocial = (idx: number) => setData({ ...data, socialLinks: data.socialLinks.filter((_, i) => i !== idx) });

  const addQuickLink = () => setData({ ...data, quickLinks: [...data.quickLinks, { name: '', url: '#' }] });
  const updateQuickLink = (idx: number, field: string, val: string) => {
    const arr = [...data.quickLinks];
    arr[idx] = { ...arr[idx], [field]: val };
    setData({ ...data, quickLinks: arr });
  };
  const removeQuickLink = (idx: number) => setData({ ...data, quickLinks: data.quickLinks.filter((_, i) => i !== idx) });

  const addBottomLink = () => setData({ ...data, bottomLinks: [...data.bottomLinks, { name: '', url: '#' }] });
  const updateBottomLink = (idx: number, field: string, val: string) => {
    const arr = [...data.bottomLinks];
    arr[idx] = { ...arr[idx], [field]: val };
    setData({ ...data, bottomLinks: arr });
  };
  const removeBottomLink = (idx: number) => setData({ ...data, bottomLinks: data.bottomLinks.filter((_, i) => i !== idx) });


  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Footer Settings</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Copyright Text</label>
          <input
            type="text"
            value={data.copyrightText}
            onChange={(e) => setData({ ...data, copyrightText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white"
          />
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-400">Social Links</label>
            <button onClick={addSocial} className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Plus size={14} /> Add Social Link
            </button>
          </div>
          <div className="space-y-3">
            {data.socialLinks.map((link, idx) => (
              <div key={idx} className="flex gap-3">
                <select value={link.platform} onChange={(e) => updateSocial(idx, 'platform', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white">
                  <option value="github">Github</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                </select>
                <input type="text" value={link.url} onChange={(e) => updateSocial(idx, 'url', e.target.value)} placeholder="URL" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white" />
                <button onClick={() => removeSocial(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-400">Quick Links (Column 2)</label>
            <button onClick={addQuickLink} className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Plus size={14} /> Add Link
            </button>
          </div>
          <div className="space-y-3">
            {data.quickLinks.map((link, idx) => (
              <div key={idx} className="flex gap-3">
                <input type="text" value={link.name} onChange={(e) => updateQuickLink(idx, 'name', e.target.value)} placeholder="Name (e.g. Home)" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white" />
                <input type="text" value={link.url} onChange={(e) => updateQuickLink(idx, 'url', e.target.value)} placeholder="Section ID (e.g. home)" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white" />
                <button onClick={() => removeQuickLink(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Links */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-400">Bottom Footer Links</label>
            <button onClick={addBottomLink} className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Plus size={14} /> Add Link
            </button>
          </div>
          <div className="space-y-3">
            {data.bottomLinks.map((link, idx) => (
              <div key={idx} className="flex gap-3">
                <input type="text" value={link.name} onChange={(e) => updateBottomLink(idx, 'name', e.target.value)} placeholder="Name (e.g. Privacy Policy)" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white" />
                <input type="text" value={link.url} onChange={(e) => updateBottomLink(idx, 'url', e.target.value)} placeholder="URL" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white" />
                <button onClick={() => removeBottomLink(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
