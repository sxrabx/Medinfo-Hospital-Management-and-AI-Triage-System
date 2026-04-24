import { useState, useEffect } from 'react';
import { FileText, Download, Upload, Search, Eye, Calendar, User, Pill, Activity, X, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientIdentifier: string;
  recordType: 'lab-report' | 'prescription' | 'imaging' | 'consultation' | 'discharge';
  title: string;
  doctor: string;
  date: string;
  status: 'available' | 'pending' | 'processing';
  notes?: string;
  fileUrl?: string;
}

interface Stats {
  labReports: number;
  prescriptions: number;
  imaging: number;
  consultations: number;
}

export function MedicalRecords() {
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterType, setFilterType]         = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [records, setRecords]               = useState<MedicalRecord[]>([]);
  const [stats, setStats]                   = useState<Stats>({ labReports: 0, prescriptions: 0, imaging: 0, consultations: 0 });
  const [loading, setLoading]               = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [msg, setMsg]                       = useState('');

  const [formData, setFormData] = useState({
    title: '',
    recordType: 'lab-report',
    doctor: '',
    date: '',
    status: 'available',
    notes: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      const mapped: MedicalRecord[] = data.map((r: any) => ({
        id:                  r.id,
        patientName:         r.patient_name         || '',
        patientIdentifier:   r.patient_identifier   || '',
        recordType:          r.record_type          || 'lab-report',
        title:               r.title                || '',
        doctor:              r.doctor               || '',
        date:                r.date                 || '',
        status:              r.status               || 'available',
        notes:               r.notes                || '',
        fileUrl:             r.file_url             || '',
      }));

      setRecords(mapped);

      // Calculate stats
      setStats({
        labReports:    mapped.filter(r => r.recordType === 'lab-report').length,
        prescriptions: mapped.filter(r => r.recordType === 'prescription').length,
        imaging:       mapped.filter(r => r.recordType === 'imaging').length,
        consultations: mapped.filter(r => r.recordType === 'consultation').length,
      });
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get name from profile
    const { data: profile } = await supabase
      .from('patient_profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    const patientName = profile
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      : user.email || 'Unknown';

    const { data, error } = await supabase
      .from('medical_records')
      .insert({
        patient_id:         user.id,
        patient_name:       patientName,
        patient_identifier: `P-${new Date().getFullYear()}-${patientName.substring(0, 3).toUpperCase()}-789`,
        record_type:        formData.recordType,
        title:              formData.title,
        doctor:             formData.doctor,
        date:               formData.date,
        status:             formData.status,
        notes:              formData.notes,
      })
      .select()
      .single();

    if (!error && data) {
      const newRecord: MedicalRecord = {
        id:                data.id,
        patientName:       data.patient_name,
        patientIdentifier: data.patient_identifier,
        recordType:        data.record_type,
        title:             data.title,
        doctor:            data.doctor,
        date:              data.date,
        status:            data.status,
        notes:             data.notes,
      };
      setRecords([newRecord, ...records]);
      setShowUploadForm(false);
      setFormData({ title: '', recordType: 'lab-report', doctor: '', date: '', status: 'available', notes: '' });
      showMsg('Record added successfully! ✅');
      loadRecords(); // refresh stats
    } else {
      showMsg('Error: ' + error?.message);
    }
    setSaving(false);
  };

  const showMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'lab-report':   return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'prescription': return 'bg-green-100 text-green-700 border-green-300';
      case 'imaging':      return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'consultation': return 'bg-lime-100 text-lime-700 border-lime-300';
      case 'discharge':    return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      default:             return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':  return 'bg-emerald-100 text-emerald-700';
      case 'pending':    return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default:           return 'bg-gray-100 text-gray-700';
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab-report':   return <Activity className="w-5 h-5" />;
      case 'prescription': return <Pill className="w-5 h-5" />;
      default:             return <FileText className="w-5 h-5" />;
    }
  };

  const filteredRecords = records.filter(record => {
    const name  = record.patientName?.toLowerCase() || '';
    const title = record.title?.toLowerCase()       || '';
    const pid   = record.patientIdentifier?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || title.includes(search) || pid.includes(search);
    const matchesFilter = filterType === 'all' || record.recordType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">

      {/* Toast notification */}
      {msg && (
        <div className="fixed top-20 right-4 z-50 px-6 py-3 bg-emerald-500 text-white rounded-xl shadow-xl">
          {msg}
        </div>
      )}

      <div>
        <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Medical Records</h2>
        <p className="text-gray-600">Access and manage your medical records and reports</p>
      </div>

      {/* Stats — live counts from DB */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Lab Reports',    value: stats.labReports,    icon: <Activity className="w-8 h-8 mb-2" />, gradient: 'from-emerald-500 to-green-600' },
          { label: 'Prescriptions',  value: stats.prescriptions, icon: <Pill className="w-8 h-8 mb-2" />,     gradient: 'from-green-500 to-emerald-600' },
          { label: 'Imaging Reports',value: stats.imaging,       icon: <FileText className="w-8 h-8 mb-2" />, gradient: 'from-teal-500 to-emerald-600' },
          { label: 'Consultations',  value: stats.consultations, icon: <User className="w-8 h-8 mb-2" />,     gradient: 'from-emerald-600 to-green-700' },
        ].map(stat => (
          <div key={stat.label} className={`card bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1`}>
            {stat.icon}
            <p className="text-white/80 text-sm">{stat.label}</p>
            <h3 className="mt-1 text-3xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Search, filter, upload */}
      <div className="card border-2 border-emerald-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID or record title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="all">All Types</option>
            <option value="lab-report">Lab Reports</option>
            <option value="prescription">Prescriptions</option>
            <option value="imaging">Imaging</option>
            <option value="consultation">Consultations</option>
            <option value="discharge">Discharge Summaries</option>
          </select>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Record
          </button>
        </div>

        {/* Add Record Form */}
        {showUploadForm && (
          <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-300">
            <h4 className="text-black mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded" />
              Add New Medical Record
            </h4>
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Record Title *</label>
                <input
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Complete Blood Count Report"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Record Type *</label>
                <select
                  value={formData.recordType}
                  onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="lab-report">Lab Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="imaging">Imaging</option>
                  <option value="consultation">Consultation</option>
                  <option value="discharge">Discharge Summary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Doctor Name *</label>
                <input
                  type="text" required
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  placeholder="e.g. Dr. Sarah Wilson"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Date *</label>
                <input
                  type="date" required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Record'}
                </button>
                <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Records List */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <p className="text-gray-500">No records found</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add Record" to add your first medical record</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg border-2 shadow-md ${getRecordTypeColor(record.recordType)}`}>
                      {getRecordIcon(record.recordType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-black mb-1">{record.title}</h4>
                          <p className="text-gray-600 text-sm">{record.patientName} • {record.patientIdentifier}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-gray-600 mt-3">
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded text-sm">
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>{record.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded text-sm">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>{record.date}</span>
                        </div>
                        <span className={`px-3 py-1 rounded border-2 text-sm ${getRecordTypeColor(record.recordType)}`}>
                          {record.recordType.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); }}
                      className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRecord(null)}>
          <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-emerald-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {selectedRecord.title}
                </h3>
                <p className="text-gray-600">{selectedRecord.patientName} • {selectedRecord.patientIdentifier}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Doctor', value: selectedRecord.doctor },
                  { label: 'Date',   value: selectedRecord.date },
                ].map(item => (
                  <div key={item.label} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                    <p className="text-black font-medium">{item.value}</p>
                  </div>
                ))}
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-gray-500 text-sm mb-1">Record Type</p>
                  <span className={`inline-block px-3 py-1 rounded border-2 text-sm ${getRecordTypeColor(selectedRecord.recordType)}`}>
                    {selectedRecord.recordType.replace('-', ' ')}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-gray-500 text-sm mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRecord.status)}`}>
                    {selectedRecord.status}
                  </span>
                </div>
              </div>

              {selectedRecord.notes && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-gray-500 text-sm mb-2">Notes</p>
                  <p className="text-gray-700">{selectedRecord.notes}</p>
                </div>
              )}

              <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 min-h-[120px] flex items-center justify-center">
                <p className="text-gray-500 text-center text-sm">
                  File preview will appear here once file upload is connected to Supabase Storage
                </p>
              </div>

              <div className="flex gap-4">
                <button className="btn-primary flex items-center gap-2 flex-1 shadow-lg">
                  <Download className="w-5 h-5" /> Download Record
                </button>
                <button className="btn-secondary flex-1">Share with Doctor</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}