import { useState } from 'react';
import { Calendar, Clock, Search, Filter, Plus, User, Phone, Mail } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
}

export function Appointments() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: 'John Smith',
      patientPhone: '+1 234-567-8901',
      patientEmail: 'john.smith@email.com',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      date: '2025-12-06',
      time: '10:00 AM',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      id: 2,
      patientName: 'Emma Johnson',
      patientPhone: '+1 234-567-8902',
      patientEmail: 'emma.j@email.com',
      doctor: 'Dr. Michael Brown',
      department: 'Orthopedics',
      date: '2025-12-06',
      time: '11:30 AM',
      status: 'pending',
      type: 'follow-up'
    },
    {
      id: 3,
      patientName: 'Robert Davis',
      patientPhone: '+1 234-567-8903',
      patientEmail: 'r.davis@email.com',
      doctor: 'Dr. Emily Clark',
      department: 'Neurology',
      date: '2025-12-07',
      time: '02:00 PM',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      id: 4,
      patientName: 'Lisa Anderson',
      patientPhone: '+1 234-567-8904',
      patientEmail: 'lisa.a@email.com',
      doctor: 'Dr. James Martin',
      department: 'Pediatrics',
      date: '2025-12-07',
      time: '03:30 PM',
      status: 'completed',
      type: 'consultation'
    },
  ]);

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    type: 'consultation' as const
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      case 'follow-up': return 'bg-green-100 text-green-700 border border-green-300';
      case 'emergency': return 'bg-red-100 text-red-700 border border-red-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      ...formData,
      status: 'pending'
    };
    setAppointments([newAppointment, ...appointments]);
    setShowBookingForm(false);
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      doctor: '',
      department: '',
      date: '',
      time: '',
      type: 'consultation'
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Appointments</h2>
          <p className="text-gray-600">Manage and schedule patient appointments</p>
        </div>
        <button 
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      {showBookingForm && (
        <div className="card border-2 border-emerald-300 shadow-xl bg-gradient-to-br from-white to-emerald-50">
          <h3 className="text-black mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded"></div>
            New Appointment
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.patientPhone}
                onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="+1 234-567-8900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.patientEmail}
                onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="patient@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Doctor</label>
              <select
                required
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="">Select Doctor</option>
                <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                <option value="Dr. Michael Brown">Dr. Michael Brown</option>
                <option value="Dr. Emily Clark">Dr. Emily Clark</option>
                <option value="Dr. James Martin">Dr. James Martin</option>
                <option value="Dr. Lisa Anderson">Dr. Lisa Anderson</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Appointment Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Time</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-primary shadow-lg">
                Book Appointment
              </button>
              <button 
                type="button" 
                onClick={() => setShowBookingForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card border-2 border-emerald-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-emerald-600 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg hover:shadow-lg transition-all border-2 border-emerald-200 hover:border-emerald-400">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-black">{appointment.patientName}</h4>
                      <p className="text-gray-600">{appointment.doctor} • {appointment.department}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full border-2 ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>{appointment.patientPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>{appointment.patientEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-white border-2 border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}