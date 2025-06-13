import { useState, useEffect } from 'react';
import type { Patient, DashboardStats } from '../types';
import { fetchPatients, calculateStats, generateChartData } from '../services/api';
type DepartmentData = {
  name: string;
  value: number;
  color: string;
}[];

type AdmissionTrends = {
  name: string;
  value: number;
}[];

type ChartData = {
  departmentData: DepartmentData;
  admissionTrends: AdmissionTrends;
};
export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    criticalPatients: 0,
    dischargedToday: 0,
    admittedToday: 0,
    occupancyRate: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    departmentData: [],
    admissionTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPatients = await fetchPatients();
      setPatients(fetchedPatients);
      setStats(calculateStats(fetchedPatients));
      setChartData(generateChartData(fetchedPatients));
    } catch (err) {
      setError('Failed to load patient data. Please try again.');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const addPatient = (patient: Patient) => {
    const updatedPatients = [...patients, patient];
    setPatients(updatedPatients);
    setStats(calculateStats(updatedPatients));
    setChartData(generateChartData(updatedPatients));
  };

  const updatePatient = (updatedPatient: Patient) => {
    const updatedPatients = patients.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    );
    setPatients(updatedPatients);
    setStats(calculateStats(updatedPatients));
    setChartData(generateChartData(updatedPatients));
  };

  const deletePatient = (patientId: string) => {
    const updatedPatients = patients.filter(p => p.id !== patientId);
    setPatients(updatedPatients);
    setStats(calculateStats(updatedPatients));
    setChartData(generateChartData(updatedPatients));
  };

  return {
    patients,
    stats,
    chartData,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    refreshData: loadPatients
  };
};