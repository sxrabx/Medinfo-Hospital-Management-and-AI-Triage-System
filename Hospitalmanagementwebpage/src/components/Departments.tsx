import { useState } from 'react';
import { Building2, Search, Users, Phone, Mail, MapPin, Clock, Activity } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  description: string;
  headOfDepartment: string;
  totalDoctors: number;
  totalBeds: number;
  phone: string;
  email: string;
  location: string;
  services: string[];
  status: 'active' | 'busy' | 'full';
}

interface DepartmentStats {
  id: number;
  departmentName: string;
  patientsToday: number;
  appointmentsScheduled: number;
  bedsOccupied: number;
  bedsTotal: number;
}

export function Departments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const departments: Department[] = [
    { 
      id: 1, 
      name: 'Cardiology', 
      description: 'Specialized care for heart and cardiovascular conditions',
      headOfDepartment: 'Dr. Robert Taylor',
      totalDoctors: 8,
      totalBeds: 25,
      phone: '+1-555-0201',
      email: 'cardiology@medicare.com',
      location: 'Building A, Floor 3',
      services: ['ECG', 'Echocardiography', 'Angiography', 'Cardiac Surgery'],
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Neurology', 
      description: 'Expert treatment for brain and nervous system disorders',
      headOfDepartment: 'Dr. Michael Brown',
      totalDoctors: 6,
      totalBeds: 20,
      phone: '+1-555-0202',
      email: 'neurology@medicare.com',
      location: 'Building B, Floor 2',
      services: ['MRI', 'CT Scan', 'EEG', 'Neuro Surgery'],
      status: 'busy'
    },
    { 
      id: 3, 
      name: 'Pediatrics', 
      description: 'Comprehensive healthcare for infants, children, and adolescents',
      headOfDepartment: 'Dr. Emily Clark',
      totalDoctors: 10,
      totalBeds: 30,
      phone: '+1-555-0203',
      email: 'pediatrics@medicare.com',
      location: 'Building C, Floor 1',
      services: ['Vaccinations', 'Child Development', 'Pediatric Surgery', 'NICU'],
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Orthopedics', 
      description: 'Treatment for bone, joint, and musculoskeletal conditions',
      headOfDepartment: 'Dr. James Martin',
      totalDoctors: 7,
      totalBeds: 28,
      phone: '+1-555-0204',
      email: 'orthopedics@medicare.com',
      location: 'Building A, Floor 2',
      services: ['Joint Replacement', 'Fracture Care', 'Sports Medicine', 'Spine Surgery'],
      status: 'active'
    },
    { 
      id: 5, 
      name: 'Emergency', 
      description: '24/7 emergency medical services and trauma care',
      headOfDepartment: 'Dr. Sarah Wilson',
      totalDoctors: 15,
      totalBeds: 40,
      phone: '+1-555-0205',
      email: 'emergency@medicare.com',
      location: 'Building D, Ground Floor',
      services: ['Trauma Care', 'Critical Care', 'Emergency Surgery', 'Ambulance Services'],
      status: 'full'
    },
    { 
      id: 6, 
      name: 'Radiology', 
      description: 'Advanced imaging and diagnostic services',
      headOfDepartment: 'Dr. David Harris',
      totalDoctors: 5,
      totalBeds: 0,
      phone: '+1-555-0206',
      email: 'radiology@medicare.com',
      location: 'Building B, Floor 1',
      services: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography'],
      status: 'active'
    },
    { 
      id: 7, 
      name: 'Gynecology', 
      description: "Women's health and reproductive care services",
      headOfDepartment: 'Dr. Jennifer White',
      totalDoctors: 8,
      totalBeds: 22,
      phone: '+1-555-0207',
      email: 'gynecology@medicare.com',
      location: 'Building C, Floor 3',
      services: ['Prenatal Care', 'Delivery Services', 'Gynecological Surgery', 'Fertility Treatment'],
      status: 'busy'
    },
    { 
      id: 8, 
      name: 'Oncology', 
      description: 'Comprehensive cancer diagnosis and treatment',
      headOfDepartment: 'Dr. Lisa Anderson',
      totalDoctors: 9,
      totalBeds: 35,
      phone: '+1-555-0208',
      email: 'oncology@medicare.com',
      location: 'Building A, Floor 4',
      services: ['Chemotherapy', 'Radiation Therapy', 'Surgical Oncology', 'Palliative Care'],
      status: 'active'
    },
  ];

  const departmentStats: DepartmentStats[] = [
    { id: 1, departmentName: 'Cardiology', patientsToday: 45, appointmentsScheduled: 28, bedsOccupied: 20, bedsTotal: 25 },
    { id: 2, departmentName: 'Neurology', patientsToday: 32, appointmentsScheduled: 18, bedsOccupied: 17, bedsTotal: 20 },
    { id: 3, departmentName: 'Pediatrics', patientsToday: 68, appointmentsScheduled: 42, bedsOccupied: 25, bedsTotal: 30 },
    { id: 4, departmentName: 'Emergency', patientsToday: 92, appointmentsScheduled: 0, bedsOccupied: 40, bedsTotal: 40 },
  ];

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'full': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Hospital Departments</h2>
        <p className="text-gray-600">Explore our specialized medical departments and services</p>
      </div>

      {selectedDepartment && (
        <div className="card border-4 border-emerald-500 shadow-2xl bg-gradient-to-br from-white to-emerald-50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-black mb-2 flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded"></div>
                {selectedDepartment.name} Department
              </h3>
              <p className="text-gray-600">{selectedDepartment.description}</p>
            </div>
            <button 
              onClick={() => setSelectedDepartment(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                <p className="text-gray-600 mb-1">Head of Department</p>
                <p className="text-black">{selectedDepartment.headOfDepartment}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                <p className="text-gray-600 mb-1">Total Doctors</p>
                <p className="text-black text-2xl">{selectedDepartment.totalDoctors}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                <p className="text-gray-600 mb-1">Available Beds</p>
                <p className="text-black text-2xl">{selectedDepartment.totalBeds}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-2 border-emerald-200">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="text-black">{selectedDepartment.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span className="text-black">{selectedDepartment.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-black">{selectedDepartment.location}</span>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-2 border-emerald-200">
                <h4 className="text-black mb-3">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDepartment.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="btn-primary flex-1">Contact Department</button>
            <button className="btn-secondary flex-1">View Doctors</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-2 border-emerald-200">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              All Departments
            </h3>
            
            <div className="flex-1 relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDepartments.map((dept) => (
                <div 
                  key={dept.id} 
                  className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black mb-1">{dept.name}</h4>
                        <p className="text-gray-600 mb-2">{dept.description}</p>
                        <span className={`inline-block px-3 py-1 rounded-full border-2 text-sm ${getStatusColor(dept.status)}`}>
                          {dept.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 pt-3 border-t-2 border-emerald-200">
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{dept.totalDoctors} Doctors</span>
                    </div>
                    {dept.totalBeds > 0 && (
                      <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span>{dept.totalBeds} Beds</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{dept.location}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              Today's Activity
            </h3>
            <div className="space-y-4">
              {departmentStats.map((stat) => (
                <div key={stat.id} className="p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all">
                  <h4 className="text-black mb-3">{stat.departmentName}</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Patients:</span>
                      <span className="text-emerald-600">{stat.patientsToday}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Appointments:</span>
                      <span className="text-emerald-600">{stat.appointmentsScheduled}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Beds:</span>
                      <span className="text-emerald-600">{stat.bedsOccupied}/{stat.bedsTotal}</span>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${(stat.bedsOccupied / stat.bedsTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <Clock className="w-8 h-8 mb-4" />
            <h4>24/7 Services</h4>
            <p className="text-emerald-100 mt-2 mb-4">Emergency and critical care services available round the clock</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full">
              View Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
