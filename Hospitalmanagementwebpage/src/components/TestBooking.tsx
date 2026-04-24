import { TestTube, Search, Filter, Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface Test {
  id: number;
  testName: string;
  category: string;
  price: number;
  duration: string;
  description: string;
}

interface BookedTest {
  id: number;
  patientName: string;
  testName: string;
  category: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
}

export function TestBooking() {
  const [showBookingForm, setShowBookingForm]   = useState(false);
  const [selectedTest, setSelectedTest]         = useState<Test | null>(null);
  const [searchTerm, setSearchTerm]             = useState('');
  const [filterCategory, setFilterCategory]     = useState('all');
  const [availableTests, setAvailableTests]     = useState<Test[]>([]);
  const [bookedTests, setBookedTests]           = useState<BookedTest[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [bookingMsg, setBookingMsg]             = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    loadTests();
    loadBookedTests();
  }, []);

  // ── Load available tests from Supabase ──────────────────────────
  const loadTests = async () => {
    const { data, error } = await supabase
      .from('lab_tests')
      .select('*')
      .eq('available', true);

    if (data) {
      const mapped: Test[] = data.map((t: any) => ({
        id:          t.id,
        testName:    t.test_name,
        category:    t.category    || '',
        price:       t.price       || 0,
        duration:    t.duration    || '',
        description: t.description || '',
      }));
      setAvailableTests(mapped);
    }
    setLoading(false);
  };


  const loadBookedTests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('booked_tests')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      // ✅ Map snake_case → camelCase
      const mapped: BookedTest[] = data.map((t: any) => ({
        id:          t.id,
        patientName: t.patient_name || '',
        testName:    t.test_name    || '',
        category:    t.category     || '',
        date:        t.date         || '',
        time:        t.time         || '',
        status:      t.status       || 'scheduled',
        price:       t.price        || 0,
      }));
      setBookedTests(mapped);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':   return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed':   return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled':   return 'bg-red-100 text-red-700 border-red-300';
      default:            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
    setShowBookingForm(true);
  };

  // ── Submit booking to Supabase ──────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('booked_tests')
      .insert({
        patient_id:   user?.id,
        patient_name: formData.patientName,
        test_name:    selectedTest.testName,
        category:     selectedTest.category,
        date:         formData.date,
        time:         formData.time,
        price:        selectedTest.price,
        notes:        formData.notes,
        status:       'scheduled',
      })
      .select()
      .single();

    if (!error && data) {
      // Map response back to camelCase before adding to state
      const newBooking: BookedTest = {
        id:          data.id,
        patientName: data.patient_name,
        testName:    data.test_name,
        category:    data.category,
        date:        data.date,
        time:        data.time,
        status:      data.status,
        price:       data.price,
      };
      setBookedTests([newBooking, ...bookedTests]);
      setShowBookingForm(false);
      setSelectedTest(null);
      setFormData({ patientName: '', patientId: '', date: '', time: '', notes: '' });
      setBookingMsg('Test booked successfully! ✅');
      setTimeout(() => setBookingMsg(''), 3000);
    } else if (error) {
      setBookingMsg('Error: ' + error.message);
    }
  };

  // ✅ Safe filter — uses optional chaining to prevent undefined errors
  const filteredTests = availableTests.filter(test => {
    const name     = test.testName?.toLowerCase() || '';
    const category = test.category?.toLowerCase() || '';
    const search   = searchTerm.toLowerCase();

    const matchesSearch  = name.includes(search) || category.includes(search);
    const matchesFilter  = filterCategory === 'all' || test.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(availableTests.map(t => t.category).filter(Boolean)));

  return (
    <div className="space-y-6">

      {/* Success/Error notification */}
      {bookingMsg && (
        <div className="fixed top-20 right-4 z-50 px-6 py-3 bg-emerald-500 text-white rounded-xl shadow-xl">
          {bookingMsg}
        </div>
      )}

      <div>
        <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Test Booking</h2>
        <p className="text-gray-600">Schedule diagnostic tests and lab procedures</p>
      </div>

      {/* Booking Form */}
      {showBookingForm && selectedTest && (
        <div className="card border-4 border-emerald-500 shadow-2xl bg-gradient-to-br from-white to-emerald-50">
          <h3 className="text-black mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded"></div>
            Book Test: {selectedTest.testName}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text" required
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text" required
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date" required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preferred Time</label>
                <input
                  type="time" required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Special Instructions (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  rows={3}
                  placeholder="Any special instructions or medical conditions..."
                />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Test Price:</span>
                <span className="text-black text-2xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">₹{selectedTest.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expected Duration:</span>
                <span className="text-black">{selectedTest.duration}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary shadow-lg flex-1">Confirm Booking</button>
              <button type="button" onClick={() => { setShowBookingForm(false); setSelectedTest(null); }} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-2 border-emerald-200">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <TestTube className="w-6 h-6 text-emerald-600" />
              Available Tests
            </h3>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-emerald-600 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tests grid */}
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredTests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tests found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTests.map((test) => (
                  <div key={test.id} className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-black mb-1">{test.testName}</h4>
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm">
                          {test.category}
                        </span>
                      </div>
                      <TestTube className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{test.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded text-sm">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>{test.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 bg-white px-2 py-1 rounded text-sm">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{test.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTestSelect(test)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          <div className="card border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              My Booked Tests
            </h3>
            {bookedTests.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-sm">No tests booked yet</p>
            ) : (
              <div className="space-y-4">
                {bookedTests.map((booking) => (
                  <div key={booking.id} className="p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-black mb-1 text-sm font-medium">{booking.patientName}</h4>
                        <p className="text-gray-600 text-sm">{booking.testName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full border-2 text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded text-sm">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded text-sm">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">₹{booking.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <FileText className="w-8 h-8 mb-4" />
            <h4>Test Packages</h4>
            <p className="text-emerald-100 mt-2 mb-4">Save up to 30% with our comprehensive health packages</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full">
              View Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}