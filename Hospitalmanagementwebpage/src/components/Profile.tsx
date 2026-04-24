import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  User, Mail, Phone, MapPin, Calendar, Heart, Shield, Users,
  Edit3, Camera, Save, X, Upload, FileText, Activity,
  AlertCircle, CheckCircle, Clock, Droplet, Ruler, Weight
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  insuranceProvider: string;
  insuranceNumber: string;
  insuranceExpiry: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
}

interface HealthMetric {
  id?: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  updated_at?: string;
}

const defaultMetrics: HealthMetric[] = [
  { name: 'Blood Pressure', value: '', unit: 'mmHg', status: 'normal' },
  { name: 'Heart Rate',     value: '', unit: 'bpm',  status: 'normal' },
  { name: 'Blood Sugar',    value: '', unit: 'mg/dL', status: 'normal' },
  { name: 'Cholesterol',    value: '', unit: 'mg/dL', status: 'normal' },
  { name: 'BMI',            value: '', unit: '',      status: 'normal' },
  { name: 'Temperature',    value: '', unit: '°F',    status: 'normal' },
];

const emptyProfile: ProfileData = {
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', gender: 'Male', bloodGroup: 'O+',
  height: '', weight: '', address: '', city: '', state: '', zipCode: '',
  emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
  insuranceProvider: '', insuranceNumber: '', insuranceExpiry: '',
  allergies: '', chronicConditions: '', currentMedications: '',
};

export function Profile() {
  const [isEditing, setIsEditing]     = useState(false);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [activeTab, setActiveTab]     = useState<'personal' | 'medical' | 'insurance' | 'documents'>('personal');
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfile);
  const [editData, setEditData]       = useState<ProfileData>(emptyProfile);
  const [metrics, setMetrics]         = useState<HealthMetric[]>(defaultMetrics);
  const [editMetrics, setEditMetrics] = useState<HealthMetric[]>(defaultMetrics);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');

  // ── Load data on mount ──────────────────────────────────────────
  useEffect(() => {
    loadProfile();
    loadMetrics();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const base: ProfileData = {
      firstName:                  data?.first_name               || user.user_metadata?.full_name?.split(' ')[0] || '',
      lastName:                   data?.last_name                || user.user_metadata?.full_name?.split(' ')[1] || '',
      email:                      user.email                     || '',
      phone:                      data?.phone                    || '',
      dateOfBirth:                data?.date_of_birth            || '',
      gender:                     data?.gender                   || 'Male',
      bloodGroup:                 data?.blood_group              || 'O+',
      height:                     data?.height                   || '',
      weight:                     data?.weight                   || '',
      address:                    data?.address                  || '',
      city:                       data?.city                     || '',
      state:                      data?.state                    || '',
      zipCode:                    data?.zip_code                 || '',
      emergencyContactName:       data?.emergency_contact_name   || '',
      emergencyContactPhone:      data?.emergency_contact_phone  || '',
      emergencyContactRelation:   data?.emergency_contact_relation || '',
      insuranceProvider:          data?.insurance_provider       || '',
      insuranceNumber:            data?.insurance_number         || '',
      insuranceExpiry:            data?.insurance_expiry         || '',
      allergies:                  data?.allergies                || '',
      chronicConditions:          data?.chronic_conditions       || '',
      currentMedications:         data?.current_medications      || '',
    };

    setProfileData(base);
    setEditData(base);
    setLoading(false);
  };

  const loadMetrics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('patient_id', user.id);

    if (data && data.length > 0) {
      // Merge DB values into defaultMetrics order
      const merged = defaultMetrics.map(def => {
        const found = data.find((d: any) => d.name === def.name);
        return found ? {
          id:         found.id,
          name:       found.name,
          value:      found.value,
          unit:       found.unit,
          status:     found.status,
          updated_at: found.updated_at,
        } : def;
      });
      setMetrics(merged);
      setEditMetrics(merged);
    }
  };

  // ── Save profile ────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      id:                         user.id,
      first_name:                 editData.firstName,
      last_name:                  editData.lastName,
      phone:                      editData.phone,
      date_of_birth:              editData.dateOfBirth || null,
      gender:                     editData.gender,
      blood_group:                editData.bloodGroup,
      height:                     editData.height,
      weight:                     editData.weight,
      address:                    editData.address,
      city:                       editData.city,
      state:                      editData.state,
      zip_code:                   editData.zipCode,
      emergency_contact_name:     editData.emergencyContactName,
      emergency_contact_phone:    editData.emergencyContactPhone,
      emergency_contact_relation: editData.emergencyContactRelation,
      insurance_provider:         editData.insuranceProvider,
      insurance_number:           editData.insuranceNumber,
      insurance_expiry:           editData.insuranceExpiry || null,
      allergies:                  editData.allergies,
      chronic_conditions:         editData.chronicConditions,
      current_medications:        editData.currentMedications,
      updated_at:                 new Date().toISOString(),
    };

    const { error } = await supabase
      .from('patient_profiles')
      .upsert(payload);

    if (!error) {
      setProfileData(editData);
      setIsEditing(false);
      showSaveMsg('Profile saved! ✅');
    } else {
      showSaveMsg('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  // ── Save metrics ────────────────────────────────────────────────
  const handleSaveMetrics = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const metric of editMetrics) {
      const payload = {
        patient_id:  user.id,
        name:        metric.name,
        value:       metric.value,
        unit:        metric.unit,
        status:      metric.status,
        updated_at:  new Date().toISOString(),
      };

      if (metric.id) {
        await supabase.from('health_metrics').update(payload).eq('id', metric.id);
      } else {
        await supabase.from('health_metrics').insert(payload);
      }
    }

    setMetrics(editMetrics);
    setIsEditingMetrics(false);
    showSaveMsg('Health metrics saved! ✅');
    setSaving(false);
    loadMetrics(); // reload to get IDs
  };

  const showSaveMsg = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleCancelMetrics = () => {
    setEditMetrics(metrics);
    setIsEditingMetrics(false);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() - birth.getMonth() < 0 ||
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':   return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'warning':  return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default:         return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const metricIcons: Record<string, React.ReactNode> = {
    'Blood Pressure': <Activity className="w-5 h-5" />,
    'Heart Rate':     <Heart className="w-5 h-5" />,
    'Blood Sugar':    <Droplet className="w-5 h-5" />,
    'Cholesterol':    <Activity className="w-5 h-5" />,
    'BMI':            <Weight className="w-5 h-5" />,
    'Temperature':    <Activity className="w-5 h-5" />,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Save notification */}
      {saveMsg && (
        <div className="fixed top-20 right-4 z-50 px-6 py-3 bg-emerald-500 text-white rounded-xl shadow-xl">
          {saveMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">My Profile</h2>
          <p className="text-gray-600">Manage your personal and medical information</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
            <Edit3 className="w-5 h-5" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
              <X className="w-5 h-5" /> Cancel
            </button>
          </div>
        )}
      </div> 
      {/* Profile Header Card */}
      <div className="card border-4 border-emerald-300 shadow-2xl bg-gradient-to-br from-white via-emerald-50 to-green-50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-10 -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-4xl shadow-xl border-4 border-white">
              <span>
                {profileData.firstName?.[0] || '?'}{profileData.lastName?.[0] || ''}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-black mb-1">
              {profileData.firstName || profileData.email || 'Your Name'}
              {profileData.lastName ? ' ' + profileData.lastName : ''}
            </h3>
            <p className="text-gray-500 mb-1 text-sm">{profileData.email}</p>
            <p className="text-gray-600 mb-4">
              Patient ID: P-{new Date().getFullYear()}-{(profileData.firstName || 'USR').substring(0, 3).toUpperCase()}-789
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Age', value: calculateAge(profileData.dateOfBirth) + (profileData.dateOfBirth ? ' yrs' : ''), icon: <Calendar className="w-4 h-4" />, color: 'emerald' },
                { label: 'Gender', value: profileData.gender || '—', icon: <User className="w-4 h-4" />, color: 'emerald' },
                { label: 'Blood Group', value: profileData.bloodGroup || '—', icon: <Droplet className="w-4 h-4" />, color: 'red' },
                { label: 'Insurance', value: profileData.insuranceProvider || '—', icon: <Shield className="w-4 h-4" />, color: 'emerald' },
              ].map((item) => (
                <div key={item.label} className={`p-3 bg-white rounded-lg border-2 border-${item.color}-200 hover:border-${item.color}-400 hover:shadow-md transition-all`}>
                  <div className={`flex items-center gap-2 text-${item.color}-600 mb-1`}>
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <p className="text-black text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Health Metrics ── */}
      <div className="card border-2 border-emerald-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-black flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" /> Health Metrics
          </h3>
          {!isEditingMetrics ? (
            <button onClick={() => setIsEditingMetrics(true)} className="btn-primary flex items-center gap-2 text-sm px-3 py-2">
              <Edit3 className="w-4 h-4" /> Update Metrics
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSaveMetrics} disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-3 py-2">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancelMetrics} className="btn-secondary flex items-center gap-2 text-sm px-3 py-2">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(isEditingMetrics ? editMetrics : metrics).map((metric, index) => (
            <div key={metric.name} className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-600">
                  {metricIcons[metric.name]}
                  <span className="text-gray-700 text-sm font-medium">{metric.name}</span>
                </div>
                {isEditingMetrics ? (
                  <select
                    value={metric.status}
                    onChange={(e) => {
                      const updated = [...editMetrics];
                      updated[index] = { ...updated[index], status: e.target.value as any };
                      setEditMetrics(updated);
                    }}
                    className="text-xs border border-emerald-200 rounded px-1 py-0.5"
                  >
                    <option value="normal">Normal</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(metric.status)}`}>
                    <CheckCircle className="w-3 h-3" />
                    {metric.status}
                  </span>
                )}
              </div>

              {isEditingMetrics ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => {
                      const updated = [...editMetrics];
                      updated[index] = { ...updated[index], value: e.target.value };
                      setEditMetrics(updated);
                    }}
                    placeholder="Enter value"
                    className="flex-1 px-3 py-2 border-2 border-emerald-200 rounded-lg text-lg focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-gray-500 text-sm">{metric.unit}</span>
                </div>
              ) : (
                <div className="mb-2">
                  <span className="text-3xl text-black font-bold">
                    {metric.value || '—'}
                  </span>
                  <span className="text-gray-600 ml-2 text-sm">{metric.unit}</span>
                </div>
              )}

              {!isEditingMetrics && metric.updated_at && (
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(metric.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="card border-2 border-emerald-200">
        <div className="flex gap-2 mb-6 border-b-2 border-emerald-100 pb-4 overflow-x-auto">
          {[
            { id: 'personal',  label: 'Personal Info',    icon: User },
            { id: 'medical',   label: 'Medical History',  icon: Heart },
            { id: 'insurance', label: 'Insurance',        icon: Shield },
            { id: 'documents', label: 'Documents',        icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'First Name', key: 'firstName', type: 'text', icon: <User className="w-5 h-5" /> },
                { label: 'Last Name',  key: 'lastName',  type: 'text', icon: <User className="w-5 h-5" /> },
                { label: 'Email',      key: 'email',     type: 'email', icon: <Mail className="w-5 h-5" />, disabled: true },
                { label: 'Phone',      key: 'phone',     type: 'tel',  icon: <Phone className="w-5 h-5" /> },
                { label: 'Date of Birth', key: 'dateOfBirth', type: 'date', icon: <Calendar className="w-5 h-5" /> },
                { label: 'Height',     key: 'height',    type: 'text', icon: <Ruler className="w-5 h-5" />, placeholder: "e.g. 5'10\"" },
                { label: 'Weight',     key: 'weight',    type: 'text', icon: <Weight className="w-5 h-5" />, placeholder: 'e.g. 70 kg' },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">{field.label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">{field.icon}</span>
                    <input
                      type={field.type}
                      disabled={!isEditing || field.disabled}
                      value={isEditing ? (editData as any)[field.key] : (profileData as any)[field.key]}
                      onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                      placeholder={field.placeholder || ''}
                      className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-50"
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-medium">Gender</label>
                <select
                  disabled={!isEditing}
                  value={isEditing ? editData.gender : profileData.gender}
                  onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                >
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-medium">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                  <select
                    disabled={!isEditing}
                    value={isEditing ? editData.bloodGroup : profileData.bloodGroup}
                    onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  >
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-6 border-t-2 border-emerald-200">
              <h4 className="text-black mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-gray-700 text-sm">Street Address</label>
                  <input type="text" disabled={!isEditing}
                    value={isEditing ? editData.address : profileData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                </div>
                {[
                  { label: 'City', key: 'city' },
                  { label: 'State', key: 'state' },
                  { label: 'ZIP Code', key: 'zipCode' },
                ].map(f => (
                  <div key={f.key} className="space-y-2">
                    <label className="block text-gray-700 text-sm">{f.label}</label>
                    <input type="text" disabled={!isEditing}
                      value={isEditing ? (editData as any)[f.key] : (profileData as any)[f.key]}
                      onChange={(e) => setEditData({ ...editData, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-6 border-t-2 border-emerald-200">
              <h4 className="text-black mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" /> Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Name', key: 'emergencyContactName' },
                  { label: 'Phone', key: 'emergencyContactPhone' },
                  { label: 'Relationship', key: 'emergencyContactRelation' },
                ].map(f => (
                  <div key={f.key} className="space-y-2">
                    <label className="block text-gray-700 text-sm">{f.label}</label>
                    <input type="text" disabled={!isEditing}
                      value={isEditing ? (editData as any)[f.key] : (profileData as any)[f.key]}
                      onChange={(e) => setEditData({ ...editData, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medical Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-6">
            {[
              { label: 'Allergies', key: 'allergies', icon: <AlertCircle className="w-5 h-5 text-red-600" />, border: 'border-red-200 focus:ring-red-500 focus:border-red-500' },
              { label: 'Chronic Conditions', key: 'chronicConditions', icon: <Heart className="w-5 h-5 text-emerald-600" />, border: 'border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500' },
              { label: 'Current Medications', key: 'currentMedications', icon: <Activity className="w-5 h-5 text-emerald-600" />, border: 'border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500' },
            ].map(f => (
              <div key={f.key} className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">{f.icon} {f.label}</label>
                <textarea
                  disabled={!isEditing}
                  value={isEditing ? (editData as any)[f.key] : (profileData as any)[f.key]}
                  onChange={(e) => setEditData({ ...editData, [f.key]: e.target.value })}
                  rows={3}
                  placeholder={`Enter ${f.label.toLowerCase()}...`}
                  className={`w-full px-4 py-3 border-2 ${f.border} rounded-lg transition-all disabled:bg-gray-50`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Insurance Tab */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Insurance Provider', key: 'insuranceProvider' },
                { label: 'Insurance Number', key: 'insuranceNumber' },
              ].map(f => (
                <div key={f.key} className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">{f.label}</label>
                  <input type="text" disabled={!isEditing}
                    value={isEditing ? (editData as any)[f.key] : (profileData as any)[f.key]}
                    onChange={(e) => setEditData({ ...editData, [f.key]: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                </div>
              ))}
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-medium">Expiry Date</label>
                <input type="date" disabled={!isEditing}
                  value={isEditing ? editData.insuranceExpiry : profileData.insuranceExpiry}
                  onChange={(e) => setEditData({ ...editData, insuranceExpiry: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-lg border-2 border-emerald-300">
              <h4 className="text-black mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Coverage Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Provider',      value: profileData.insuranceProvider || '—' },
                  { label: 'Policy Number', value: profileData.insuranceNumber    || '—' },
                  { label: 'Status',        value: 'Active' },
                  { label: 'Valid Until',   value: profileData.insuranceExpiry    || '—' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-white rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                    <p className="text-black font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="p-6 bg-emerald-50 rounded-lg border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-all cursor-pointer">
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-black mb-2">Upload Medical Documents</h4>
                <p className="text-gray-500 text-sm mb-4">Drag and drop or click to browse</p>
                <button className="btn-primary flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Choose Files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}