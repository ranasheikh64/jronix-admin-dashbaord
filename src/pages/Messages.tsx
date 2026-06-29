import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../api/client';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await apiClient.get('/contact/messages');
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(`/contact/messages/${id}`, { status });
      fetchMessages();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail className="text-blue-500" /> Contact Messages
      </h1>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-200 text-lg">{msg.name}</h3>
                  <div className="text-sm text-slate-400 flex items-center gap-3 mt-1">
                    <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">{msg.email}</a>
                    {msg.phone && <span>• {msg.phone}</span>}
                    <span>• {new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    msg.status === 'Unread' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    msg.status === 'Read' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {msg.status}
                  </span>
                  <select 
                    value={msg.status} 
                    onChange={(e) => updateStatus(msg._id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6 mb-4">
                <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500">Service</div>
                  <div className="text-sm text-slate-300">{msg.service}</div>
                </div>
                <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500">Budget</div>
                  <div className="text-sm text-slate-300">{msg.budget}</div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 mb-2">Message</div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {msg.projectDetails}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
