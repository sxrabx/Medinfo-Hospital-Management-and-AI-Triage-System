import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';
import { 
  LayoutDashboard, 
  Calendar, 
  TestTube, 
  FileText, 
  MessageCircle, 
  Users, 
  Building2, 
  AlertCircle,
  CreditCard,
  Menu,
  X,
  Activity,
  Phone,
  UserCircle
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Appointments } from './components/Appointments';
import { TestBooking } from './components/TestBooking';
import { MedicalRecords } from './components/MedicalRecords';
import { Chatbot } from './components/Chatbot';
import { Doctors } from './components/Doctors';
import { Departments } from './components/Departments';
import { Billing } from './components/Billing';
import { Profile } from './components/Profile';

type Page = 'dashboard' | 'appointments' | 'tests' | 'records' | 'chatbot' | 'doctors' | 'departments' | 'billing' | 'profile';

export default function App() {

  // ✅ ALL hooks at the top — before any return statements
  const [session, setSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navigation = [
    { id: 'dashboard' as Page, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments' as Page, name: 'Appointments', icon: Calendar },
    { id: 'tests' as Page, name: 'Test Booking', icon: TestTube },
    { id: 'records' as Page, name: 'Medical Records', icon: FileText },
    { id: 'chatbot' as Page, name: 'AI Assistant', icon: MessageCircle },
  ];

  const additionalNav = [
    { id: 'doctors' as Page, name: 'Doctors', icon: Users },
    { id: 'departments' as Page, name: 'Departments', icon: Building2 },
    { id: 'billing' as Page, name: 'Billing', icon: CreditCard },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'appointments': return <Appointments />;
      case 'tests': return <TestBooking />;
      case 'records': return <MedicalRecords />;
      case 'chatbot': return <Chatbot />;
      case 'doctors': return <Doctors />;
      case 'departments': return <Departments />;
      case 'billing': return <Billing />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  // 🔒 Not logged in → show Auth page
  if (!session) {
    return <Auth />;
  }

  // ✅ Logged in → show Hospital Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">

      {/* Header */}
      <header className="bg-white border-b-2 border-emerald-200 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg pulse-green">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">MediCare Hospital</h1>
                <p className="text-emerald-600 text-sm">Excellence in Healthcare</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setShowEmergencyPopup(true)}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors relative border-2 border-transparent hover:border-emerald-300"
              >
                <AlertCircle className="w-6 h-6 text-red-600" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white pulse-green"></span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                Logout
              </button>

              <button 
                onClick={() => setCurrentPage('profile')}
                title={session?.user?.email}
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-110"
              >
                <span className="text-white text-sm font-medium">
                  {session?.user?.user_metadata?.full_name
                    ? session.user.user_metadata.full_name
                        .split(' ')
                        .map((n: string) => n[0].toUpperCase())
                        .join('')
                        .slice(0, 2)
                    : session?.user?.email?.[0].toUpperCase() || 'U'}
                </span>
              </button>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-emerald-50 rounded-lg transition-colors border-2 border-emerald-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-emerald-600" /> : <Menu className="w-6 h-6 text-emerald-600" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="card sticky top-24 space-y-1 border-2 border-emerald-200 shadow-xl bg-gradient-to-br from-white to-emerald-50">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t-2 border-emerald-200 space-y-1">
                {additionalNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-gradient-to-br from-white to-emerald-50 w-64 h-full p-4 space-y-1 shadow-2xl border-r-4 border-emerald-500" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-emerald-200">
                  <h3 className="text-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Menu</h3>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 hover:bg-emerald-100 rounded p-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setCurrentPage(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t-2 border-emerald-200 space-y-1">
                  {additionalNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setCurrentPage(item.id); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Logout */}
                <div className="pt-4 mt-4 border-t-2 border-emerald-200">
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {renderPage()}
          </main>
        </div>
      </div>

      {/* Emergency Popup */}
      {showEmergencyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowEmergencyPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-4 border-red-500" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 pulse-green">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-black mb-2">24/7 Emergency Services</h3>
                <p className="text-gray-600">Our emergency department is always available for urgent medical care</p>
              </div>
              <button onClick={() => setShowEmergencyPopup(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border-2 border-red-200">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <Phone className="w-5 h-5" />
                  <span>Emergency Hotline</span>
                </div>
                <div className="text-2xl text-black">+1-800-EMERGENCY</div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Activity className="w-5 h-5" />
                  <span>Current Status</span>
                </div>
                <div className="text-black">3 Active Emergency Cases</div>
                <div className="text-gray-600">Available beds: 12/40</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowEmergencyPopup(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </button>
              <button 
                onClick={() => setShowEmergencyPopup(false)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Quick Access Button */}
      <button 
        onClick={() => setShowEmergencyPopup(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-2xl z-30 flex items-center justify-center hover:scale-110 transition-all pulse-green"
      >
        <AlertCircle className="w-7 h-7" />
      </button>
    </div>
  );
}