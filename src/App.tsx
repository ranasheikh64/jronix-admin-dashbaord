import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Info, 
  Briefcase, 
  Layers, 
  Star, 
  BarChart2, 
  FileText, 
  Menu
} from 'lucide-react';

import HeroPage from './pages/Hero';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import ProjectsPage from './pages/Projects';
import BlogsPage from './pages/Blogs';
import CareersPage from './pages/Careers';
import StatsPage from './pages/Stats';
import TeamPage from './pages/Team';
import TechPage from './pages/Tech';
import ReviewsPage from './pages/Reviews';
import MessagesPage from './pages/Messages';
import ContactSettingsPage from './pages/ContactSettings';
import FooterSettingsPage from './pages/FooterSettings';

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Contact Info', path: '/contact-settings', icon: Info },
    { name: 'Hero Section', path: '/hero', icon: ImageIcon },
    { name: 'About Section', path: '/about', icon: Info },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'Projects', path: '/projects', icon: Layers },
    { name: 'Team', path: '/team', icon: Info },
    { name: 'Tech Stack', path: '/tech', icon: Layers },
    { name: 'Careers', path: '/careers', icon: Briefcase },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Stats', path: '/stats', icon: BarChart2 },
    { name: 'Blogs', path: '/blogs', icon: FileText },
    { name: 'Footer', path: '/footer', icon: Menu },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <img src="/logo.jpg" alt="Jronix Logo" className="w-8 h-8 rounded-full border border-slate-700" />
        <h1 className="text-xl font-bold text-white tracking-wider font-mono">JRONIX<span className="text-blue-500">_ADMIN</span></h1>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const Topbar = () => {
  const location = useLocation();
  const title = location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);
  
  return (
    <div className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 flex items-center px-8">
      <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
    </div>
  );
};

const Dashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex">
        <Sidebar />
        <div className="ml-64 flex-1 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/contact-settings" element={<ContactSettingsPage />} />
              <Route path="/hero" element={<HeroPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/tech" element={<TechPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/footer" element={<FooterSettingsPage />} />
              {/* Other routes will be added later */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
