import type { DummyUser } from '../types';
import type { Patient } from '../types';
const API_BASE_URL = 'https://dummyjson.com';

const medicalConditions = [
  'Pneumonia', 'Hypertension', 'Diabetes Type 2', 'Myocardial Infarction',
  'Appendicitis', 'Stroke', 'Kidney Stones', 'Asthma', 'Bronchitis',
  'Gastroenteritis', 'Migraine', 'Arthritis', 'Fracture', 'Infection',
  'Chest Pain', 'Abdominal Pain', 'Fever', 'Dehydration'
];

const departments = [
  'Internal Medicine', 'Cardiology', 'Surgery', 'Emergency',
  'Neurology', 'Pediatrics', 'Orthopedics', 'Pulmonology',
  'Gastroenterology', 'Endocrinology', 'Urology', 'Oncology'
];

const doctors = [
  'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. David Park',
  'Dr. Lisa Wang', 'Dr. James Liu', 'Dr. Sarah Kim',
  'Dr. Robert Johnson', 'Dr. Maria Garcia', 'Dr. John Smith',
  'Dr. Jennifer Brown', 'Dr. William Davis', 'Dr. Amanda Wilson'
];

const insuranceProviders = [
  'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'United Healthcare',
  'Kaiser Permanente', 'Humana', 'Medicare', 'Medicaid'
];

const statusOptions = [
  { status: 'Admitted', weight: 40 },
  { status: 'Stable', weight: 35 },
  { status: 'Critical', weight: 15 },
  { status: 'Discharged', weight: 10 }
];

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getWeightedRandomStatus = (): Patient['status'] => {
  const totalWeight = statusOptions.reduce((sum, option) => sum + option.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const option of statusOptions) {
    random -= option.weight;
    if (random <= 0) {
      return option.status as Patient['status'];
    }
  }
  
  return 'Admitted';
};

const generateRoomNumber = (): string => {
  const floor = Math.floor(Math.random() * 5) + 1;
  const room = Math.floor(Math.random() * 50) + 1;
  const wing = String.fromCharCode(65 + Math.floor(Math.random() * 6)); 
  return `${wing}${floor}${room.toString().padStart(2, '0')}`;
};

const generateAdmissionDate = (): string => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30); 
  const admissionDate = new Date(today);
  admissionDate.setDate(today.getDate() - daysAgo);
  return admissionDate.toISOString().split('T')[0];
};

const transformUserToPatient = (user: DummyUser): Patient => {
  const status = getWeightedRandomStatus();
  
  return {
    id: user.id.toString(),
    name: `${user.firstName} ${user.lastName}`,
    age: user.age,
    gender: user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other',
    admissionDate: generateAdmissionDate(),
    condition: getRandomItem(medicalConditions),
    department: getRandomItem(departments),
    status,
    doctor: getRandomItem(doctors),
    room: generateRoomNumber(),
    insurance: getRandomItem(insuranceProviders),
    emergencyContact: `Emergency Contact ${user.id}`,
    emergencyPhone: user.phone,
    email: user.email,
    address: `${user.address.address}, ${user.address.city}, ${user.address.state}`
  };
};

export const fetchUsers = async (): Promise<DummyUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?limit=30`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    const users = await fetchUsers();
    return users.map(transformUserToPatient);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

export const calculateStats = (patients: Patient[]) => {
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.status === 'Critical').length;
  const today = new Date().toISOString().split('T')[0];
  const dischargedToday = patients.filter(p => 
    p.status === 'Discharged' && p.admissionDate === today
  ).length;
  const admittedToday = patients.filter(p => 
    p.status === 'Admitted' && p.admissionDate === today
  ).length;
  
  const occupiedBeds = patients.filter(p => p.status !== 'Discharged').length;
  const occupancyRate = Math.round((occupiedBeds / 200) * 100);
  
  return {
    totalPatients,
    criticalPatients,
    dischargedToday,
    admittedToday,
    occupancyRate
  };
};

export const generateChartData = (patients: Patient[]) => {
  const departmentCounts = patients.reduce((acc, patient) => {
    acc[patient.department] = (acc[patient.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentColors = [
    '#2563EB', '#0891B2', '#059669', '#EA580C', '#7C3AED', 
    '#DC2626', '#65A30D', '#6B7280', '#F59E0B', '#8B5CF6'
  ];

  const departmentData = Object.entries(departmentCounts)
    .map(([name, value], index) => ({
      name,
      value,
      color: departmentColors[index % departmentColors.length]
    }))
    .sort((a, b) => b.value - a.value);

  const admissionTrends = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayName = dayNames[date.getDay()];
    
    const admissions = patients.filter(p => p.admissionDate === dateString).length;
    admissionTrends.push({
      name: dayName,
      value: admissions
    });
  }

  return { departmentData, admissionTrends };
};