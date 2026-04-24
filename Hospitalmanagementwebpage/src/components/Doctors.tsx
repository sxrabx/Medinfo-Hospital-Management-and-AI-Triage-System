import { useState } from 'react';
import { Users, Search, Filter, Star, Calendar, Clock, Award, Phone, Mail } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  availability: string;
  consultationFee: number;
  qualification: string;
  phone: string;
  email: string;
}

interface Appointment {
  id: number;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export function Doctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    reason: ''
  });

  const doctors: Doctor[] = [
    { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Cardiology', experience: 15, rating: 4.9, availability: 'Mon-Fri', consultationFee: 150, qualification: 'MD, FACC', phone: '+1-555-0101', email: 'sarah.wilson@medicare.com' },
    { id: 2, name: 'Dr. Michael Brown', specialty: 'Neurology', experience: 12, rating: 4.8, availability: 'Mon-Sat', consultationFee: 180, qualification: 'MD, PhD', phone: '+1-555-0102', email: 'michael.brown@medicare.com' },
    { id: 3, name: 'Dr. Emily Clark', specialty: 'Pediatrics', experience: 10, rating: 4.7, availability: 'Tue-Sat', consultationFee: 120, qualification: 'MD, FAAP', phone: '+1-555-0103', email: 'emily.clark@medicare.com' },
    { id: 4, name: 'Dr. James Martin', specialty: 'Orthopedics', experience: 18, rating: 4.9, availability: 'Mon-Fri', consultationFee: 160, qualification: 'MD, MS Ortho', phone: '+1-555-0104', email: 'james.martin@medicare.com' },
    { id: 5, name: 'Dr. Lisa Anderson', specialty: 'Dermatology', experience: 8, rating: 4.6, availability: 'Wed-Sun', consultationFee: 130, qualification: 'MD, DDV', phone: '+1-555-0105', email: 'lisa.anderson@medicare.com' },
    { id: 6, name: 'Dr. Robert Taylor', specialty: 'Cardiology', experience: 20, rating: 5.0, availability: 'Mon-Fri', consultationFee: 200, qualification: 'MD, DM Cardio', phone: '+1-555-0106', email: 'robert.taylor@medicare.com' },
    { id: 7, name: 'Dr. Jennifer White', specialty: 'Gynecology', experience: 14, rating: 4.8, availability: 'Tue-Sat', consultationFee: 140, qualification: 'MD, DGO', phone: '+1-555-0107', email: 'jennifer.white@medicare.com' },
    { id: 8, name: 'Dr. David Harris', specialty: 'Ophthalmology', experience: 11, rating: 4.7, availability: 'Mon-Sat', consultationFee: 135, qualification: 'MD, MS Ophthal', phone: '+1-555-0108', email: 'david.harris@medicare.com' },
  ];

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, doctorName: 'Dr. Sarah Wilson', patientName: 'John Smith', date: '2026-01-08', time: '10:00 AM', status: 'confirmed' },
    { id: 2, doctorName: 'Dr. Michael Brown', patientName: 'Emma Johnson', date: '2026-01-09', time: '02:30 PM', status: 'pending' },
    { id: 3, doctorName: 'Dr. Emily Clark', patientName: 'Robert Davis', date: '2026-01-07', time: '11:00 AM', status: 'completed' },
  ]);

  const specialties = Array.from(new Set(doctors.map(doc => doc.specialty)));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesFilter;
  });

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctor) {
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        doctorName: selectedDoctor.name,
        patientName: formData.patientName,
        date: formData.date,
        time: formData.time,
        status: 'pending'
      };
      setAppointments([newAppointment, ...appointments]);
      setShowBookingForm(false);
      setSelectedDoctor(null);
      setFormData({ patientName: '', patientId: '', date: '', time: '', reason: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Our Doctors</h2>
        <p className="text-gray-600">Book appointments with our experienced medical professionals</p>
      </div>

      {showBookingForm && selectedDoctor && (
        <div className="card border-4 border-emerald-500 shadow-2xl bg-gradient-to-br from-white to-emerald-50">
          <h3 className="text-black mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded"></div>
            Book Appointment with {selectedDoctor.name}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preferred Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Reason for Visit</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  rows={3}
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                />
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Consultation Fee:</span>
                <span className="text-black text-2xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">${selectedDoctor.consultationFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Available:</span>
                <span className="text-black">{selectedDoctor.availability}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary shadow-lg flex-1">
                Confirm Appointment
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedDoctor(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-2 border-emerald-200">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Available Doctors
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-emerald-600 w-5 h-5" />
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="all">All Specialties</option>
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black mb-1">{doctor.name}</h4>
                        <p className="text-gray-600 mb-2">{doctor.qualification}</p>
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full">
                          {doctor.specialty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{doctor.rating} / 5.0 rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{doctor.availability}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-emerald-200">
                    <div className="text-emerald-600 bg-white px-3 py-2 rounded">
                      <span className="text-lg">${doctor.consultationFee}</span>
                    </div>
                    <button 
                      onClick={() => handleDoctorSelect(doctor)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              Recent Appointments
            </h3>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-black mb-1">{appointment.doctorName}</h4>
                      <p className="text-gray-600">{appointment.patientName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full border-2 text-sm ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <Phone className="w-8 h-8 mb-4" />
            <h4>Need Help?</h4>
            <p className="text-emerald-100 mt-2 mb-4">Contact our support team for assistance with bookings</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
