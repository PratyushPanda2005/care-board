export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    admissionDate: string;
    condition: string;
    department: string;
    status: 'Admitted' | 'Discharged' | 'Critical' | 'Stable';
    doctor: string;
    room: string;
    insurance: string;
    emergencyContact: string;
    emergencyPhone: string;
    email?: string;
    address?: string;
  }
  
  export interface DashboardStats {
    totalPatients: number;
    criticalPatients: number;
    dischargedToday: number;
    admittedToday: number;
    occupancyRate: number;
  }
  
  export interface ChartData {
    name: string;
    value: number;
    color?: string;
  }
  
  export interface DummyUser {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    address: {
      address: string;
      city: string;
      state: string;
    };
  }