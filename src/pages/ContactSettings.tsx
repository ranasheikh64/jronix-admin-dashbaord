import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import apiClient from '../api/client';

export default function ContactSettings() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: 'hello@jronix.com',
    whatsapp: '+880 1700-000000',
    location: 'Dhaka, Bangladesh',
    businessHours: 'Sat – Thu, 9am – 8pm BST'
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await apiClient.get('/contact/info');
      if (res.data) {
        setFormData({
          email: res.data.email || '',
          whatsapp: res.data.whatsapp || '',
          location: res.data.location || '',
          businessHours: res.data.businessHours || ''
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
    try {
      await apiClient.put('/contact/info', formData).catch(() => apiClient.post('/contact/info', formData));
      alert('Saved successfully');
      fetchContactInfo();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="text-blue-500" /> Contact Info Settings
      </h1>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="hello@jronix.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">WhatsApp / Phone</label>
              <input type="text" required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="+880 1700-000000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Location Address</label>
            <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Dhaka, Bangladesh" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Business Hours</label>
            <input type="text" required value={formData.businessHours} onChange={e => setFormData({...formData, businessHours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Sat – Thu, 9am – 8pm BST" />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition font-medium flex items-center gap-2">
              <Save size={18} /> Save Contact Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
