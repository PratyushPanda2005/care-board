import { useState } from 'react';
import { StatCard } from './components/StatCard';
import { SimpleBarChart, SimplePieChart } from './components/Chart';
import { PatientTable } from './components/PatientTable';
import { PatientModal } from './components/PatientModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { usePatients } from './hooks/usePatients';
import type { Patient } from './types';
import { 
  Users, 
  Heart, 
  UserCheck, 
  UserPlus, 
  Activity,
  Plus,
  RefreshCw 
} from 'lucide-react';

function App() {
  const {
    patients,
    stats,
    chartData,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    refreshData
  } = usePatients();

  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddPatient = () => {
    setSelectedPatient(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      deletePatient(patientId);
    }
  };

  const handleSavePatient = (patient: Patient) => {
    if (modalMode === 'create') {
      addPatient(patient);
    } else if (modalMode === 'edit') {
      updatePatient(patient);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading patient data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refreshData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">CareBoard Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleAddPatient}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            color="bg-blue-600"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Critical Patients"
            value={stats.criticalPatients}
            icon={Heart}
            color="bg-red-600"
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Discharged Today"
            value={stats.dischargedToday}
            icon={UserCheck}
            color="bg-green-600"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Admitted Today"
            value={stats.admittedToday}
            icon={UserPlus}
            color="bg-orange-600"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={Activity}
            color="bg-purple-600"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleBarChart data={chartData.admissionTrends} title="Weekly Admission Trends" />
          <SimplePieChart data={chartData.departmentData} title="Patients by Department" />
        </div>

        <PatientTable
          patients={patients}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
          onView={handleViewPatient}
        />

        <PatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePatient}
          patient={selectedPatient}
          mode={modalMode}
        />
      </main>
    </div>
  );
}

export default App;