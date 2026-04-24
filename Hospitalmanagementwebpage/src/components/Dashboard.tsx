import { Calendar, TestTube, FileText, Activity, Users, Bed, CreditCard, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: string;
  bgColor: string;
  iconColor: string;
}

function StatCard({ icon, title, value, change, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-emerald-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 mb-2">{title}</p>
          <h3 className="text-black mb-2">{value}</h3>
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <p>{change}</p>
          </div>
        </div>
        <div className={`${bgColor} p-4 rounded-xl shadow-lg`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export function Dashboard() {
  const upcomingAppointments: Appointment[] = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Sarah Wilson', time: '10:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Emma Johnson', doctor: 'Dr. Michael Brown', time: '11:30 AM', status: 'pending' },
    { id: 3, patient: 'Robert Davis', doctor: 'Dr. Emily Clark', time: '02:00 PM', status: 'confirmed' },
    { id: 4, patient: 'Lisa Anderson', doctor: 'Dr. James Martin', time: '03:30 PM', status: 'confirmed' },
  ];

  const recentActivity = [
    { id: 1, action: 'New appointment booked', patient: 'Michael Chen', time: '5 mins ago' },
    { id: 2, action: 'Lab report uploaded', patient: 'Sarah Williams', time: '15 mins ago' },
    { id: 3, action: 'Payment received', patient: 'David Brown', time: '1 hour ago' },
    { id: 4, action: 'Prescription issued', patient: 'Anna Taylor', time: '2 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Quick Actions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          title="Today's Appointments"
          value={24}
          change="+12% from yesterday"
          bgColor="bg-gradient-to-br from-emerald-400 to-green-500"
          iconColor="text-white"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Total Patients"
          value={1248}
          change="+8% this month"
          bgColor="bg-gradient-to-br from-emerald-500 to-green-600"
          iconColor="text-white"
        />
        <StatCard
          icon={<Bed className="w-6 h-6" />}
          title="Available Beds"
          value={45}
          change="Out of 120 total"
          bgColor="bg-gradient-to-br from-green-500 to-emerald-600"
          iconColor="text-white"
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          title="Emergency Cases"
          value={3}
          change="Active now"
          bgColor="bg-gradient-to-br from-red-500 to-pink-600"
          iconColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card border-2 border-emerald-200 hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-black">Upcoming Appointments</h3>
            <button className="text-emerald-600 hover:text-emerald-700 px-4 py-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-all border border-emerald-200">
                <div className="flex-1">
                  <p className="text-black">{appointment.patient}</p>
                  <p className="text-gray-600">{appointment.doctor}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{appointment.time}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full border-2 ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-2 border-emerald-200 hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-black">Recent Activity</h3>
            <button className="text-emerald-600 hover:text-emerald-700 px-4 py-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-all border border-emerald-200">
                <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mt-2 pulse-green"></div>
                <div className="flex-1">
                  <p className="text-black">{activity.action}</p>
                  <p className="text-gray-600">{activity.patient}</p>
                </div>
                <span className="text-gray-500 bg-white px-2 py-1 rounded">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <TestTube className="w-8 h-8 mb-4" />
          <h4>Lab Tests</h4>
          <p className="text-emerald-100 mt-2">15 pending results</p>
          <button className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full">
            View Tests
          </button>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <FileText className="w-8 h-8 mb-4" />
          <h4>Reports</h4>
          <p className="text-green-100 mt-2">28 reports today</p>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors w-full">
            View Reports
          </button>
        </div>

        <div className="card bg-gradient-to-br from-emerald-600 to-green-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <CreditCard className="w-8 h-8 mb-4" />
          <h4>Billing</h4>
          <p className="text-emerald-100 mt-2">$45,280 today</p>
          <button className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full">
            View Billing
          </button>
        </div>
      </div>
    </div>
  );
}