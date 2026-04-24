import { useState } from 'react';
import { CreditCard, Search, Filter, DollarSign, Calendar, FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Bill {
  id: number;
  patientName: string;
  patientId: string;
  billDate: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  services: BillService[];
}

interface BillService {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PaymentHistory {
  id: number;
  patientName: string;
  amount: number;
  date: string;
  method: string;
  receiptNo: string;
}

export function Billing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const bills: Bill[] = [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'P-2024-001',
      billDate: '2026-01-05',
      dueDate: '2026-01-15',
      amount: 450,
      status: 'paid',
      services: [
        { id: 1, name: 'Consultation', category: 'Medical', quantity: 1, unitPrice: 150, total: 150 },
        { id: 2, name: 'Complete Blood Count', category: 'Lab Test', quantity: 1, unitPrice: 25, total: 25 },
        { id: 3, name: 'ECG', category: 'Diagnostic', quantity: 1, unitPrice: 45, total: 45 },
        { id: 4, name: 'Medications', category: 'Pharmacy', quantity: 1, unitPrice: 230, total: 230 }
      ]
    },
    {
      id: 2,
      patientName: 'Emma Johnson',
      patientId: 'P-2024-002',
      billDate: '2026-01-06',
      dueDate: '2026-01-16',
      amount: 1250,
      status: 'pending',
      services: [
        { id: 1, name: 'Cardiology Consultation', category: 'Medical', quantity: 1, unitPrice: 180, total: 180 },
        { id: 2, name: 'Echocardiography', category: 'Diagnostic', quantity: 1, unitPrice: 350, total: 350 },
        { id: 3, name: 'Lipid Profile', category: 'Lab Test', quantity: 1, unitPrice: 35, total: 35 },
        { id: 4, name: 'Room Charges', category: 'Accommodation', quantity: 2, unitPrice: 250, total: 500 },
        { id: 5, name: 'Medications', category: 'Pharmacy', quantity: 1, unitPrice: 185, total: 185 }
      ]
    },
    {
      id: 3,
      patientName: 'Robert Davis',
      patientId: 'P-2024-003',
      billDate: '2026-01-03',
      dueDate: '2026-01-13',
      amount: 2800,
      status: 'overdue',
      services: [
        { id: 1, name: 'Surgery Consultation', category: 'Medical', quantity: 1, unitPrice: 200, total: 200 },
        { id: 2, name: 'Minor Surgery', category: 'Surgical', quantity: 1, unitPrice: 1800, total: 1800 },
        { id: 3, name: 'Anesthesia', category: 'Medical', quantity: 1, unitPrice: 300, total: 300 },
        { id: 4, name: 'Room Charges', category: 'Accommodation', quantity: 3, unitPrice: 250, total: 750 },
        { id: 5, name: 'Post-op Care', category: 'Medical', quantity: 1, unitPrice: 150, total: 150 }
      ]
    },
    {
      id: 4,
      patientName: 'Lisa Anderson',
      patientId: 'P-2024-004',
      billDate: '2026-01-07',
      dueDate: '2026-01-17',
      amount: 680,
      status: 'partial',
      services: [
        { id: 1, name: 'Pediatric Consultation', category: 'Medical', quantity: 1, unitPrice: 120, total: 120 },
        { id: 2, name: 'Vaccinations', category: 'Preventive', quantity: 3, unitPrice: 80, total: 240 },
        { id: 3, name: 'Lab Tests', category: 'Lab Test', quantity: 1, unitPrice: 120, total: 120 },
        { id: 4, name: 'Medications', category: 'Pharmacy', quantity: 1, unitPrice: 200, total: 200 }
      ]
    },
    {
      id: 5,
      patientName: 'Michael Chen',
      patientId: 'P-2024-005',
      billDate: '2026-01-06',
      dueDate: '2026-01-16',
      amount: 890,
      status: 'pending',
      services: [
        { id: 1, name: 'Orthopedic Consultation', category: 'Medical', quantity: 1, unitPrice: 160, total: 160 },
        { id: 2, name: 'X-Ray', category: 'Diagnostic', quantity: 2, unitPrice: 60, total: 120 },
        { id: 3, name: 'Physiotherapy', category: 'Therapy', quantity: 5, unitPrice: 50, total: 250 },
        { id: 4, name: 'Medications', category: 'Pharmacy', quantity: 1, unitPrice: 360, total: 360 }
      ]
    },
    {
      id: 6,
      patientName: 'Sarah Williams',
      patientId: 'P-2024-006',
      billDate: '2026-01-05',
      dueDate: '2026-01-15',
      amount: 320,
      status: 'paid',
      services: [
        { id: 1, name: 'General Consultation', category: 'Medical', quantity: 1, unitPrice: 150, total: 150 },
        { id: 2, name: 'Blood Tests', category: 'Lab Test', quantity: 1, unitPrice: 80, total: 80 },
        { id: 3, name: 'Medications', category: 'Pharmacy', quantity: 1, unitPrice: 90, total: 90 }
      ]
    }
  ];

  const paymentHistory: PaymentHistory[] = [
    { id: 1, patientName: 'John Smith', amount: 450, date: '2026-01-06', method: 'Credit Card', receiptNo: 'RCP-001' },
    { id: 2, patientName: 'Sarah Williams', amount: 320, date: '2026-01-06', method: 'Cash', receiptNo: 'RCP-002' },
    { id: 3, patientName: 'David Brown', amount: 1200, date: '2026-01-05', method: 'Insurance', receiptNo: 'RCP-003' },
    { id: 4, patientName: 'Anna Taylor', amount: 580, date: '2026-01-05', method: 'Debit Card', receiptNo: 'RCP-004' },
  ];

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-300';
      case 'partial': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = bills.filter(b => b.status === 'pending' || b.status === 'partial').reduce((sum, b) => sum + b.amount, 0);
  const overdueAmount = bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Billing & Payments</h2>
        <p className="text-gray-600">Manage patient bills, payments, and financial records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8" />
            <span className="text-emerald-100">Total Revenue</span>
          </div>
          <div className="text-3xl mb-1">${totalRevenue.toLocaleString()}</div>
          <p className="text-emerald-100">Received payments</p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-yellow-100">Pending</span>
          </div>
          <div className="text-3xl mb-1">${pendingAmount.toLocaleString()}</div>
          <p className="text-yellow-100">Awaiting payment</p>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8" />
            <span className="text-red-100">Overdue</span>
          </div>
          <div className="text-3xl mb-1">${overdueAmount.toLocaleString()}</div>
          <p className="text-red-100">Past due date</p>
        </div>
      </div>

      {selectedBill && (
        <div className="card border-4 border-emerald-500 shadow-2xl bg-gradient-to-br from-white to-emerald-50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-black mb-2 flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded"></div>
                Bill Details - {selectedBill.patientName}
              </h3>
              <p className="text-gray-600">Patient ID: {selectedBill.patientId}</p>
            </div>
            <button 
              onClick={() => setSelectedBill(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
              <p className="text-gray-600 mb-1">Bill Date</p>
              <p className="text-black">{selectedBill.billDate}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
              <p className="text-gray-600 mb-1">Due Date</p>
              <p className="text-black">{selectedBill.dueDate}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-black mb-4">Services & Charges</h4>
            <div className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.services.map((service) => (
                    <tr key={service.id} className="border-b border-emerald-100 hover:bg-emerald-50 transition-colors">
                      <td className="px-4 py-3 text-black">{service.name}</td>
                      <td className="px-4 py-3 text-gray-600">{service.category}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{service.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">${service.unitPrice}</td>
                      <td className="px-4 py-3 text-right text-emerald-600">${service.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-right text-black">Total Amount:</td>
                    <td className="px-4 py-4 text-right text-2xl text-emerald-600">${selectedBill.amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn-primary flex items-center gap-2 flex-1">
              <CreditCard className="w-5 h-5" />
              Process Payment
            </button>
            <button className="btn-secondary flex items-center gap-2 flex-1">
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-2 border-emerald-200">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              Patient Bills
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient name or ID..."
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div 
                  key={bill.id} 
                  className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedBill(bill)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-black mb-1">{bill.patientName}</h4>
                      <p className="text-gray-600">ID: {bill.patientId}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 ${getStatusColor(bill.status)}`}>
                      {getStatusIcon(bill.status)}
                      {bill.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t-2 border-emerald-200">
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{bill.billDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-white px-2 py-1 rounded">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Due: {bill.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 bg-white px-2 py-1 rounded">
                      <DollarSign className="w-4 h-4" />
                      <span>${bill.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
            <h3 className="text-black mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              Recent Payments
            </h3>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-black mb-1">{payment.patientName}</h4>
                      <p className="text-gray-600">{payment.method}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600">${payment.amount}</div>
                      <p className="text-gray-500 text-sm">{payment.receiptNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 bg-emerald-50 px-2 py-1 rounded">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{payment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all">
            <Download className="w-8 h-8 mb-4" />
            <h4>Financial Reports</h4>
            <p className="text-emerald-100 mt-2 mb-4">Download detailed billing and revenue reports</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
